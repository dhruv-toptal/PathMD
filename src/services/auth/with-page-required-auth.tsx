"use client";
import { useRouter } from "next/navigation";
import useAuth from "./use-auth";
import React, { FunctionComponent, useEffect } from "react";
import useLanguage from "../i18n/use-language";
import { RoleEnum } from "../api/types/role";

type PropsType = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

type OptionsType = {
  roles: RoleEnum[];
};

const roles = Object.values(RoleEnum).filter(
  (value) => !Number.isNaN(Number(value))
) as RoleEnum[];

function withPageRequiredAuth(
  Component: FunctionComponent<PropsType>,
  options?: OptionsType
) {
  const optionRoles = options?.roles || roles;

  return function WithPageRequiredAuth(props: PropsType) {
    const { user, isLoaded } = useAuth();
    const router = useRouter();
    const language = useLanguage();

    useEffect(() => {
      const check = () => {
        if (user || !isLoaded) return;

        console.log({ user, isLoaded });
        const currentLocation = window.location.toString();
        const returnToPath =
          currentLocation.replace(new URL(currentLocation).origin, "") ||
          `/${language}/patients`;
        const params = new URLSearchParams({
          returnTo: returnToPath,
        });

        let redirectTo = `/${language}/sign-in?${params.toString()}`;

        if (user) {
          redirectTo = `/${language}/patients`;
        }

        router.replace(redirectTo);
      };

      check();
    }, [user, isLoaded, router, language]);

    return user ? <Component {...props} /> : null;
  };
}

export default withPageRequiredAuth;
