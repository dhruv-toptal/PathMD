"use client";

import { useTranslation } from "@/services/i18n/client";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

const drawerHeight = 60;

export default function PatientDetails({ user }: { user: any }) {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const pathname = usePathname();
  console.log({ pathname });
  const showPatientDetails = /^\/(en\/)?patient(\/|\/slide)?$/.test(pathname);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHistology, setSelectedHistology] = useState("Aperio");
  const histologies = ["Aperio", "VisioPath", "MicroScio"];
  console.log({ showPatientDetails });
  if (!showPatientDetails) return null;
  console.log({ user });
  return (
    <Box
      style={{
        backgroundColor: "#F1F2F5",
        margin: theme.spacing(),
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing(),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 36,
      }}
    >
      <Typography variant={"body2"} fontWeight={800} sx={{ pl: 1, pr: 1 }}>
        {user.fullName}
      </Typography>
      <Divider
        style={{
          width: 1,
          height: drawerHeight / 3,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        }}
      />
      <Typography variant={"body2"} sx={{ pl: 1, pr: 1 }}>
        {dayjs(user.dateOfBirth).format("MM/DD/YYYY")}
        {` (${dayjs().diff(user.dateOfBirth, "years")} years)`}
      </Typography>
      <Divider
        style={{
          width: 1,
          height: drawerHeight / 3,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        }}
      />
      <Typography variant={"body2"} sx={{ pl: 1, pr: 1 }}>
        {user.patientId}
      </Typography>
      <Divider
        style={{
          width: 1,
          height: drawerHeight / 3,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        }}
      />
      <Typography variant={"body2"} fontWeight={800} sx={{ pl: 1 }}>
        {selectedHistology}
      </Typography>
    </Box>
  );
}
