"use client";

import { useTranslation } from "@/services/i18n/client";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { usePathname } from "next/navigation";
import { useState } from "react";

const drawerHeight = 60;

export default function HistologyDropdown() {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHistology, setSelectedHistology] = useState("Aperio");
  const histologies = ["Aperio", "VisioPath", "MicroScio"];
  const hideHistology = /^\/(en\/)?patient(\/|\/slide)?$/.test(pathname);

  if (hideHistology) return null;
  return (
    <Box
      style={{
        backgroundColor: "#F1F2F5",
        margin: theme.spacing(),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography
        variant={"body2"}
        fontWeight={500}
        sx={{ pl: 1, mr: theme.spacing() }}
      >
        {t("histologyFrom")}
      </Typography>
      <Divider
        style={{
          width: 1,
          height: drawerHeight / 3,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        }}
      />
      <Button
        id="basic-button"
        aria-controls={!!anchorEl ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={!!anchorEl ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <Typography variant={"body2"} fontWeight={800} sx={{ pl: 1 }}>
          {selectedHistology}
        </Typography>
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {histologies.map((histology) => (
          <MenuItem
            key={histology}
            onClick={() => {
              setAnchorEl(null);
              setSelectedHistology(histology);
            }}
          >
            {histology}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
