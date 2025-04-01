import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Patient } from "../types/patient";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type PatientsRequest = {
  page: number;
  limit: number;
  filters?: {
    priority?: String;
  };
  sort?: Array<{
    orderBy: keyof Patient;
    order: SortEnum;
  }>;
};

export type PatientsResponse = InfinityPaginationType<Patient>;

export function useGetPatientsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PatientsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/graphql`);

      const graphqlQuery = {
        query: `
          query GetUsers($offset: Int!, $limit: Int!) {
            users(offset: $offset, limit: $limit) {
              id
              firstName
              lastName
              fullName
              email
              patientId
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
        wrapperFetchJsonResponse<PatientsResponse>(res, "users")
      );
    },
    [fetch]
  );
}

export type PatientRequest = {
  id: Patient["id"];
};

export type PatientResponse = Patient;

export function useGetPatientService() {
  const fetch = useFetch();

  return useCallback(
    (data: PatientRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/patients/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PatientResponse>);
    },
    [fetch]
  );
}

export type PatientPostRequest = Pick<Patient, "name"> & {
  name: string;
  customerName?: string | null | undefined;
  priority?: string | null | undefined;
  completionPercentage?: number | null | undefined;
  startDate?: Date | null | undefined;
  dueDate?: Date | null | undefined;
};

export type PatientPostResponse = Patient;

export function usePostPatientService() {
  const fetch = useFetch();

  return useCallback(
    (data: PatientPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Patients`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PatientPostResponse>);
    },
    [fetch]
  );
}

export type PatientPatchRequest = {
  id: Patient["id"];
  data: Partial<
    Pick<Patient, "name"> & {
      name: string;
      customerName?: string | null | undefined;
      priority?: string | null | undefined;
      completionPercentage?: number | null | undefined;
      startDate?: Date | null | undefined;
      dueDate?: Date | null | undefined;
    }
  >;
};

export type PatientPatchResponse = Patient;

export function usePatchPatientService() {
  const fetch = useFetch();

  return useCallback(
    (data: PatientPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/patients/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PatientPatchResponse>);
    },
    [fetch]
  );
}

export type PatientsDeleteRequest = {
  id: Patient["id"];
};

export type PatientsDeleteResponse = undefined;

export function useDeletePatientsService() {
  const fetch = useFetch();

  return useCallback(
    (data: PatientsDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Patients/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<PatientsDeleteResponse>);
    },
    [fetch]
  );
}
