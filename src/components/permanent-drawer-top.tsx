"use client";

import PathMDIcon from "@/assets/pathmd.png";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import {
  Avatar,
  Link,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HistologyDropdown from "./HistologyDropdown";
import PatientDetails from "./PatientDetails";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetUserService } from "@/services/api/services/users";
import { useGetUserQuery } from "@/graphql/queries/user.generated";
const drawerHeight = 60;

export default function PermanentDrawerTop() {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const { tokensInfoRef } = useAuthTokens();
  // console.log({ myToken: tokensInfoRef });
  const showBackButton = /^\/(en\/)?patient(\/|\/slide)?$/.test(pathname);
  const id = searchParams.get("id");
  // const client = createApolloClient();

  const { data: userData, error } = useGetUserQuery({
    variables: { id },
    skip: !id,
  });
  const { colorScheme, setMode } = useColorScheme();
  useEffect(() => {
    if (colorScheme === "dark") {
      setMode("light");
    }
  }, []);
  console.log({ userData, error });
  const { user } = useAuth();
  useEffect(() => {
    if (
      user &&
      window.location.href.includes("/en") &&
      !window.location.href.includes("/en/")
    ) {
      router.push("/patients");
    }
  }, [user]);

  if (!user) return <></>;

  return (
    <Box
      sx={{
        display: "flex",
        height: drawerHeight,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image
          src={PathMDIcon}
          alt="PathMD"
          style={{
            width: 194.4,
            height: 45.9,
            marginLeft: theme.spacing(),
            marginRight: theme.spacing(),
          }}
          objectFit="contain"
        />

        <Divider
          style={{
            width: 1,
            height: drawerHeight,
            backgroundColor: "rgba(0, 0, 0, 0.12)",
          }}
          variant="fullWidth"
          orientation="horizontal"
          flexItem
        />
        <HistologyDropdown />
        {showBackButton && (
          <Box
            onClick={() => router.back()}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ArrowBackIcon
              style={{ color: "#0E69FF", paddingLeft: theme.spacing() }}
            />
            <Typography
              variant={"body2"}
              fontWeight={500}
              sx={{
                pl: theme.spacing(),
                pr: theme.spacing(),
                mr: theme.spacing(),
              }}
            >
              {t("back")}
            </Typography>
          </Box>
        )}
        <Divider
          style={{
            width: 1,
            height: drawerHeight,
            backgroundColor: "rgba(0, 0, 0, 0.12)",
          }}
          variant="fullWidth"
          orientation="horizontal"
          flexItem
        />
        {userData?.user && <PatientDetails user={userData?.user} />}
      </Box>

      {user && (
        <Box>
          <ListItemButton LinkComponent={Link} href={"/profile"}>
            <Box
              sx={{
                marginRight: theme.spacing(),
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100%",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 800, lineHeight: 1.5 }}
              >{`${user?.firstName || ""} ${user?.lastName || ""}`}</Typography>
              <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
                {user?.email}
              </Typography>
            </Box>
            <Avatar
              sx={{ p: 0, mr: 1 }}
              alt={user?.firstName + " " + user?.lastName}
              src={user?.photo?.path}
            />
          </ListItemButton>
        </Box>
      )}
      {/* </Drawer> */}
    </Box>
  );
}
