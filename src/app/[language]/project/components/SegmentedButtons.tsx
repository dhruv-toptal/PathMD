import { alpha, Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
export enum BUTTON_STATUSES {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
}
function SegmentedButtons({
  title,
  buttons,
  selectedButtonIndex,
  selectedButtonStatus,
  onChange,
}: {
  title?: string;
  buttons: { label: string; value: string; status?: BUTTON_STATUSES }[];
  selectedButtonIndex: number;
  selectedButtonStatus?: BUTTON_STATUSES;
  onChange?: (index: number) => void;
}) {
  const theme = useTheme();
  const { t: tPanel } = useTranslation("panel");
  let selectedButtonColors: { main: string; text: string };
  switch (selectedButtonStatus) {
    case BUTTON_STATUSES.RED:
      selectedButtonColors = {
        main: "#FFE9E9",
        text: "#C20202",
      };
      break;
    case BUTTON_STATUSES.GREEN:
      selectedButtonColors = {
        main: "#EBFFE6",
        text: "#21A500",
      };
      break;
    default:
      selectedButtonColors = {
        main: "#FFF3E0",
        text: "#FF9A00",
      };
      break;
  }

  const areClickable = !!onChange;
  return (
    <Box sx={{ mb: 2 }}>
      {title && (
        <Typography
          variant={"subtitle2"}
          fontSize={10}
          textTransform={"uppercase"}
        >
          {title}
        </Typography>
      )}
      <Box
        bgcolor={alpha(theme.palette.primary.main, 0.1)}
        display={"inline-flex"}
        borderRadius={20}
        flexShrink={1}
        alignItems={"center"}
        height={42}
        pr={0.6}
      >
        {Object.values(buttons).map((btn, index) => {
          const isActive = buttons[selectedButtonIndex] === btn;
          let color;
          switch (btn.status) {
            case BUTTON_STATUSES.RED:
              color = {
                main: "#FFE9E9",
                text: "#C20202",
              };
              break;
            case BUTTON_STATUSES.GREEN:
              color = {
                main: "#EBFFE6",
                text: "#21A500",
              };
              break;
            case BUTTON_STATUSES.YELLOW:
              color = {
                main: "#FFF3E0",
                text: "#FF9A00",
              };
              break;
            default:
              color = {
                main: "white",
                text: "unset",
              };
              break;
          }
          return (
            <Box
              key={btn.label}
              bgcolor={isActive ? selectedButtonColors.main : color.main}
              sx={{ cursor: areClickable || isActive ? "pointer" : "unset" }}
              onClick={() => onChange?.(index)}
              ml={0.6}
              pl={2}
              pr={2}
              borderRadius={5}
              height={"80%"}
              alignItems={"center"}
              display={"flex"}
            >
              <Typography
                variant={"subtitle1"}
                fontSize={14}
                sx={{
                  color: isActive ? selectedButtonColors.text : color.text,
                }}
                textTransform={"capitalize"}
              >
                {btn.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
export default SegmentedButtons;
