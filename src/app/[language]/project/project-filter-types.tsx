import { SortEnum } from "@/services/api/types/sort-type";
import { Project } from "@/services/api/types/project";

export type ProjectFilterType = {
  priority?: String;
};

export type ProjectSortType = {
  orderBy: keyof Project;
  order: SortEnum;
};
