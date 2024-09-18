import { SortEnum } from "@/services/api/types/sort-type";
import { BedSchedule } from "@/services/api/types/bed-schedule";

export type BedScheduleFilterType = {
  name?: String;
};

export type BedScheduleSortType = {
  orderBy: keyof BedSchedule;
  order: SortEnum;
};
