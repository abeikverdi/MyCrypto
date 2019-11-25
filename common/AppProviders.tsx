import React, { useEffect } from 'react';

import { NotificationsProvider, ToastProvider } from 'v2/features';
import { DATA_INIT } from 'v2/config';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider,
  createDataSeed,
  StorageService,
  LOCALSTORAGE_KEY
} from 'v2/services/Store';
import { DevToolsProvider, RatesProvider, StoreProvider } from 'v2/services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  useEffect(() => {
    const seed = createDataSeed(true)(DATA_INIT);
    // const check = localStorage.getItem(LOCALSTORAGE_KEY);
    // if (!check || check === '[]' || check === '{}') {
    StorageService.instance.setEntry(LOCALSTORAGE_KEY, seed);
    // }
  }, []);

  return (
    <DevToolsProvider>
      <SettingsProvider>
        <AddressBookProvider>
          <AccountProvider>
            <NotificationsProvider>
              <ToastProvider>
                <NetworkProvider>
                  <AssetProvider>
                    {/* StoreProvider relies on the others Providers */}
                    <StoreProvider>
                      {/* RatesProvider relies on the Store */}
                      <RatesProvider>{children}</RatesProvider>
                    </StoreProvider>
                  </AssetProvider>
                </NetworkProvider>
              </ToastProvider>
            </NotificationsProvider>
          </AccountProvider>
        </AddressBookProvider>
      </SettingsProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
