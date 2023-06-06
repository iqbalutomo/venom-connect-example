import { ProviderRpcClient } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient } from 'everscale-standalone-client';
import { VenomConnect } from 'venom-connect';

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

export const initVenomConnect = async () => {
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
