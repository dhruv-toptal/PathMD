import AuthProvider from "@/services/auth/auth-provider";
import "../globals.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { dir } from "i18next";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import type { Metadata } from "next";
import SnackbarProvider from "@/components/snackbar-provider";
import { getServerTranslation } from "@/services/i18n";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import ThemeProvider from "@/components/theme/theme-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import queryClient from "@/services/react-query/query-client";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
import PermanentDrawerTop from "@/components/permanent-drawer-top";
import { Box } from "@mui/material";
import { ApolloWrapper } from "./ApolloWrapper";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode;
  params: { language: string };
}) {
  return (
    <html lang={language} dir={dir(language)}>
      <body>
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <StoreLanguageProvider>
                <ConfirmDialogProvider>
                  <AuthProvider>
                    <GoogleAuthProvider>
                      <FacebookAuthProvider>
                        <LeavePageProvider>
                          <ApolloWrapper>
                            <Box
                              style={{
                                height: "100vh",
                                width: "100%",
                              }}
                            >
                              <PermanentDrawerTop />
                              {children}
                            </Box>
                          </ApolloWrapper>
                        </LeavePageProvider>
                      </FacebookAuthProvider>
                    </GoogleAuthProvider>
                  </AuthProvider>
                </ConfirmDialogProvider>
              </StoreLanguageProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
