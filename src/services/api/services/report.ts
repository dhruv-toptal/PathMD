import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Report } from "../types/report";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type ReportUpdateRequest = {
  id: string;
  title?: string;
  description?: string;
  annotations?: string;
};
export type ReportsRequest = {
  page: number;
  limit: number;
  filters?: {
    priority?: String;
  };
  sort?: Array<{
    orderBy: keyof Report;
    order: SortEnum;
  }>;
};

export type ReportsResponse = InfinityPaginationType<Report>;

export function useGetReportsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/graphql`);

      const graphqlQuery = {
        query: `
          query GetReports($offset: Int!, $limit: Int!) {
            reports(offset: $offset, limit: $limit) {
              id
              title
              type
              description
              slides {
                title
                description
                images {
                  url
                  title
                  tileSourcesUrl
                  annotationsUrl
                }
              }
              annotations
              createdById
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          offset: data.page - 1,
          limit: data.limit,
        },
      };

      return fetch(requestUrl, {
        method: "POST",
        body: JSON.stringify(graphqlQuery),
        ...requestConfig,
      }).then((res) =>
        wrapperFetchJsonResponse<ReportsResponse>(res, "reports")
      );
    },
    [fetch]
  );
}

export function useUpdateReportsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportUpdateRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/graphql`);

      const graphqlQuery = {
        query: `
          mutation UpdateReport($id: String!, $title: String, $description: String, $annotations: String) {
            updateReport(id: $id, title: $title, description: $description, annotations: $annotations) {
              id
              title
              type
              description
              slides {
                title
                description
                images {
                  url
                  title
                  tileSourcesUrl
                  annotationsUrl
                }
              }
              annotations
              createdById
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          id: data.id,
          title: data.title,
          description: data.description,
          annotations: data.annotations,
        },
      };

      return fetch(requestUrl, {
        method: "POST",
        body: JSON.stringify(graphqlQuery),
        ...requestConfig,
      }).then((res) =>
        wrapperFetchJsonResponse<ReportsResponse>(res, "reports")
      );
    },
    [fetch]
  );
}

export type ReportRequest = {
  id: Report["id"];
};

export type ReportResponse = Report;

export function useGetReportService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reports/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReportResponse>);
    },
    [fetch]
  );
}

export type ReportPostRequest = Pick<Report, "name"> & {
  name: string;
  customerName?: string | null | undefined;
  priority?: string | null | undefined;
  completionPercentage?: number | null | undefined;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

export type ReportPostResponse = Report;

export function usePostReportService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Reports`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReportPostResponse>);
    },
    [fetch]
  );
}

export type ReportPatchRequest = {
  id: Report["id"];
  data: Partial<
    Pick<Report, "name"> & {
      name: string;
      customerName?: string | null | undefined;
      priority?: string | null | undefined;
      completionPercentage?: number | null | undefined;
      startDate?: Date | null | undefined;
      dueDate?: Date | null | undefined;
    }
  >;
};

export type ReportPatchResponse = Report;

export function usePatchReportService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/reports/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReportPatchResponse>);
    },
    [fetch]
  );
}

export type ReportsDeleteRequest = {
  id: Report["id"];
};

export type ReportsDeleteResponse = undefined;

export function useDeleteReportsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ReportsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Reports/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ReportsDeleteResponse>);
    },
    [fetch]
  );
}
