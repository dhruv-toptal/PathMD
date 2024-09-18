"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreaghIcon from "@/assets/creagh.svg";
import ProjectsIcon from "@/assets/projects.svg";
import InsightsIcon from "@/assets/insights.svg";
import PlanningIcon from "@/assets/planning.svg";
import AlertIcon from "@/assets/alert.svg";
import { useTranslation } from "@/services/i18n/client";
import Image from "next/image";
import {
  alpha,
  Avatar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import useAuth, { isAdminUser } from "@/services/auth/use-auth";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { colorScheme, setMode } = useColorScheme();

  React.useEffect(() => {
    if (colorScheme === "dark") {
      setMode("light");
    }
  }, []);
  const { user } = useAuth();
  const isAdmin = isAdminUser(user);

  React.useEffect(() => {
    if (
      user &&
      window.location.href.includes("/en") &&
      !window.location.href.includes("/en/")
    ) {
      router.push("/projects");
    }
  }, [user]);
  if (!user) return <></>;
  return (
    <Box sx={{ display: "flex", width: drawerWidth }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          sx: {
            backgroundColor: "#003087",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box>
          <Toolbar>
            <Image src={CreaghIcon} alt="Creagh" />
          </Toolbar>
          <List>
            {[
              { label: "Projects", icon: ProjectsIcon, href: "/projects" },
              {
                label: "Insights Hub",
                icon: InsightsIcon,
                href: "/insights-hub",
              },
              isAdmin
                ? {
                    label: "Planning",
                    icon: PlanningIcon,
                    href: "/planning",
                  }
                : null,
              {
                label: "Alerts",
                icon: AlertIcon,
                href: "/insights-hub/alerts",
              },
              isAdmin
                ? {
                    label: "Users",
                    iconComponent: GroupIcon,
                    href: "/admin-panel/users",
                  }
                : null,
            ]
              .filter((pages) => !!pages)
              .map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    LinkComponent={Link}
                    href={item.href}
                    sx={{
                      ":hover": {
                        backgroundColor: "#001438",
                      },
                      backgroundColor: window.location.href.includes(item.href)
                        ? alpha("#001438", 0.6)
                        : "unset",
                    }}
                  >
                    <ListItemIcon sx={{ ml: 3, minWidth: 25, mr: 1 }}>
                      {item.icon && (
                        <Image src={item.icon} alt={item.label} width={24} />
                      )}
                      {item.iconComponent && (
                        <item.iconComponent sx={{ color: "white" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      sx={{ ml: 0 }}
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        color: "white",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
          <Divider />
        </Box>
        {user && (
          <Box>
            <ListItemButton
              LinkComponent={Link}
              href={"/profile"}
              sx={{
                ":hover": {
                  backgroundColor: "#001438",
                },
              }}
            >
              <Avatar
                sx={{ p: 0, mr: 1 }}
                alt={user?.firstName + " " + user?.lastName}
                src={user?.photo?.path}
              />
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 500 }}
              >{`${user?.firstName || ""} ${user?.lastName || ""}`}</Typography>
            </ListItemButton>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
