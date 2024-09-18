import { useGetBedSchedulesService } from "@/services/api/services/bedSchedules";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  BedScheduleFilterType,
  BedScheduleSortType,
} from "../bed-schedule-filter-types";

export const bedSchedulesQueryKeys = createQueryKeys(["bedSchedules"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: BedScheduleFilterType | undefined;
        sort?: BedScheduleSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useBedScheduleListQuery = ({
  sort,
  filter,
}: {
  filter?: BedScheduleFilterType | undefined;
  sort?: BedScheduleSortType | undefined;
} = {}) => {
  const fetch = useGetBedSchedulesService();

  const query = useInfiniteQuery({
    queryKey: bedSchedulesQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
          sort: sort ? [sort] : undefined,
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
