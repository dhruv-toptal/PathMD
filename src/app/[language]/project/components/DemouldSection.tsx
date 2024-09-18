import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DemouldSection({
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
      label: tStatuses("statuses:demould:placed-on-stilts"),
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
      label: tStatuses("statuses:demould:demoulded"),
      isCompulsory: true,
      type: "checkbox",
      value: props.demouldedFully,
      onChange: (checked: any) =>
        onChange({
          ...props,
          demouldedFully: checked,
        }),
    },
    {
      label: tStatuses("statuses:demould:table-cleaned"),
      isCompulsory: true,
      type: "checkbox",
      value: props.tablesCleaned,
      onChange: (checked: any) =>
        onChange({
          ...props,
          tablesCleaned: checked,
        }),
    },
    {
      label: tStatuses("statuses:demould:mould-cleaned"),
      isCompulsory: true,
      type: "checkbox",
      value: props.modelCleaned,
      onChange: (checked: any) =>
        onChange({
          ...props,
          modelCleaned: checked,
        }),
    },
    {
      label: tStatuses("statuses:mould:need_attention"),
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
export default DemouldSection;
