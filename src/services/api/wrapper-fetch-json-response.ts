import { FetchJsonResponse } from "./types/fetch-json-response";
import HTTP_CODES_ENUM from "./types/http-codes";

async function wrapperFetchJsonResponse<T>(
  response: Response,
  tag?: String
): Promise<FetchJsonResponse<T>> {
  const status = response.status as FetchJsonResponse<T>["status"];

  const jsonResponse = await response.json();

  return {
    status,
    data: [
      HTTP_CODES_ENUM.NO_CONTENT,
      HTTP_CODES_ENUM.SERVICE_UNAVAILABLE,
      HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR,
    ].includes(status)
      ? undefined
      : tag && jsonResponse.data
        ? { data: jsonResponse.data[tag as keyof typeof jsonResponse.data] }
        : jsonResponse,
  };
}

export default wrapperFetchJsonResponse;
