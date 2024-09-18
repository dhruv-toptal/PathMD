import { useTranslation } from "@/services/i18n/client";
import { alpha, Box, Divider, Typography, useTheme } from "@mui/material";
import StepComponent from "./StepComponent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StoreSection({
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
      onChange: (value: any) => {
        onChange({
          ...props,
          ...value,
        });
      },
    },
    {
      label: tStatuses("statuses:store:stored-location"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.storedLocation,
      onChange: (checked: any) =>
        onChange({
          ...props,
          storedLocation: checked,
        }),
    },
    {
      label: tStatuses("statuses:store:packing-details"),
      isCompulsory: true,
      type: "checkbox_with_text",
      value: props.packingDetails,
      onChange: (checked: any) =>
        onChange({
          ...props,
          packingDetails: checked,
        }),
    },

    {
      label: tStatuses("statuses:store:ready-for-shipment"),
      isCompulsory: true,
      type: "checkbox",
      value: props.readyForShipment,
      onChange: (checked: any) =>
        onChange({
          ...props,
          readyForShipment: checked,
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
export default StoreSection;
