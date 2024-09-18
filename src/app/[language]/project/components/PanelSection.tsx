import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import SegmentedButtons, { BUTTON_STATUSES } from "./SegmentedButtons";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function determineNextSection(data: any) {
  const steps = Object.keys(data)
    .map((key) => ({ key, ...data[key] }))
    .filter((step) => step.key.includes("setup_") || step.key.includes("pour_"))
    .sort((a, b) => {
      const aIndex = parseInt(a.key.match(/\d+/)) || 0; // Extract step number from key
      const bIndex = parseInt(b.key.match(/\d+/)) || 0;

      if (aIndex !== bIndex) {
        return aIndex - bIndex; // Sort by number first
      }

      // If numbers are the same, prioritize "setup" over "pour"
      if (a.key.includes("setup") && b.key.includes("pour")) {
        return -1;
      }
      if (a.key.includes("pour") && b.key.includes("setup")) {
        return 1;
      }

      return 0;
    });

  const step = steps?.find((s) => s.key === data?.activeStep);
  const index = steps?.findIndex((s) => s.key === step.key);
  const isWholeProcessDone =
    data.pour_2.inventory && data.pour_2.startTime && data.pour_2.finishTime;

  return [
    step,
    index,
    isWholeProcessDone ? BUTTON_STATUSES.GREEN : BUTTON_STATUSES.YELLOW,
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PanelSection({
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
      label: tStatuses("statuses:panel:setup_1"),
      value: "setup_1",
      status: props.activeStep !== "setup_1" && BUTTON_STATUSES.GREEN,
    },
    {
      label: tStatuses("statuses:panel:pour_1"),
      value: "pour_1",
      status:
        props.activeStep !== "setup_1" &&
        props.activeStep !== "pour_1" &&
        BUTTON_STATUSES.GREEN,
    },
    {
      label: tStatuses("statuses:panel:setup_2"),
      value: "setup_2",
      status:
        props.activeStep.includes("2") &&
        props.activeStep !== "setup_2" &&
        BUTTON_STATUSES.GREEN,
    },
    {
      label: tStatuses("statuses:panel:pour_2"),
      value: "pour_2",
    },
  ];
  const setupSteps = (key: string) => [
    {
      label: tStatuses("statuses:panel:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props[key].needAttention,
      onChange: (value: any) => {
        onChange({
          ...props,
          [key]: {
            ...props[key],
            needAttention: value,
          },
        });
      },
    },
    // {
    //   label: tStatuses("statuses:panel:special_case_request"),
    //   isCompulsory: true,
    //   type: "checkbox_with_text",
    //   value: props[key].specialCases,
    //   onChange: (value: any) => {
    //     onChange({
    //       ...props,
    //       [key]: {
    //         ...props[key],
    //         specialCases: value,
    //       },
    //     });
    //   },
    // },
    {
      label: tStatuses("statuses:panel:precast-panel"),
      isCompulsory: true,
      value: props[key].precastPanel,
      type: "checkbox",
      onChange: (checked: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            precastPanel: checked,
          },
        }),
    },
    {
      label: tStatuses("statuses:panel:mould-placement"),
      isCompulsory: true,
      value: {
        startTime: props[key].mould?.startTime,
        finishTime: props[key].mould?.finishTime,
      },
      type: "date",
      onChange: (value: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            mould: {
              ...value,
            },
          },
        }),
    },
    {
      label: tStatuses("statuses:panel:rebar-placement"),
      isCompulsory: true,
      value: {
        startTime: props[key].rebar?.startTime,
        finishTime: props[key].rebar?.finishTime,
      },
      type: "date",
      onChange: (value: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            rebar: {
              ...value,
            },
          },
        }),
    },
  ];
  const pourSteps = (key: string) => [
    {
      label: tStatuses("statuses:panel:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props[key].needAttention,
      onChange: (value: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            needAttention: value,
          },
        }),
    },
    {
      label: tStatuses("statuses:panel:inventory"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props[key].inventory,
      onChange: (value: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            inventory: value,
          },
        }),
    },
    {
      label: "",
      isCompulsory: true,
      value: {
        startTime: props[key].startTime,
        finishTime: props[key].finishTime,
      },
      type: "date",
      onChange: (value: any) =>
        onChange({
          ...props,
          [key]: {
            ...props[key],
            ...value,
          },
        }),
    },
  ];

  const [stepDetails, stepIndex, color] = determineNextSection(props);
  const stepsToShow = stepDetails?.key?.includes("pour")
    ? pourSteps(`pour_${Math.floor(stepIndex / 2) + 1}`)
    : setupSteps(`setup_${Math.floor(stepIndex / 2) + 1}`);

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
        {tStatuses("statuses:panel:label")}
      </Typography>
      <SegmentedButtons
        buttons={mainSteps}
        selectedButtonIndex={stepIndex}
        selectedButtonStatus={color}
      />
      <Divider
        sx={{
          background: alpha(theme.palette.primary.main, 0.5),
          ml: -4,
          mb: 2,
          width: "calc(100% + 64px);",
        }}
      />
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
              <StepComponent type={s.type} props={{ ...s }} />
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
export default PanelSection;
