import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FinishingSection({
  props,
  onChange,
}: {
  props: any;
  onChange: (value: any) => void;
}) {
  const { t: tStatuses } = useTranslation("statuses");
  const theme = useTheme();

  const stepsToShow = [
    {
      label: "",
      isCompulsory: true,
      value: { startTime: props.startTime, finishTime: props.finishTime },
      type: "date",
      onChange: (value: any) =>
        onChange({
          ...props,
          ...value,
        }),
    },
    {
      label: tStatuses("statuses:finishing:panel-cleaned"),
      isCompulsory: true,
      type: "checkbox",
      value: props.panelCleaned,
      onChange: (checked: any) =>
        onChange({
          ...props,
          panelCleaned: checked,
        }),
    },
    {
      label: tStatuses("statuses:finishing:acid-wash-complete"),
      isCompulsory: true,
      type: "checkbox",
      value: props.acidWashComplete,
      onChange: (checked: any) =>
        onChange({
          ...props,
          acidWashComplete: checked,
        }),
    },
    {
      label: tStatuses("statuses:finishing:sealing-completed"),
      isCompulsory: true,
      type: "checkbox",
      value: props.sealingCompleted,
      onChange: (checked: any) =>
        onChange({
          ...props,
          sealingCompleted: checked,
        }),
    },
    {
      label: tStatuses("statuses:finishing:panel-placed-into-stillages"),
      isCompulsory: true,
      type: "checkbox",
      value: props.placedOnStilts,
      onChange: (checked: any) =>
        onChange({
          ...props,
          placedOnStilts: checked,
        }),
    },
    {
      label: tStatuses("statuses:finishing:need_attention"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.needAttention,
      onChange: (value: any) =>
        onChange({
          ...props,
          needAttention: value,
        }),
    },
  ];

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
        {tStatuses("statuses:demould:label")}
      </Typography>
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
export default FinishingSection;
