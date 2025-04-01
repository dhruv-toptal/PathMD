"use client";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import { PropsWithChildren, useMemo } from "react";

declare module "@mui/material/styles" {
  interface Palette {
    activeStep: Palette["primary"];
  }

  interface PaletteOptions {
    activeStep?: PaletteOptions["primary"];
  }
}

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      extendTheme({
        typography: {
          fontFamily: "montserrat",
        },
        colorSchemes: {
          light: {
            palette: {
              background: { default: "#FFF", paper: "#FFF" },
              primary: { main: "#0E69FF" },
              secondary: { main: "#111213" },
              text: {
                primary: "#111213",
                secondary: "#111213",
              },
              activeStep: {
                main: "#FFF3E0",
                contrastText: "#FF9A00",
              },
            },
          },
        },
      }),
    []
  );

  return (
    <CssVarsProvider theme={theme} defaultMode="light">
      {props.children}
    </CssVarsProvider>
  );
}

export default ThemeProvider;
