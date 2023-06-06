import { VenomConnect } from 'venom-connect';
import './App.css';
import { Button } from '@mui/material';
import { ProviderRpcClient } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient } from 'everscale-standalone-client';
import { useEffect, useState } from 'react';

function App() {
  const [venomConnect, setVenomConnect] = useState();
  const [venomProvider, setVenomProvider] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();

  const standaloneFallback = () =>
    EverscaleStandaloneClient.create({
      connection: {
        id: 1000,
        group: 'venom_testnet',
        type: 'jrpc',
        data: {
          endpoint: 'https://jrpc.venom.foundation/rpc',
        },
      },
    });

  const initVenomConnect = async () => {
    return new VenomConnect({
      theme: null,
      checkNetworkId: 1000,
      providersOptions: {
        venomwallet: {
          links: {
            // extension: [
            //   {
            //     browser: "chrome", // "chrome" | "firefox"
            //     link: "https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch",
            //   },
            // ],
            // ios: "https://testflight.apple.com/join/x5jOlxzL",
            // android: "https://venomwallet.page.link/download",
            // qr:
            //   // url
            //   //
            //   "https://venomwallet.page.link" +
            //   //
            //   // params
            //   //
            //   "/?link=" +
            //   encodeURIComponent(window.location.href) + '/#' +
            //   //
            //   "&apn=" +
            //   "com.venom.wallet" +
            //   //
            //   "&isi=" +
            //   "1622970889" +
            //   //
            //   "&ibi=" +
            //   "foundation.venom.wallet",
            //
            //   // qr: {
            //   //   targetLink: "",
            //   // },
            //   // ios: {
            //   //   targetLink: "",
            //   // },
          },
          walletWaysToConnect: [
            {
              // NPM package
              package: ProviderRpcClient,
              packageOptions: {
                fallback:
                  VenomConnect.getPromise('venomwallet', 'extension') ||
                  (() => Promise.reject()),
                forceUseFallback: true,
              },
              packageOptionsStandalone: {
                fallback: standaloneFallback,
                forceUseFallback: true,
              },

              // Setup
              id: 'extension',
              type: 'extension',

              // name: "Custom Name",
              // logo: "",

              // High-level setup
              // options: ,
              // connector: ,
              // authConnector: ,
            },
          ],
          defaultWalletWaysToConnect: [
            // List of enabled options
            'mobile',
            'ios',
            'android',
          ],
        },
        //
        // Temporarily hidden Ever wallet
        //
        // everwallet: {
        //   links: {
        //     qr: null,
        //   },
        //   walletWaysToConnect: [
        //     {
        //       // NPM package
        //       package: ProviderRpcClient,
        //       packageOptions: {
        //         fallback:
        //           VenomConnect.getPromise("everwallet", "extension") ||
        //           (() => Promise.reject()),
        //         forceUseFallback: true,
        //       },
        //       packageOptionsStandalone: {
        //         fallback: standaloneFallback,
        //         forceUseFallback: true,
        //       },
        //       id: "extension",
        //       type: "extension",
        //     },
        //   ],
        //   defaultWalletWaysToConnect: [
        //     // List of enabled options
        //     "mobile",
        //     "ios",
        //     "android",
        //   ],
        // },
      },
    });
  };

  const getAddress = async (provider) => {
    const providerState = await provider?.getProviderState?.();

    const address =
      providerState?.permissions.accountInteraction?.address.toString();

    return address;
  };

  const getBalance = async (provider, _address) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address);

      return providerBalance;
    } catch (error) {
      return undefined;
    }
  };

  const checkAuth = async (_venomConnect) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect();
    // you can save venomConnect here
    setVenomConnect(initedVenomConnect);

    // and check the Authorization
    await checkAuth(initedVenomConnect);
  };

  const onConnectButtonClick = async () => {
    venomConnect?.connect();
  };

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect();
  };

  const check = async (_provider) => {
    const _address = _provider ? await getAddress(_provider) : undefined;
    const _balance =
      _provider && _address ? await getBalance(_provider, _address) : undefined;

    setAddress(_address);
    setBalance(_balance);

    if (_provider && _address)
      setTimeout(() => {
        check(_provider);
      }, 7000);
  };

  const onConnect = async (provider) => {
    setVenomProvider(provider);

    check(provider);
  };

  useEffect(() => {
    const off = venomConnect?.on('connect', onConnect);

    return () => {
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!venomConnect && (
            <Button variant="contained" onClick={onInitButtonClick}>
              Init lib
            </Button>
          )}
          {venomConnect && (
            <div>
              {venomConnect && !address && (
                <Button variant="contained" onClick={onConnectButtonClick}>
                  Connect Wallet
                </Button>
              )}
              {venomConnect && !!address && (
                <Button variant="contained" onClick={onDisconnectButtonClick}>
                  Disconnect
                </Button>
              )}
              <div>
                balance: {balance ? (balance / 10 ** 9).toFixed(2) : undefined}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
