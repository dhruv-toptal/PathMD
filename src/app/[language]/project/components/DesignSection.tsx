import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import StepComponent from "./StepComponent";

function DesignSection({
  props,
  onChange,
}: {
  props: any;
  onChange: (value: any) => void;
}) {
  const { t: tStatuses } = useTranslation("statuses");
  const theme = useTheme();
  const steps = [
    {
      label: tStatuses("statuses:design:rebar"),
      value: props.rebar,
      isCompulsory: true,
      onChange: ({ checked, file }: any) => {
        onChange({
          ...props,
          rebar: {
            checked,
            file,
          },
        });
      },
      type: "file",
    },
    {
      label: tStatuses("statuses:design:mould"),
      value: props.mould,
      isCompulsory: true,
      onChange: ({ checked, file }: any) =>
        onChange({
          ...props,
          mould: {
            checked,
            file,
          },
        }),
      type: "file",
    },
    {
      label: tStatuses("statuses:design:panel"),
      value: props.panelProduction,
      isCompulsory: true,
      onChange: ({ checked, file }: any) =>
        onChange({
          ...props,
          panelProduction: {
            checked,
            file,
          },
        }),
      type: "file",
    },
    {
      label: tStatuses("statuses:design:no-of-stages"),
      value: props.noOfStages,
      isCompulsory: true,
      onChange: (value: any) =>
        onChange({
          ...props,
          noOfStages: value,
        }),
      type: "number",
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
        {tStatuses("statuses:design:label")}
      </Typography>
      <Divider
        sx={{
          background: alpha(theme.palette.primary.main, 0.5),
          ml: -4,
          mb: 2,
          width: "calc(100% + 64px);",
        }}
      />
      <Typography
        variant={"subtitle2"}
        fontSize={12}
        textTransform={"uppercase"}
      >
        {tStatuses("confirm")}
      </Typography>
      {steps.map((s) => {
        return (
          <Box key={s.label}>
            <Box
              display={"flex"}
              flex={1}
              alignItems={"center"}
              justifyContent={"space-between"}
              mb={2}
            >
              <StepComponent type={s.type} props={s} />
            </Box>
            <Divider
              sx={{
                background: alpha(theme.palette.primary.main, 0.5),
                mb: 2,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
export default DesignSection;
