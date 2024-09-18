import { Panel } from "./panel";

export type Project = {
  id: number | string;
  projectId?: string;
  name: string;
  customerName?: string;
  status?: string;
  priority?: string;
  panels?: Panel[];
  completionPercentage?: number;
  startDate?: Date;
  dueDate?: Date;
};
