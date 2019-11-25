import * as R from 'ramda';

import { generateUUID } from 'v2/utils';
import {
  Fiats,
  DEFAULT_ASSET_DECIMAL,
  NODES_CONFIG,
  NETWORKS_CONFIG,
  devAccounts,
  DevAccount,
  SeedAssetBalance,
  devAssets,
  devContacts
} from 'v2/config';
import {
  Asset,
  AssetBalanceObject,
  ExtendedAccount,
  AddressBook,
  ExtendedAsset,
  ExtendedContract,
  LocalCache,
  NetworkId,
  NetworkLegacy,
  WalletId,
  Network,
  TUuid,
  TSymbol,
  Fiat,
  ContractLegacy,
  AssetLegacy,
  ISettings,
  LSKeys
} from 'v2/types';

/* Types */
type DevData = Asset[] | DevAccount[] | Record<string | TUuid, AddressBook>;
type SeedData = typeof NETWORKS_CONFIG | Fiat[] | DevData;
type StoreProp = Record<NetworkId, Network> | any;
type StoreAction = (store: LocalCache) => LocalCache;
type FlowReducer = (data?: SeedData, store?: LocalCache) => StoreProp;
type FlowTransducer = (key: LSKeys) => (fn: FlowReducer) => (data?: SeedData) => StoreAction;
type GenObject<T> = Record<keyof T, T>;

/* Helpers */
const withUuid = <T extends {}>(fn: () => TUuid) => (x: T): T => ({ ...x, uuid: fn() });
const toArray = (object: any): any[] => Object.values(object);
const toObject = <T extends {}>(keyInElem: keyof T) => (
  acc: GenObject<T>,
  elem: T
): GenObject<T> => ({
  ...acc,
  [elem[keyInElem] as any]: elem
});
const add: FlowTransducer = key => fn => data => store => {
  return {
    ...store,
    [key]: fn(data, store)
  };
};

/* Transducers */
const addNetworks = add(LSKeys.NETWORKS)((networks: SeedData) => {
  const formatNetwork = (n: NetworkLegacy): Network => {
    const baseAssetUuid = generateUUID();
    return {
      // Also availbale are: blockExplorer, tokenExplorer, tokens aka assets, contracts
      id: n.id,
      name: n.name,
      chainId: n.chainId,
      isCustom: n.isCustom,
      isTestnet: n.isTestnet,
      color: n.color,
      gasPriceSettings: n.gasPriceSettings,
      shouldEstimateGasPrice: n.shouldEstimateGasPrice,
      dPaths: {
        ...n.dPaths,
        default: n.dPaths[WalletId.MNEMONIC_PHRASE] // Set default dPath
      },
      contracts: [],
      assets: [],
      baseAsset: baseAssetUuid, // Set baseAssetUuid
      baseUnit: n.unit,
      nodes: NODES_CONFIG[n.name as NetworkId]
    };
  };

  return R.mapObjIndexed(formatNetwork, networks);
});

const addContracts = add(LSKeys.CONTRACTS)(
  (networks: Record<NetworkId, NetworkLegacy>, store: LocalCache) => {
    const formatContract = (id: NetworkId) => (c: ContractLegacy): ExtendedContract => ({
      uuid: generateUUID(),
      name: c.name,
      address: c.address,
      abi: c.abi,
      networkId: id
    });

    // Transform { ETH: { contracts: [ {<contract>} ] }}
    // to   { <contract_uuid>: {<contract>} }
    return R.pipe(
      R.map(({ id, contracts }) => ({ id, contracts })),
      R.filter(({ contracts }) => contracts),
      R.chain(({ id, contracts }): ExtendedAsset[] => contracts.map(formatContract(id))),
      R.reduce(toObject('uuid'), {}),
      R.mergeRight(store.contracts)
    )(toArray(networks));
  }
);

const addContractsToNetworks = add(LSKeys.NETWORKS)((_, store: LocalCache) => {
  const getNetworkContracts = (n: Network) => {
    const nContracts = R.filter(c => c.networkId === n.id, store.contracts);
    return {
      ...n,
      contracts: toArray(nContracts).map(c => c.uuid)
    };
  };
  return R.mapObjIndexed(getNetworkContracts, store.networks);
});

const addBaseAssetsToAssets = add(LSKeys.ASSETS)((_, store: LocalCache) => {
  const formatAsset = (n: Network): Asset => ({
    uuid: n.baseAsset,
    ticker: n.baseUnit,
    name: n.name,
    networkId: n.id,
    type: 'base',
    decimal: DEFAULT_ASSET_DECIMAL
  });

  // From { <networkId>: { baseAsset: <asset_uui> } }
  // To   { <asset_uuid>: <asset> }
  return R.pipe(
    toArray,
    R.map(formatAsset),
    R.reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    R.mergeRight(store.assets) // Ensure we return an object with existing assets as well
  )(store.networks);
});

const addFiatsToAssets = add(LSKeys.ASSETS)((fiats: Fiat[], store: LocalCache) => {
  const formatFiat = ({ code, name }: Fiat): ExtendedAsset => ({
    uuid: generateUUID(),
    name,
    ticker: code,
    networkId: undefined,
    type: 'fiat',
    decimal: 0
  });

  // From { <fiat_key>: <fiat_asset> }
  // To   { <asset_uuid>: <asset> }
  return R.pipe(
    R.map(formatFiat),
    R.reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    R.mergeRight(store.assets)
  )(fiats);
});

const addTokensToAssets = add(LSKeys.ASSETS)(
  (networks: typeof NETWORKS_CONFIG, store: LocalCache) => {
    const formatToken = (id: NetworkId) => (a: AssetLegacy): ExtendedAsset => ({
      uuid: a.uuid || generateUUID(), // In case a token doesn't have a pregenerated uuid. eg. RSK
      name: a.name,
      decimal: a.decimal,
      ticker: (a.symbol as unknown) as TSymbol,
      networkId: id,
      contractAddress: a.address,
      type: 'erc20'
    });

    // From { ETH: { tokens: [ {<tokens>} ] }}
    // to   { <asset_uuid>: {<asset>} }
    return R.pipe(
      R.map(({ id, tokens }) => ({ id, tokens })),
      R.filter(({ tokens }) => tokens),
      R.chain(({ id, tokens }): ExtendedAsset[] => tokens.map(formatToken(id))),
      R.reduce(toObject('uuid'), {}),
      R.mergeRight(store.assets)
    )(toArray(networks));
  }
);

const updateNetworkAssets = add(LSKeys.NETWORKS)((_, store: LocalCache) => {
  // Since we added baseAsset and tokens to Assets this will return both.
  const findNetworkAssets = (nId: NetworkId): Asset[] =>
    toArray(store.assets).filter(a => a.networkId === nId);

  const getAssetUuid = (n: Network) =>
    findNetworkAssets(n.id)
      .filter(Boolean)
      .map(a => a.uuid);

  return R.mapObjIndexed(
    (n: Network) => ({
      ...n,
      assets: [...n.assets, ...getAssetUuid(n)]
    }),
    store.networks
  );
});

/* DevData */
const addDevAssets = add(LSKeys.ASSETS)((assets: Asset[], store: LocalCache) => {
  const assetsToAdd = assets.reduce((acc, curr) => {
    const match = toArray(store.assets).find(
      a => a.ticker === curr.ticker && a.networkId === curr.networkId
    );
    const uuid = match ? match.uuid : curr.uuid;
    return {
      ...acc,
      [uuid]: { ...curr, uuid }
    };
  }, {});
  // ! These assets should also be added to the correct network.
  return R.mergeRight(store.assets, assetsToAdd);
});

const addDevAccounts = add(LSKeys.ACCOUNTS)((accounts: DevAccount[], store: LocalCache) => {
  const formatAccountAssetBalance = (networkId: NetworkId) => (
    a: SeedAssetBalance
  ): AssetBalanceObject => {
    // We set static uuid for assets in our seed files.
    // In the previous step we updated the Assets uuids to match our default ones.
    // When add seed accounts we search for asset info by uuid, or update value in the account.
    const match: Asset =
      store.assets[a.uuid] ||
      toArray(store.assets).find(sa => sa.ticker === a.ticker && sa.networkId === networkId);

    return {
      balance: a.balance,
      mtime: a.mtime,
      uuid: match ? match.uuid : a.uuid
    };
  };

  const updateAssetUuid = ({ assets, ...rest }: ExtendedAccount): ExtendedAccount => ({
    ...rest,
    assets: assets.map(formatAccountAssetBalance(rest.networkId))
  });

  return R.pipe(
    R.map(withUuid(generateUUID)),
    //@ts-ignore ie. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581
    R.map(updateAssetUuid),
    R.reduce(toObject('uuid'), {}),
    R.mergeRight(store.accounts)
  )(accounts);
});

const addDevAccountsToSettings = add(LSKeys.SETTINGS)((_, store: LocalCache) => {
  const updateDashboardAccounts = (src: TUuid[]) => ({
    dashboardAccounts,
    ...rest
  }: ISettings): ISettings => ({
    ...rest,
    dashboardAccounts: R.concat(dashboardAccounts, src)
  });
  return R.pipe(updateDashboardAccounts(R.keys(store.accounts) as TUuid[]))(store.settings);
});

const addDevAddressBook = add(LSKeys.ADDRESS_BOOK)((contacts: Record<string, AddressBook>, _) => {
  return contacts;
});

/* Define flow order */
const defaultTransducers: StoreAction[] = [
  addNetworks(NETWORKS_CONFIG),
  addContracts(NETWORKS_CONFIG),
  addContractsToNetworks(),
  addBaseAssetsToAssets(),
  addFiatsToAssets(toArray(Fiats)),
  addTokensToAssets(NETWORKS_CONFIG),
  updateNetworkAssets()
];

const devDataTransducers: StoreAction[] = [
  addDevAssets(toArray(devAssets)),
  addDevAccounts(toArray(devAccounts)),
  addDevAddressBook(devContacts),
  addDevAccountsToSettings()
];

/* Handler to trigger the flow according the environment */
export const createDataSeed = (shouldSeedDevData: boolean) => (initialStore: LocalCache) => {
  const flow: StoreAction[] =
    shouldSeedDevData && devDataTransducers.length > 0
      ? [...defaultTransducers, ...devDataTransducers]
      : [...defaultTransducers];

  // Ts doesn't recognise this spread as arguments.
  // @ts-ignore
  return R.pipe(...flow)(initialStore);
};
