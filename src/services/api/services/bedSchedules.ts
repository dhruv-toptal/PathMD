import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { BedSchedule } from "../types/bed-schedule";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type BedSchedulesRequest = {
  page: number;
  limit: number;
  filters?: {
    name?: String;
  };
  sort?: Array<{
    orderBy: keyof BedSchedule;
    order: SortEnum;
  }>;
};

export type BedSchedulesResponse = InfinityPaginationType<BedSchedule>;

export function useGetBedSchedulesService() {
  const fetch = useFetch();

  return useCallback(
    (data: BedSchedulesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/bed-schedules`);
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
      }).then(wrapperFetchJsonResponse<BedSchedulesResponse>);
    },
    [fetch]
  );
}

export type BedScheduleRequest = {
  id: BedSchedule["id"];
};

export type BedScheduleResponse = BedSchedule;

export function useGetBedScheduleService() {
  const fetch = useFetch();

  return useCallback(
    (data: BedScheduleRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/bed-schedules/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<BedScheduleResponse>);
    },
    [fetch]
  );
}

export type BedSchedulePostRequest = Pick<BedSchedule, "name"> & {
  name: string;
  factoryName?: string | null | undefined;
  panelId?: number | null | undefined;
  scheduledDate?: Date | null | undefined;
};

export type BedSchedulePostResponse = BedSchedule;

export function usePostBedScheduleService() {
  const fetch = useFetch();

  return useCallback(
    (data: BedSchedulePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/bed-schedules`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<BedSchedulePostResponse>);
    },
    [fetch]
  );
}

export type BedSchedulePatchRequest = {
  id: BedSchedule["id"];
  data: Partial<
    Pick<BedSchedule, "name"> & {
      name: string;
      customerName?: string | null | undefined;
      priority?: string | null | undefined;
      completionPercentage?: number | null | undefined;
      startDate?: Date | null | undefined;
      dueDate?: Date | null | undefined;
    }
  >;
};

export type BedSchedulePatchResponse = BedSchedule;

export function usePatchBedScheduleService() {
  const fetch = useFetch();

  return useCallback(
    (data: BedSchedulePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/BedSchedules/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<BedSchedulePatchResponse>);
    },
    [fetch]
  );
}

export type BedSchedulesDeleteRequest = {
  id: BedSchedule["id"];
};

export type BedSchedulesDeleteResponse = undefined;

export function useDeleteBedSchedulesService() {
  const fetch = useFetch();

  return useCallback(
    (data: BedSchedulesDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/BedSchedules/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<BedSchedulesDeleteResponse>);
    },
    [fetch]
  );
}
