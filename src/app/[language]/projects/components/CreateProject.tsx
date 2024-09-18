"use client";

import FormTextInput from "@/components/form/text-input/form-text-input";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import FormButtonSelectInput from "@/components/form/button-select/form-button-select";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import { usePostProjectService } from "@/services/api/services/projects";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { PRIORITIES, Role } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { alpha, Divider, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

type CreateProjectFormData = {
  projectId: string;
  name: string;
  customerName?: string | null | undefined;
  priority?: string | null | undefined;
  completionPercentage?: number | null | undefined;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-Projects-create");

  return yup.object().shape({
    projectId: yup.string().required(),
    name: yup.string().required(),
    customerName: yup.string().nullable(),
    priority: yup.string().nullable(),
    completionPercentage: yup.number().nullable(),
    startDate: yup.date().nullable(),
    dueDate: yup.date().nullable(),
  });
};

function CreateProjectFormActions() {
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

function CreateProject({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const theme = useTheme();
  const fetchPostProject = usePostProjectService();
  const { t } = useTranslation("projects");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateProjectFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      projectId: "",
      name: "",
      customerName: "",
      priority: "",
      completionPercentage: 0,
      startDate: null,
      dueDate: null,
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostProject(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateProjectFormData>).forEach(
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
      enqueueSnackbar(t("admin-panel-Projects-create:alerts.Project.success"), {
        variant: "success",
      });
      onClose();
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-Project">
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
                {t("projects:new-project")}
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
              <FormButtonSelectInput<CreateProjectFormData, Pick<Role, "id">>
                name="priority"
                testId="priority"
                label={t("projects:priority")}
                options={Object.values(PRIORITIES)}
                keyValue="id"
                renderOption={(option) =>
                  t(
                    `admin-panel-Projects-create:inputs.role.options.${option.id}`
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreateProjectFormData>
                name="projectId"
                testId="new-project-id"
                autoComplete="new-project-id"
                label={t("projects:project-id:label")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreateProjectFormData>
                name="name"
                testId="new-project-name"
                autoComplete="new-project-name"
                label={t("projects:name:label")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreateProjectFormData>
                name="customerName"
                testId="new-project-customer-name"
                autoComplete="new-project-customer-name"
                label={t("projects:customer-name")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput<CreateProjectFormData>
                name="completionPercentage"
                testId="new-project-completion-percentage"
                autoComplete="new-project-completion-percentage"
                label={t("projects:completion-percentage")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormDatePickerInput<CreateProjectFormData>
                name="startDate"
                testId="new-project-startD-date"
                label={t("projects:start-date")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormDatePickerInput<CreateProjectFormData>
                name="dueDate"
                testId="new-project-due-date"
                label={t("projects:due-date")}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CreateProjectFormActions />
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

export default CreateProject;
