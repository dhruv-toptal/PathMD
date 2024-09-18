import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Project } from "../types/project";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type ProjectsRequest = {
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

export type ProjectsResponse = InfinityPaginationType<Project>;

export function useGetProjectsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/projects`);
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
      }).then(wrapperFetchJsonResponse<ProjectsResponse>);
    },
    [fetch]
  );
}

export type ProjectRequest = {
  id: Project["id"];
};

export type ProjectResponse = Project;

export function useGetProjectService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/projects/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectResponse>);
    },
    [fetch]
  );
}

export type ProjectPostRequest = Pick<Project, "name"> & {
  name: string;
  customerName?: string | null | undefined;
  priority?: string | null | undefined;
  completionPercentage?: number | null | undefined;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

export type ProjectPostResponse = Project;

export function usePostProjectService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/projects`, {
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
      name: string;
      customerName?: string | null | undefined;
      priority?: string | null | undefined;
      completionPercentage?: number | null | undefined;
      startDate?: Date | null | undefined;
      dueDate?: Date | null | undefined;
    }
  >;
};

export type ProjectPatchResponse = Project;

export function usePatchProjectService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Projects/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectPatchResponse>);
    },
    [fetch]
  );
}

export type ProjectsDeleteRequest = {
  id: Project["id"];
};

export type ProjectsDeleteResponse = undefined;

export function useDeleteProjectsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ProjectsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Projects/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ProjectsDeleteResponse>);
    },
    [fetch]
  );
}
