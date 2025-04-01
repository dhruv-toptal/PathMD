"use client";
import PathMDIcon from "@/assets/pathmd.png";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import { useAuthLoginService } from "@/services/api/services/auth";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { darken, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinkItem from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
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
    const {
      response: { data, status },
      headers,
    } = await fetchAuthLogin(formData);

    console.log({ data, status, headers });
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
      const token = headers["st-access-token"];
      if (!token) return;
      const decoded = jwt.decode(token);

      setTokensInfo({
        token: headers["st-access-token"],
        refreshToken: headers["st-refresh-token"],
        // @ts-expect-error exp not found
        tokenExpires: decoded?.exp * 1000,
      });
      router.replace("/patients");
      setUser(data.user);
      router.push("/patients");
    }
  });

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          background: theme.palette.background.default,
          height: "100vh",
          width: "100%",
          display: "flex",
          padding: 0,
          margin: 0,
        }}
      >
        <Box
          sx={{
            width: 700,
            height: "100%",
            display: "flex",
            backgroundColor: theme.palette.primary.main,
            padding: 6,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            color={"white"}
            sx={{ whiteSpace: "pre-line" }}
          >
            {t("sign-in:sideText", { 1: <br /> })}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
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
                background: theme.palette.background.default,
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
                <Image
                  src={PathMDIcon}
                  alt="PathMD"
                  style={{
                    width: 194.4,
                    height: 45.9,
                    marginLeft: theme.spacing(),
                    marginRight: theme.spacing(),
                    marginBottom: theme.spacing(),
                  }}
                  objectFit="contain"
                />
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{ marginTop: theme.spacing() }}
                >
                  {t("sign-in:title")}
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
                    mt: 3,
                    textDecorationColor: "white",
                    textDecoration: "underline",
                  }}
                >
                  {t("sign-in:actions.forgotPassword")}
                </LinkItem>
                {IS_SIGN_UP_ENABLED && (
                  <Box ml={1} component="span" sx={{ display: "flex" }}>
                    <Typography component={"span"} sx={{ mt: 3, mr: 1 }}>
                      {t("sign-in:actions.newUser")}
                    </Typography>
                    <LinkItem
                      component={Link}
                      href="/sign-up"
                      data-testid="sign-up"
                      sx={{ mt: 3 }}
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
