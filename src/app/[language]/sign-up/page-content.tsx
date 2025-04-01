"use client";
import Button from "@mui/material/Button";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import LinkItem from "@mui/material/Link";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import {
  useAuthLoginService,
  useAuthSignUpService,
} from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import BackgroundImage from "@/assets/login-bg.svg";
import PathMDIcon from "@/assets/pathmd.png";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormCheckboxInput from "@/components/form/checkbox/form-checkbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import SocialAuth from "@/services/social-auth/social-auth";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";
import { isFacebookAuthEnabled } from "@/services/social-auth/facebook/facebook-config";
import Image from "next/image";
import { darken, useTheme } from "@mui/material";

type TPolicy = {
  id: string;
  name: string;
};

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  policy: TPolicy[];
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-up");

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("sign-up:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("sign-up:inputs.lastName.validation.required")),
    email: yup
      .string()
      .email(t("sign-up:inputs.email.validation.invalid"))
      .required(t("sign-up:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-up:inputs.password.validation.min"))
      .required(t("sign-up:inputs.password.validation.required")),
    policy: yup
      .array()
      .min(1, t("sign-up:inputs.policy.validation.required"))
      .required(),
  });
};

function FormActions() {
  const { t } = useTranslation("sign-up");
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
      data-testid="sign-up-submit"
    >
      {t("sign-up:actions.submit")}
    </Button>
  );
}

function Form() {
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const fetchAuthSignUp = useAuthSignUpService();
  const { t } = useTranslation("sign-up");
  const validationSchema = useValidationSchema();
  const theme = useTheme();
  const policyOptions = [
    { id: "policy", name: t("sign-up:inputs.policy.agreement") },
  ];

  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      policy: [],
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data: dataSignUp, status: statusSignUp } =
      await fetchAuthSignUp(formData);

    if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `sign-up:inputs.${key}.validation.server.${dataSignUp.errors[key]}`
            ),
          });
        }
      );

      return;
    }

    const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
      email: formData.email,
      password: formData.password,
    });

    if (statusSignIn === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: dataSignIn.token,
        refreshToken: dataSignIn.refreshToken,
        tokenExpires: dataSignIn.tokenExpires,
      });
      setUser(dataSignIn.user);
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
                  {t("sign-up:title")}
                </Typography>
              </Box>
              <Box sx={{ width: 500, mb: 1 }}>
                <Box sx={{ width: 500, mb: 1 }}>
                  <FormTextInput<SignUpFormData>
                    name="firstName"
                    label={t("sign-up:inputs.firstName.label")}
                    type="text"
                    testId="first-name"
                    autoFocus
                    variant="filled"
                    sx={{
                      input: {
                        background: "white",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: 500, mb: 1 }}>
                  <FormTextInput<SignUpFormData>
                    name="lastName"
                    label={t("sign-up:inputs.lastName.label")}
                    type="text"
                    testId="last-name"
                    variant="filled"
                    sx={{
                      input: {
                        background: "white",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: 500, mb: 1 }}>
                  <FormTextInput<SignUpFormData>
                    name="email"
                    label={t("sign-up:inputs.email.label")}
                    type="email"
                    testId="email"
                    variant="filled"
                    sx={{
                      input: {
                        background: "white",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: 500, mb: 2 }}>
                  <FormTextInput<SignUpFormData>
                    name="password"
                    label={t("sign-up:inputs.password.label")}
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

                <Box sx={{ width: 500, mb: 2 }}>
                  <FormCheckboxInput
                    name="policy"
                    label=""
                    testId="privacy"
                    options={policyOptions}
                    keyValue="id"
                    keyExtractor={(option) => option.id.toString()}
                    renderOption={(option) => (
                      <span style={{}}>
                        {option.name}{" "}
                        <LinkItem
                          href="/privacy-policy"
                          target="_blank"
                          sx={{}}
                        >
                          {t("sign-up:inputs.policy.label")}
                        </LinkItem>
                      </span>
                    )}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FormActions />

                <Box ml={1} component="span" sx={{ display: "flex" }}>
                  <Typography component={"span"} sx={{ mt: 3, mr: 1 }}>
                    {t("sign-up:actions.accountAlreadyExists")}
                  </Typography>
                  <LinkItem
                    href="/sign-in"
                    data-testid="login"
                    sx={{
                      textDecoration: "underline",
                      fontWeight: 600,
                      mt: 3,
                    }}
                  >
                    {t("sign-up:actions.signIn")}
                  </LinkItem>
                </Box>
                {/*
              {[isGoogleAuthEnabled, isFacebookAuthEnabled].some(Boolean) && (
                <Box>
                  <Divider sx={{ mb: 2 }}>
                    <Chip label={t("sign-up:or")} />
                  </Divider>

                  <SocialAuth />
                </Box>
              )} */}
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </FormProvider>
  );
}

function SignUp() {
  return <Form />;
}

export default withPageRequiredGuest(SignUp);
