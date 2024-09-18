"use client";

import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Trans } from "react-i18next/TransWithoutContext";
import { Button } from "@mui/material";
import Link from "next/link";
import useAuth from "@/services/auth/use-auth";

type Props = {
  params: { language: string };
};

export default async function Home({ params }: Props) {
  const { t } = await getServerTranslation(params.language, "home");

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        pt={3}
        direction="column"
        sx={{ height: "90vh", justifyContent: "space-between" }}
      >
        <Grid item>
          <Typography variant="h3" data-testid="home-title" gutterBottom>
            {t("title")}
          </Typography>
          <Typography>
            <Trans
              i18nKey={`description`}
              t={t}
              components={[
                <MuiLink
                  key="1"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/brocoders/extensive-react-boilerplate/blob/main/docs/README.md"
                >
                  {}
                </MuiLink>,
              ]}
            />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            component={Link}
            href={"/sign-in"}
          >
            <Typography>Sign In</Typography>
          </Button>
        </Grid>
        <Grid item sx={{ mx: "auto" }}>
          <MuiLink href="/privacy-policy">Privacy Policy</MuiLink>
        </Grid>
      </Grid>
    </Container>
  );
}
