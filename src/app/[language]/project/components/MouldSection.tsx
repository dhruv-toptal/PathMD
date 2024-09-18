import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import SegmentedButtons, { BUTTON_STATUSES } from "./SegmentedButtons";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MouldSection({
  props,
  onChange,
}: {
  props: any;
  onChange: (value: any) => void;
}) {
  const { t: tStatuses } = useTranslation("statuses");
  const theme = useTheme();
  const mainSteps = [
    {
      label: tStatuses("statuses:mould:mould-sp"),
      value: "rebar-sp",
      status:
        props.mould.confirmation &&
        props.mould.modifiedExistingMould &&
        props.mould.reusedExistingMould &&
        BUTTON_STATUSES.GREEN,
    },
    {
      label: tStatuses("statuses:mould:build"),
      value: "build",
    },
  ];
  const mouldSteps = [
    {
      imageLabel: tStatuses("statuses:file"),
      isCompulsory: true,
      value: props.mould.specs,
      type: "file_view",
    },
    {
      label: tStatuses("statuses:mould:confirmation"),
      isCompulsory: true,
      value: props.confirmation,
      type: "checkbox",
      onChange: (checked: any) =>
        onChange({
          ...props,
          mould: {
            ...props.mould,
            confirmation: checked,
          },
        }),
    },
    {
      label: tStatuses("statuses:mould:reusedExistingMould"),
      isCompulsory: true,
      value: props.reusedExistingMould,
      type: "checkbox",
      onChange: (checked: any) =>
        onChange({
          ...props,
          mould: {
            ...props.mould,
            reusedExistingMould: checked,
          },
        }),
    },
    {
      label: tStatuses("statuses:mould:modifiedExistingMould"),
      isCompulsory: true,
      value: props.modifiedExistingMould,
      type: "checkbox",
      onChange: (checked: any) =>
        onChange({
          ...props,
          mould: {
            ...props.mould,
            modifiedExistingMould: checked,
          },
        }),
    },
    {
      label: tStatuses("statuses:mould:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.mould.needAttention,
      onChange: (value: any) =>
        onChange({
          ...props,
          mould: {
            ...props.mould,
            needAttention: value,
          },
        }),
    },
  ];
  const buildSteps = [
    {
      imageLabel: tStatuses("statuses:file"),
      isCompulsory: true,
      value: props.specs,
      type: "file_view",
    },
    {
      label: tStatuses("statuses:mould:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.build.needAttention,
      onChange: (value: any) =>
        onChange({
          ...props,
          build: {
            ...props.build,
            needAttention: value,
          },
        }),
    },
    {
      label: "",
      isCompulsory: true,
      value: {
        startTime: props.build.startTime,
        finishTime: props.build.finishTime,
      },
      type: "date",
      onChange: (value: any) =>
        onChange({
          ...props,
          build: {
            ...props.build,
            ...value,
          },
        }),
    },
  ];
  const stepsToShow = props?.activeStep === "build" ? buildSteps : mouldSteps;
  const stepIndex = props?.activeStep === "build" ? 1 : 0;
  return (
    <Box>
      <Typography
        variant={"subtitle2"}
        fontSize={12}
        textTransform={"uppercase"}
      >
        {tStatuses("step-one")}
      </Typography>
      <Typography
        variant={"h6"}
        fontWeight={600}
        textTransform={"capitalize"}
        sx={{ mb: 2 }}
      >
        {tStatuses("statuses:mould:label")}
      </Typography>
      <SegmentedButtons
        buttons={mainSteps}
        selectedButtonIndex={stepIndex}
        selectedButtonStatus={
          props.build.startTime && props.build.finishTime
            ? BUTTON_STATUSES.GREEN
            : BUTTON_STATUSES.YELLOW
        }
      />
      <Divider
        sx={{
          background: alpha(theme.palette.primary.main, 0.5),
          ml: -4,
          mb: 2,
          width: "calc(100% + 64px);",
        }}
      />
      <Typography
        variant={"h6"}
        fontWeight={600}
        textTransform={"capitalize"}
        sx={{ mb: 2 }}
      >
        {tStatuses("statuses:mould:specs")}
      </Typography>
      {stepsToShow.map((s) => {
        const checked = true;

        return (
          <>
            <Box
              display={"flex"}
              flex={1}
              alignItems={"center"}
              justifyContent={"space-between"}
              mb={2}
            >
              <StepComponent
                type={s.type}
                props={{ imageLabel: s.imageLabel, ...s }}
              />
            </Box>
            <Divider
              sx={{
                background: alpha(theme.palette.primary.main, 0.5),
                mb: 2,
              }}
            />
          </>
        );
      })}
    </Box>
  );
}
export default MouldSection;
