"use client";
import Button from "@mui/material/Button";
import LinkItem from "@mui/material/Link";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useAuthLoginService } from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import BackgroundImage from "@/assets/login-bg.svg";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import SocialAuth from "@/services/social-auth/social-auth";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import { isFacebookAuthEnabled } from "@/services/social-auth/facebook/facebook-config";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { darken, useTheme } from "@mui/material";
import Image from "next/image";

type SignInFormData = {
  email: string;
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-in");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("sign-in:inputs.email.validation.invalid"))
      .required(t("sign-in:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-in:inputs.password.validation.min"))
      .required(t("sign-in:inputs.password.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("sign-in");
  const { isSubmitting } = useFormState();
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      sx={{
        width: 500,
        background: theme.palette.secondary.main,
        ":hover": {
          background: darken(theme.palette.secondary.main, 0.2),
        },
      }}
      disabled={isSubmitting}
      data-testid="sign-in-submit"
    >
      {t("sign-in:actions.submit")}
    </Button>
  );
}

function Form() {
  const router = useRouter();
  const { setUser } = useAuthActions();
  const theme = useTheme();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const { t } = useTranslation("sign-in");
  const validationSchema = useValidationSchema();

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthLogin(formData);

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof SignInFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `sign-in:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );

      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      router.replace("/insights");
      setUser(data.user);
      router.push("/insights");
    }
  });

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          background: theme.palette.primary.main,
          height: "100vh",
          width: "100%",
          display: "flex",
          padding: 0,
          margin: 0,
        }}
      >
        <Box sx={{ width: "50%", height: "100%", position: "relative" }}>
          <Image
            src={BackgroundImage}
            alt="creagh"
            layout="fill"
            objectFit="cover"
            style={{ background: "red" }}
          />
        </Box>

        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={onSubmit} style={{ height: "100%", width: "100%" }}>
            <Box
              mb={2}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{
                background: theme.palette.primary.main,
                padding: 3,
                height: "100%",
                width: "100%",
              }}
            >
              <Box
                mt={3}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography variant="h4" fontWeight={600} color={"white"}>
                  {t("sign-in:title")}
                </Typography>
                <Typography variant="h6" color={"white"} sx={{ mb: 2 }}>
                  {t("sign-in:description")}
                </Typography>
              </Box>
              <Box sx={{ width: 500, mb: 1 }}>
                <FormTextInput<SignInFormData>
                  name="email"
                  label={t("sign-in:inputs.email.label")}
                  type="email"
                  testId="email"
                  autoFocus
                  variant="filled"
                  sx={{
                    input: {
                      background: "white",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: 500, mb: 2 }}>
                <FormTextInput<SignInFormData>
                  name="password"
                  label={t("sign-in:inputs.password.label")}
                  type="password"
                  testId="password"
                  variant="filled"
                  sx={{
                    background: "white",
                    input: {
                      background: "white",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FormActions />

                <LinkItem
                  component={Link}
                  href="/forgot-password"
                  data-testid="forgot-password"
                  sx={{
                    color: "white",
                    mt: 3,
                    textDecorationColor: "white",
                    textDecoration: "underline",
                  }}
                >
                  {t("sign-in:actions.forgotPassword")}
                </LinkItem>
                {IS_SIGN_UP_ENABLED && (
                  <Box ml={1} component="span" sx={{ display: "flex" }}>
                    <Typography
                      component={"span"}
                      sx={{ color: "white", mt: 3, mr: 1 }}
                    >
                      {t("sign-in:actions.newUser")}
                    </Typography>
                    <LinkItem
                      component={Link}
                      href="/sign-up"
                      data-testid="sign-up"
                      sx={{ color: "white", mt: 3 }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          textDecorationColor: "white",
                          textDecoration: "underline",
                        }}
                      >
                        {t("sign-in:actions.createAccount")}
                      </Typography>
                    </LinkItem>
                  </Box>
                )}
              </Box>

              {/* {[isGoogleAuthEnabled, isFacebookAuthEnabled].some(Boolean) && (
                <Box>
                  <Divider sx={{ mb: 2 }}>
                    <Chip label={t("sign-in:or")} />
                  </Divider>

                  <SocialAuth />
                </Box>
              )} */}
            </Box>
          </form>
        </Box>
      </Box>
    </FormProvider>
  );
}

function SignIn() {
  return <Form />;
}

export default withPageRequiredGuest(SignIn);
