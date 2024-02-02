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
        <title>Degen Picks</title>
        <meta name="title" content={`Degen Picks`} />
        <meta
          name="description"
          content={`PvP betting pools built on Solana. Make a pick or create a pool today.`}
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${generalConfig.baseUrl}`} />
        <meta property="og:title" content={`Degen Picks`} />
        <meta
          property="og:description"
          content={`PvP betting pools built on Solana. Make a pick or create a pool today.`}
        />
        <meta
          property="og:image"
          content={`https://shdw-drive.genesysgo.net/Faa2qSmx1E6W7eE8JuxPUW5Vg1EoPxkmJANFbAfUThmN/dp-social-share.png`}
        />
        <meta property="og:image:width" content="1800" />
        <meta property="og:image:height" content="941" />

        {/* <!-- Twitter --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`Degen Picks`} />
        <meta
          property="twitter:description"
          content={`Degen Picks: An all-or-nothing sports prediction game with DUST.`}
        />
        <meta
          property="twitter:image"
          content={`https://shdw-drive.genesysgo.net/Faa2qSmx1E6W7eE8JuxPUW5Vg1EoPxkmJANFbAfUThmN/dp-social-share.png`}
        />
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
