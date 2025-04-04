import { useGetPatientsService } from "@/services/api/services/patients";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProjectFilterType, ProjectSortType } from "../project-filter-types";

export const projectsQueryKeys = createQueryKeys(["projects"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: ProjectFilterType | undefined;
        sort?: ProjectSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const usePatientListQuery = ({
  sort,
  filter,
}: {
  filter?: ProjectFilterType | undefined;
  sort?: ProjectSortType | undefined;
} = {}) => {
  const fetch = useGetPatientsService();

  const query = useInfiniteQuery({
    queryKey: projectsQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};
