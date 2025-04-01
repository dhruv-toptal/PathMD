"use client";

import { useCallback } from "react";
import { Tokens } from "./types/tokens";
import { TokensInfo } from "../auth/auth-context";
import { AUTH_REFRESH_URL } from "./config";
import { FetchInputType, FetchInitType } from "./types/fetch-params";
import useLanguage from "../i18n/use-language";
import jwt from "jsonwebtoken";

function useFetchBase() {
  const language = useLanguage();

  return useCallback(
    async (
      input: FetchInputType,
      init?: FetchInitType,
      tokens?: Tokens & {
        setTokensInfo?: (tokensInfo: TokensInfo) => void;
      }
    ) => {
      let headers: HeadersInit = {
        "x-custom-lang": language,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",

        "User-Agent": "insomnia/10.1.1",
      };

      if (!(init?.body instanceof FormData)) {
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      if (tokens?.token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${tokens.token}`,
        };
      }

      if (tokens?.tokenExpires && tokens.tokenExpires <= Date.now()) {
        console.log("token expired!");
        const res = await fetch(AUTH_REFRESH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens?.refreshToken}`,
          },
        });
        const headerWithTokens = {
          "st-access-token": res.headers.get("st-access-token"),
          "st-refresh-token": res.headers.get("st-refresh-token"),
          "Front-Token": res.headers.get("Front-Token"),
        };
        const token = headerWithTokens["st-access-token"];
        if (token) {
          const decoded = jwt.decode(token);
          console.log("aaasdkaskdasd");
          tokens?.setTokensInfo?.({
            token: headerWithTokens["st-access-token"],
            refreshToken: headerWithTokens["st-refresh-token"],
            // @ts-expect-error exp not found
            tokenExpires: decoded?.exp * 1000,
          });
          headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        } else {
          console.log("aaasdkaskdasd1w123");

          tokens?.setTokensInfo?.(null);

          throw new Error("Refresh token expired");
        }
      }

      return fetch(input, {
        ...init,
        headers: {
          ...headers,
          ...init?.headers,
        },
      });
    },
    [language]
  );
}

export default useFetchBase;
