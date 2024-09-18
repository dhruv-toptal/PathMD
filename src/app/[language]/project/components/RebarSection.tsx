import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import SegmentedButtons, { BUTTON_STATUSES } from "./SegmentedButtons";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RebarSection({
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
      label: tStatuses("statuses:rebar:rebar-sp"),
      value: "rebar-sp",
      type: "file_view",
      status:
        props.rebar.confirmation && !props.qcRejected && BUTTON_STATUSES.GREEN,
    },
    {
      label: tStatuses("statuses:rebar:build"),
      status:
        props.build.startTime &&
        props.build.finishTime &&
        !props.qcRejected &&
        BUTTON_STATUSES.GREEN,
      value: "build",
    },
  ];

  const rebarSteps = [
    {
      imageLabel: tStatuses("file"),
      isCompulsory: true,
      value: props.rebar.specs,
      onChange: (props: any) => {
        const { checked, file } = props;
        onChange({
          ...props,
          rebar: {
            ...props.rebar,
            specs: {
              checked,
              file,
            },
          },
        });
      },
      type: "file_view",
    },
    {
      label: tStatuses("statuses:rebar:confirmation"),
      isCompulsory: true,
      value: props.rebar.confirmation,
      type: "checkbox",
      onChange: (checked: any) =>
        onChange({
          ...props,
          rebar: {
            ...props.rebar,
            confirmation: checked,
          },
        }),
    },
    {
      label: tStatuses("statuses:rebar:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.rebar.needAttention,
      onChange: (value: any) =>
        onChange({
          ...props,
          rebar: {
            ...props.rebar,
            needAttention: value,
          },
        }),
    },
  ];
  const buildSteps = [
    {
      imageLabel: tStatuses("file"),
      isCompulsory: true,
      value: props.rebar.specs,
      type: "file_view",
    },
    {
      label: tStatuses("statuses:rebar:need_attention"),
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
  const stepsToShow = props?.activeStep === "build" ? buildSteps : rebarSteps;
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
        {tStatuses("statuses:rebar:label")}
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
        {tStatuses("statuses:rebar:specs")}
      </Typography>
      {stepsToShow.map((s) => {
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
export default RebarSection;
