export type ReportImage = {
  url: string;
  title: string;
};
export type Slide = {
  title: string;
  description: string;
  images: ReportImage[];
};
export type Report = {
  id: number | string;
  title: string;
  type: string;
  description: string;
  annotations: string;
  slides: Slide[];
  createdById: string;
};
