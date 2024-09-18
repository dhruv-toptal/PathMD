"use client";

import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useRouter } from "next/navigation";
import { PRIORITIES, Role } from "@/services/api/types/role";
import FormSelectInput from "@/components/form/select/form-select";
import { alpha, Divider, useTheme } from "@mui/material";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormButtonSelectInput from "@/components/form/button-select/form-button-select";
import Image from "next/image";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import FormDateTimePickerInput from "@/components/form/date-pickers/date-time-picker";
import { usePostPanelService } from "@/services/api/services/panels";

type CreatePanelFormData = {
  panelId: string;
  description?: string | null | undefined;
  type?: string | null | undefined;
  status?: string | null | undefined;
  count?: number | null | undefined;
  weight?: number | null | undefined;
  length?: number | null | undefined;
  depth?: number | null | undefined;
  width?: number | null | undefined;
  pouringDays?: number | null | undefined;
  phase?: string | null | undefined;
  material?: string | null | undefined;
  tonnage?: number | null | undefined;
  finishingTime?: Date | null | undefined;
  projectId?: number | null | undefined;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

const useValidationSchema = () => {
  return yup.object().shape({
    panelId: yup.string().required(),
    description: yup.string().nullable(),
    type: yup.string().nullable(),
    status: yup.string().nullable(),
    count: yup.number().nullable(),
    weight: yup.number().nullable(),
    length: yup.number().nullable(),
    depth: yup.number().nullable(),
    width: yup.number().nullable(),
    pouringDays: yup.number().nullable(),
    phase: yup.string().nullable(),
    material: yup.string().nullable(),
    tonnage: yup.number().nullable(),
    finishingTime: yup.date().nullable(),
    projectId: yup.number().nullable(),
    startDate: yup.date().nullable(),
    dueDate: yup.date().nullable(),
  });
};

function CreatePanelFormActions() {
  const { t } = useTranslation("projects");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("projects:create")}
    </Button>
  );
}

function CreatePanel({
  onClose,
  projectId,
}: {
  onClose: () => void;
  projectId: number;
}) {
  const router = useRouter();
  const theme = useTheme();
  const fetchPostProject = usePostPanelService();
  const { t } = useTranslation("panel");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreatePanelFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      panelId: "",
      description: "",
      status: "Created",
      type: "",
      count: 0,
      weight: 0,
      length: 0,
      depth: 0,
      width: 0,
      pouringDays: 0,
      phase: "",
      material: "",
      tonnage: 0,
      finishingTime: null,
      projectId: null,
      startDate: null,
      dueDate: null,
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostProject({
      ...formData,
      projectId,
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreatePanelFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-Projects-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("success"), {
        variant: "success",
      });
      onClose();
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="add-panel">
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid
              item
              xs={12}
              direction={"row"}
              display={"flex"}
              alignItems={"center"}
              mb={2}
            >
              <AddCircleOutlineIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {t("add-panel")}
              </Typography>
            </Grid>
            <Divider
              sx={{
                ml: -2,
                width: "calc(100% + 40px);",
                background: alpha(theme.palette.primary.main, 0.5),
              }}
            />
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="panelId"
                testId="new-panel-id"
                autoComplete="new-panel-id"
                label={t("id")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="description"
                testId="new-panel-description"
                autoComplete="new-panel-description"
                label={t("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="count"
                testId="new-panel-count"
                autoComplete="new-panel-count"
                label={t("panel:count:label")}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="type"
                testId="new-panel-type"
                autoComplete="new-panel-type"
                label={t("type")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              flexDirection={"row"}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Grid item xs={5.8}>
                <FormTextInput<CreatePanelFormData>
                  name="weight"
                  testId="new-panel-weight"
                  autoComplete="weight"
                  label={t("weight")}
                  type="number"
                />
              </Grid>
              <Grid item xs={5.8}>
                <FormTextInput<CreatePanelFormData>
                  name="length"
                  testId="new-panel-length"
                  autoComplete="length"
                  label={t("length")}
                  type="number"
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              flexDirection={"row"}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Grid item xs={5.8}>
                <FormTextInput<CreatePanelFormData>
                  name="depth"
                  testId="new-panel-depth"
                  autoComplete="depth"
                  label={t("depth")}
                  type="number"
                />
              </Grid>
              <Grid item xs={5.8}>
                <FormTextInput<CreatePanelFormData>
                  name="width"
                  testId="new-panel-width"
                  autoComplete="width"
                  label={t("width")}
                  type="number"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="pouringDays"
                testId="new-panel-pouring-days"
                autoComplete="pouring-days"
                label={t("pouring-days")}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="phase"
                testId="new-panel-phase"
                autoComplete="phase"
                label={t("phase")}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormDateTimePickerInput<CreatePanelFormData>
                name="finishingTime"
                testId="new-panel-finishing-time"
                label={t("finishing-time")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="material"
                testId="new-panel-material"
                autoComplete="material"
                label={t("material")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreatePanelFormData>
                name="tonnage"
                testId="new-panel-tonnage"
                autoComplete="tonnage"
                label={t("tonnage")}
                type="number"
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CreatePanelFormActions />
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

export default CreatePanel;
