import { Panel } from "./panel";

export type BedSchedule = {
  id: number | string;
  name: string;
  factoryName?: string;
  scheduledDate?: Date;
  panel?: Panel;
};
