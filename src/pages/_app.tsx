import "../styles/globals.css";
import { FC, useMemo } from "react";
import { generalConfig, utilConfig } from "@/configs";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Head from "next/head";
import { AppProps } from "next/app";
import { Toaster } from "sonner";
import { WagerUserContextProvider } from "@/components/stores/WagerUserStore";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { GoogleAnalytics } from '@next/third-parties/google'

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const queryClient = new QueryClient();

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network =
    utilConfig.cluster === "devnet"
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = utilConfig.httpRPC;

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  const THEME = createTheme({
    typography: {
      fontFamily: `"pixel", "-apple-system", "system-ui", "monospace"`,
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
  });

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        {/* <!-- Primary Meta Tags --> */}
        <title>de[superbowl]</title>
        <meta name="title" content={`de[superbowl]`} />
        <meta
          name="description"
          content={`de[superbowl]: The ultimate Superbowl experience on Solana. Built by Degen Picks, sponsored by DeLabs.`}
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${generalConfig.baseUrl}`} />
        <meta property="og:title" content={`de[superbowl]`} />
        <meta
          property="og:description"
          content={`de[superbowl]: The ultimate Superbowl experience on Solana. Built by Degen Picks, sponsored by DeLabs.`}
        />
        <meta property="og:image" content={`/images/share_img.png`} />
        <meta property="og:image:width" content="1800" />
        <meta property="og:image:height" content="941" />

        {/* <!-- Twitter --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`de[superbowl]`} />
        <meta
          property="twitter:description"
          content={`de[superbowl]: The ultimate Superbowl experience on Solana. Built by Degen Picks, sponsored by DeLabs.`}
        />
        <meta property="twitter:image" content={`/images/share_img.png`} />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={THEME}>
          <WagerUserContextProvider>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Component {...pageProps} />
                  <Toaster />
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </WagerUserContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
