"use client";
import InsightsMetrics from "@/assets/insights-metrics.svg";
import InsightsIcon from "@/assets/insights.svg";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import {
  alpha,
  Box,
  Divider,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";

function Insights() {
  const theme = useTheme();

  return (
    <Box
      sx={{ display: "flex", flex: 1, width: "100%", flexDirection: "column" }}
    >
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            aria-label="back"
            size="medium"
            LinkComponent={Link}
            href={`/insights-hub`}
          >
            <ArrowBackIosNewIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Image
            className="dark:invert"
            src={InsightsIcon}
            alt={"Insights"}
            width={24}
          />
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 1 }}>
            {"Insights"}
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
      <Box sx={{ mt: 4 }}>
        <Image
          src={InsightsMetrics}
          alt="insights-metrics"
          layout="responsive"
          style={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
}

export default withPageRequiredAuth(Insights);
