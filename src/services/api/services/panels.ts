import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Project } from "../types/project";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Panel } from "../types/panel";

export type PanelsRequest = {
  page: number;
  limit: number;
  filters?: {
    priority?: String;
  };
  sort?: Array<{
    orderBy: keyof Project;
    order: SortEnum;
  }>;
};

export type PanelsResponse = InfinityPaginationType<Project>;

export function useGetPanelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PanelsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/panels`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PanelsResponse>);
    },
    [fetch]
  );
}

export type ProjectRequest = {
  id: Project["id"];
};

export type ProjectResponse = Project;

export function useGetPanelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/panels/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectResponse>);
    },
    [fetch]
  );
}

export type PanelPostRequest = Pick<Panel, "panelId"> & {
  panelId: string;
  description?: string | null | undefined;
  type?: string | null | undefined;
  status?: string | null | undefined;
  count?: number | null | undefined;
  weight?: number | null | undefined;
  length?: number | null | undefined;
  depth?: number | null | undefined;
  width?: number | null | undefined;
  pouringDays?: number | null | undefined;
  phase?: string | null | undefined;
  material?: string | null | undefined;
  tonnage?: number | null | undefined;
  finishingTime?: Date | null | undefined;
  projectId: number;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

export type ProjectPostResponse = Project;

export function usePostPanelService() {
  const fetch = useFetch();

  return useCallback(
    (data: PanelPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/panels`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectPostResponse>);
    },
    [fetch]
  );
}

export type ProjectPatchRequest = {
  id: Project["id"];
  data: Partial<
    Pick<Project, "name"> & {
      panelId: string;
      description?: string | null | undefined;
      type?: string | null | undefined;
      status?: string | null | undefined;
      count?: number | null | undefined;
      weight?: number | null | undefined;
      length?: number | null | undefined;
      depth?: number | null | undefined;
      width?: number | null | undefined;
      pouringDays?: number | null | undefined;
      phase?: string | null | undefined;
      material?: string | null | undefined;
      tonnage?: number | null | undefined;
      finishingTime?: Date | null | undefined;
      projectId: number;
      startDate?: Date | null | undefined;
      dueDate?: Date | null | undefined;
      progressData?: JSON | null | undefined;
    }
  >;
};

export type ProjectPatchResponse = Project;

export function usePatchPanelService() {
  const fetch = useFetch();
  return useCallback(
    (data: ProjectPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/panels/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectPatchResponse>);
    },
    [fetch]
  );
}

export type PanelsDeleteRequest = {
  id: Project["id"];
};

export type PanelsDeleteResponse = undefined;

export function useDeletePanelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PanelsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/panels/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PanelsDeleteResponse>);
    },
    [fetch]
  );
}
