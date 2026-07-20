import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/building";
import type { GetBuildingsParams, GetBuildingsResponse } from "../../interfaces/buildings";

export const buildingsApi = createApi({
    reducerPath: "buildingsApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getBuildings: builder.query<GetBuildingsResponse, GetBuildingsParams>({
            query: ({ ...params }) => {
                const registrationKey = window.__flex_g_settings.registration_key
                return {
                    url: `/buildings/board/${registrationKey}`,
                    params,
                }
            },
        }),
    }),
});

export const { useGetBuildingsQuery, useLazyGetBuildingsQuery } = buildingsApi;
