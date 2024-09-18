import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormSelectInput from "@/components/form/select/form-select";
import { usePostBedScheduleService } from "@/services/api/services/bedSchedules";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { Panel } from "@/services/api/types/panel";
import { useTranslation } from "@/services/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

export type Bed = {
  name?: string;
};

type CreateBedScheduleFormData = {
  name: { name: string };
  factoryName: string;
  panel: { id?: number };
  scheduledDate: Date;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-users-create");

  return yup.object().shape({
    name: yup.object().shape({
      name: yup.string().required(),
    }),
    factoryName: yup
      .string()
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    panel: yup
      .object()
      .shape({ id: yup.number() })
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    scheduledDate: yup
      .date()
      .required(
        t("admin-panel-users-create:inputs.password.validation.required")
      ),
  });
};
export const BEDS = [
  { name: "Bed 1" },
  { name: "Bed 2" },
  { name: "Bed 3" },
  { name: "Bed 4" },
  { name: "Bed 5" },
  { name: "Bed 6" },
  { name: "Bed 7" },
  { name: "Bed 8" },
  { name: "Bed 9" },
  { name: "Bed 10" },
  { name: "Bed 11" },
  { name: "Bed 12" },
];
const CreateBedSchedule = ({
  open,
  factoryName = "TF1",
  panels,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  factoryName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  panels: Panel[];
}) => {
  const theme = useTheme();
  const { t: tPlanning } = useTranslation("planning");
  const validationSchema = useValidationSchema();

  const methods = useForm<CreateBedScheduleFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      factoryName,
    },
  });
  const { handleSubmit, setError } = methods;
  const postBedSchedule = usePostBedScheduleService();
  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await postBedSchedule({
      name: formData.name.name,
      factoryName: formData.factoryName,
      panelId: formData.panel.id,
      scheduledDate: formData.scheduledDate,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof CreateBedScheduleFormData>
      ).forEach((key) => {
        setError(key, {
          type: "manual",
          message: tPlanning(`error`),
        });
      });

      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(tPlanning("success"), {
        variant: "success",
      });

      onClose();
    }
  });

  if (!panels) return <CircularProgress />;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ mt: 10, mb: 10, ml: "10%", mr: "10%" }}
    >
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant={"h5"} fontWeight={500} sx={{ pl: 4 }}>
            {tPlanning("Add Schedule")}
          </Typography>
          <IconButton sx={{ width: 20, p: 4 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ background: alpha(theme.palette.primary.main, 0.5) }} />

        <form onSubmit={onSubmit} autoComplete="create-new-user">
          <Grid item xs={2} sx={{ p: 4 }}>
            <FormProvider {...methods}>
              <Box sx={{ mb: 2 }}>
                <FormSelectInput<CreateBedScheduleFormData, Pick<Bed, "name">>
                  name="name"
                  testId="name"
                  label="Bed"
                  options={BEDS}
                  keyValue={"name"}
                  renderOption={(bed) => bed.name}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormSelectInput<
                  CreateBedScheduleFormData,
                  Pick<Panel, "panelId">
                >
                  name="panel"
                  testId="panel"
                  label="Panel"
                  options={panels}
                  keyValue="panelId"
                  renderOption={(panel) => panel.panelId}
                />
              </Box>
              <FormDatePickerInput<CreateBedScheduleFormData>
                name="scheduledDate"
                testId="scheduled-date"
                label={tPlanning("scheduled-date")}
              />
            </FormProvider>
          </Grid>
          <Divider
            sx={{
              background: alpha(theme.palette.primary.main, 0.5),
              ml: -4,
              mb: 2,
              width: "calc(100% + 64px);",
            }}
          />
          <Box display={"flex"} flex={1} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ mb: 2, mr: 2 }}
            >
              {tPlanning("schedule")}
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default CreateBedSchedule;
