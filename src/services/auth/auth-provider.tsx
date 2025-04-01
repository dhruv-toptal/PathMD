"use client";

import { Tokens } from "@/services/api/types/tokens";
import { User } from "@/services/api/types/user";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  TokensInfo,
} from "./auth-context";
import Cookies from "js-cookie";
import useFetchBase from "@/services/api/use-fetch-base";
import { API_URL, AUTH_LOGOUT_URL, AUTH_ME_URL } from "@/services/api/config";
import HTTP_CODES_ENUM from "../api/types/http-codes";
import useFetch from "../api/use-fetch";

function AuthProvider(props: PropsWithChildren<{}>) {
  const AUTH_TOKEN_KEY = "auth-token-data";
  const [tabId] = useState(() => Math.random().toString(36).slice(2));
  const [broadcastChannel] = useState(
    () => new BroadcastChannel(AUTH_TOKEN_KEY)
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const tokensInfoRef = useRef<Tokens>({
    token: null,
    refreshToken: null,
    tokenExpires: null,
  });
  const fetchBase = useFetchBase();

  const setTokensInfoRef = useCallback((tokens: TokensInfo) => {
    tokensInfoRef.current = tokens ?? {
      token: null,
      refreshToken: null,
      tokenExpires: null,
    };
  }, []);

  const setTokensInfo = useCallback(
    (tokensInfo: TokensInfo) => {
      setTokensInfoRef(tokensInfo);
      broadcastChannel.postMessage({
        tabId,
        tokens: tokensInfo,
      });

      if (tokensInfo) {
        Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokensInfo));
      } else {
        Cookies.remove(AUTH_TOKEN_KEY);
        setUser(null);
      }
    },
    [setTokensInfoRef, broadcastChannel, tabId]
  );

  const logOut = useCallback(async () => {
    if (tokensInfoRef.current.token) {
      await fetchBase(
        AUTH_LOGOUT_URL,
        {
          method: "POST",
        },
        {
          token: tokensInfoRef.current.token,
          refreshToken: tokensInfoRef.current.refreshToken,
          tokenExpires: tokensInfoRef.current.tokenExpires,
        }
      );
    }
    setTokensInfo(null);
  }, [setTokensInfo, fetchBase]);

  const loadData = useCallback(async () => {
    const tokens = JSON.parse(
      Cookies.get(AUTH_TOKEN_KEY) ?? "null"
    ) as TokensInfo;

    setTokensInfoRef(tokens);
    try {
      if (tokens?.token) {
        const requestUrl = new URL(`${API_URL}/graphql`);

        const graphqlQuery = {
          query: `
            query GetUser($id: String) {
              user(id: $id) {
                id
                firstName
                lastName
                fullName
                email
                patientId
              }
            }
          `,
          variables: {
            id: "c0be0fb1-9add-40f5-a9ca-bcdfeff6dba9",
          },
        };

        try {
          fetchBase(requestUrl, {
            method: "POST",
            body: JSON.stringify(graphqlQuery),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokens?.token}`,
            },
          }).then(async (res) => {
            const data = await res.json();
            setUser(data.data?.user);
          });
        } catch (err) {
          console.log({ err });
        }
      }
    } catch {
      console.log("logging out");
      logOut();
    } finally {
      setIsLoaded(true);
    }
  }, [fetchBase, logOut, setTokensInfoRef, setTokensInfo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onMessage = (
      event: MessageEvent<{
        tabId: string;
        tokens: TokensInfo;
      }>
    ) => {
      if (event.data.tabId === tabId) return;

      if (!event.data.tokens) setUser(null);
      setTokensInfoRef(event.data.tokens);
    };

    broadcastChannel.addEventListener("message", onMessage);

    return () => {
      broadcastChannel.removeEventListener("message", onMessage);
    };
  }, [broadcastChannel, setTokensInfoRef, tabId]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
    }),
    [isLoaded, user]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      logOut,
    }),
    [logOut]
  );

  const contextTokensValue = useMemo(
    () => ({
      tokensInfoRef,
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
