import { DATA_INIT } from 'v2/config';
import { LocalCache, LSKeys } from 'v2/types';
import { createDataSeed } from './seed';

describe('Data Seed', () => {
  let defaultData: LocalCache;
  let testData: LocalCache;

  const toArray = (object: any): any[] => Object.values(object);

  beforeAll(() => {
    defaultData = createDataSeed(false)(DATA_INIT);
    testData = createDataSeed(true)(DATA_INIT);
  });

  it('defaultData has with valid properties', () => {
    const ref = Object.keys(DATA_INIT);
    const real = Object.keys(defaultData);
    expect(ref).toEqual(real);
  });

  it('excludes testAccounts by default', () => {
    const accounts = toArray(defaultData[LSKeys.ACCOUNTS]);
    expect(accounts.length).toEqual(0);
  });

  describe('Test: Accounts', () => {
    it('includes accounts', () => {
      const accounts = toArray(testData[LSKeys.ACCOUNTS]);
      expect(accounts.length).toBeGreaterThanOrEqual(5);
    });

    it('includes addressBook', () => {
      const contacts = toArray(testData[LSKeys.ADDRESS_BOOK]);
      expect(contacts.length).toBeGreaterThan(1);
    });

    it('includes a label for each addressBook entry', () => {
      const contacts = toArray(testData[LSKeys.ADDRESS_BOOK]);
      const withLabels = contacts.filter(({ label }) => label);
      expect(contacts.length).toEqual(withLabels.length);
    });

    it('includes accounts in settings', () => {
      const { dashboardAccounts } = testData[LSKeys.SETTINGS];
      expect(dashboardAccounts.length).toBeGreaterThan(1);
    });

    it('provides a valid asset uuid to account assets', () => {
      const accountAssets = toArray(testData[LSKeys.ACCOUNTS])
        .flatMap(({ assets }) => assets)
        .map(a => (a.uuid ? testData.assets[a.uuid] : a));
      expect(accountAssets.length).toBeGreaterThanOrEqual(1);
      accountAssets.forEach(a => expect(a).toBeDefined());
    });
  });

  describe('Seed: Contracts', () => {
    it('add Contracts to Store', () => {
      const contracts = toArray(defaultData[LSKeys.CONTRACTS]);
      expect(contracts.length).toBeGreaterThanOrEqual(87);
    });
  });

  describe('Seed: Networks', () => {
    it('adds Contracts to Networks', () => {
      const contracts = toArray(defaultData[LSKeys.NETWORKS]).flatMap(n => n.contracts);
      expect(contracts.length).toBeGreaterThanOrEqual(87);
    });

    it('adds Nodes to each Network', () => {
      const nodes = toArray(defaultData[LSKeys.NETWORKS]).flatMap(n => n.nodes);
      expect(nodes.length).toBe(43);
    });

    it('adds BaseAssets to Networks', () => {
      const networkBaseAssets = toArray(defaultData[LSKeys.NETWORKS]).map(
        ({ baseAsset }) => baseAsset
      );
      const networkAssets = toArray(defaultData[LSKeys.NETWORKS]).flatMap(({ assets }) => assets);

      networkBaseAssets.forEach(baseAsset => {
        const match = networkAssets.findIndex(aUuid => aUuid === baseAsset);
        expect(match).toBeGreaterThanOrEqual(0);
      });
    });

    it('adds Tokens to Networks', () => {
      const allAssets = defaultData[LSKeys.ASSETS];
      const tokens = toArray(allAssets)
        .filter(({ type }) => type === 'erc20')
        .filter(Boolean);
      const networkAssets = toArray(defaultData[LSKeys.NETWORKS])
        .flatMap(({ assets }) => assets)
        .filter(uuid => allAssets[uuid].type === 'erc20')
        .filter(Boolean); // Not all networks have assets!

      expect(networkAssets.length).toBeGreaterThan(1);
      expect(networkAssets.length).toEqual(tokens.length);
    });
  });

  describe('Seed: Assets', () => {
    it("adds each Network's baseAsset to Assets", () => {
      const networks = toArray(defaultData[LSKeys.NETWORKS]);
      const baseAssets = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'base');
      expect(baseAssets.length).toEqual(networks.length);
    });

    it('adds default Fiats as Assets', () => {
      const fiats = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'fiat');
      expect(fiats.length).toBeGreaterThanOrEqual(3);
    });

    it('adds Tokens to Assets', () => {
      const tokens = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'erc20');
      expect(tokens.length).toEqual(1451);
    });
  });
});
