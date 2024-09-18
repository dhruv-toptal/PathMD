"use client";
import InsightsIcon from "@/assets/insights.svg";
import Link from "@/components/link";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Toolbar, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
}));

function Profile() {
  const theme = useTheme();
  const { t: tInsights } = useTranslation("insights-hub");
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Image
            className="dark:invert"
            src={InsightsIcon}
            alt={"Insights Hub"}
            width={24}
          />
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 1 }}>
            {"Insights Hub"}
          </Typography>
        </Box>
      </Toolbar>
      <Divider
        sx={{
          ml: 3,
          mr: 3,
          background: alpha(theme.palette.primary.main, 0.5),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "80%", height: 50, mb: 2 }}
          href={"/projects"}
        >
          <Typography variant="h5">Project Status</Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "80%", height: 50, mb: 2 }}
          component={Link}
          href={"/insights-hub/sustainability"}
        >
          <Typography variant="h5">Sustainability Metrics</Typography>
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "80%", height: 50, mb: 2 }}
          component={Link}
          href={"/insights-hub/insights"}
        >
          <Typography variant="h5">Insights</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default withPageRequiredAuth(Profile);
