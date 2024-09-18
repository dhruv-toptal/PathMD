import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export enum StageTypes {
  FILE = "file",
  CHECKBOX = "checkbox",
  FILE_VIEW = "file_view",
  NUMBER = "number",
  CHECKBOX_WITH_TEXT = "checkbox_with_text",
  DATE = "date",
}

export enum RoleEnum {
  ADMIN = 1,
  USER = 2,
  REBAR_USER = 3,
  MOULD_USER = 4,
  PANEL_USER = 5,
  DEMOULD_USER = 6,
  FINISHING_USER = 7,
}

export enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const PRIORITIES = {
  LOW: {
    label: PriorityEnum.LOW,
    value: PriorityEnum.LOW,
    backgroundColor: "#EBFFE6",
    icon: ArrowDownwardIcon,
  },
  MEDIUM: {
    label: PriorityEnum.HIGH,
    value: PriorityEnum.HIGH,
    backgroundColor: "#FFE9E9",
    icon: ArrowUpwardIcon,
  },
  HIGHT: {
    label: PriorityEnum.MEDIUM,
    value: PriorityEnum.MEDIUM,
    backgroundColor: "#EAEBFF",
    icon: ArrowForwardIcon,
  },
};
export const STATUSES = {
  1: {
    label: "Design",
    value: "design",
  },
  2: {
    label: "Rebar",
    value: "rebar",
    userRole: 3,
  },
  3: {
    label: "Mould Pr.",
    value: "mould",
    userRole: 4,
  },
  4: {
    label: "Panel Pr.",
    value: "panel",
    userRole: 5,
  },
  5: {
    label: "Demould",
    value: "demould",
    userRole: 6,
  },
  6: {
    label: "Finishing",
    value: "finishing",
    userRole: 7,
  },
  7: {
    label: "Store",
    value: "store",
    userRole: 7,
  },
};
export type Role = {
  id: number | string;
  name?: string;
};
