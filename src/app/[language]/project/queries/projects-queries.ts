import { useGetProjectService } from "@/services/api/services/projects";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useQuery } from "@tanstack/react-query";

export const useProjectQuery = ({ id }: { id: string | number }) => {
  const fetch = useGetProjectService();

  const query = useQuery({
    queryKey: [],
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          id,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data,
        };
      }
    },
    gcTime: 0,
  });

  return query;
};
