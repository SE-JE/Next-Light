import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from "axios";
import Router from "next/router";
import { token_cookie_name, loginPath, basePath } from "./middleware.helpers";
import { Decrypt } from "./encryption.helpers";
import { standIn } from "./standIn.helpers";
import Cookies from 'js-cookie';

export const authHeader = (bearer?: string): string | null => {
  if (bearer) return `Bearer ${bearer}`;
  const token = Cookies.get(token_cookie_name);
  return token ? `Bearer ${Decrypt(token)}` : null;
};

const handleErrors = (fetch: AxiosResponse) => {
  if (fetch?.status === 401) Router.push(loginPath);
  else if (fetch?.status === 403) Router.push(basePath);
  return fetch;
};

// =========================>
// ## type of filter params
// =========================>
export type GetFilterType = {
  /** Use filter type with: "eq" Equal, "ne" Not Equal, "in" In, "ni" Not In, "rg" Range. */
  type?: "eq" | "ne" | "in" | "ni" | "rg";
  column?: string;
  value?: string | string[];
};

// =========================>
// ## type of get params
// =========================>
export type GetParamsType = {
  paginate?: number;
  page?: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
  filter?: GetFilterType[];
};

// =========================>
// ## type of get props
// =========================>
export type GetPropsType = {
  path?: string;
  url?: string;
  params?: GetParamsType;
  includeParams?: object;
  includeHeaders?: object;
  bearer?: string;
};

// =========================>
// ## filter type value
// =========================>
export const getFilterTypeValue = {
  equal: "eq",
  notEqual: "ne",
  in: "in",
  notIn: "ni",
  range: "bw",
};

// =========================>
// ## Get function
// =========================>
export const get = async ({
  path,
  url,
  params,
  includeParams,
  includeHeaders,
  bearer,
}: GetPropsType) => {
  const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
  const headers: Record<string, string> = {
    Authorization: authHeader(bearer) || "",
    ...includeHeaders,
  };

  const filter: Record<string, any> = {};
  if (params?.filter) {
    params?.filter?.map((val) => {
      filter[val.column as keyof object] = `${
        getFilterTypeValue[val.type as keyof object]
      }:${Array.isArray(val.value) ? val.value.join(",") : val.value}`;
    });
  }

  return await axios
    .get(fetchUrl, {
      headers,
      params: {
        ...params,
        ...includeParams,
        filter: params?.filter ? JSON.stringify(filter) : "",
      },
    })
    .then((res) => res)
    .catch((err) => handleErrors(err.response));
};

// =========================>
// ## Get hook function
// =========================>
export const useGet = (
  props: GetPropsType & { cacheName?: string; expired?: number },
  sleep?: boolean
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<number | null>(null);
  const [data, setData] = useState<any | null>(null);

  const fetch = async (revalidation: boolean = false) => {
    setLoading(true);

    const cacheData =
      props.expired && revalidation
        ? await standIn.get(props.cacheName || `fetch_${props?.path}`)
        : null;

    if (cacheData) {
      setLoading(false);
      setCode(200);
      setData(cacheData);
    } else {
      const response = await get(props);

      if (response?.status) {
        setLoading(false);
        setCode(response?.status);
        setData(response?.data);

        if (props.expired) {
          standIn.set({
            key: props?.cacheName || `fetch_${props?.path}`,
            data: response?.data,
            expired: props.expired,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!sleep && (props.path || props.url)) {
      fetch();
    }
  }, [
    props.path,
    props.url,
    props.params?.paginate,
    props.params?.page,
    props.params?.search,
    props.params?.sortBy,
    props.params?.sortDirection,
    props.params?.filter,
    props.includeParams,
    props.includeHeaders,
    props.bearer,
    sleep,
  ]);

  const reset = () => fetch(true);

  return [{ loading, code, data, reset }];
};

// =========================>
// ## type of post props
// =========================>
export type PostPropsType = {
  path?: string;
  url?: string;
  params?: object;
  body?: object;
  includeHeaders?: object;
  bearer?: string;
  contentType?: "application/json" | "multipart/form-data";
};

// =========================>
// ## Post function
// =========================>
export const post = async ({
  path,
  url,
  params,
  body,
  includeHeaders,
  bearer,
  contentType,
}: PostPropsType) => {
  const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
  const headers: Record<string, string> = {
    Authorization: authHeader(bearer) || "",
    ...includeHeaders,
  };

  headers["Content-Type"] =
    headers["Content-Type"] || contentType || "application/json";

  return await axios
    .post(fetchUrl, body, {
      headers,
      params: {
        ...params,
      },
    })
    .then((res) => res)
    .catch((err) => handleErrors(err.response));
};

// =========================>
// ## type of patch props
// =========================>
export type PatchPropsType = {
  path?: string;
  url?: string;
  params?: object;
  body?: object;
  includeHeaders?: object;
  bearer?: string;
  contentType?: "application/json" | "multipart/form-data";
};

// =========================>
// ## Patch function
// =========================>
export const patch = async ({
  path,
  url,
  params,
  body,
  includeHeaders,
  bearer,
  contentType,
}: PatchPropsType) => {
  const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
  const headers: Record<string, string> = {
    Authorization: authHeader(bearer) || "",
    ...includeHeaders,
  };

  headers["Content-Type"] =
    headers["Content-Type"] || contentType || "application/json";

  return await axios
    .patch(fetchUrl, body, {
      headers,
      params: {
        ...params,
      },
    })
    .then((res) => res)
    .catch((err) => handleErrors(err.response));
};

// =========================>
// ## type of destroy props
// =========================>
export type DestroyPropsType = {
  path?: string;
  url?: string;
  params?: object;
  includeHeaders?: object;
  bearer?: string;
};

// =========================>
// ## Destroy function
// =========================>
export const destroy = async ({
  path,
  url,
  params,
  includeHeaders,
  bearer,
}: DestroyPropsType) => {
  const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
  const headers: Record<string, string> = {
    Authorization: authHeader(bearer) || "",
    ...includeHeaders,
  };

  return await axios
    .delete(fetchUrl, {
      headers: headers,
      params: {
        ...params,
      },
    })
    .then((res) => res)
    .catch((err) => handleErrors(err.response));
};

// =========================>
// ## type of download props
// =========================>
// export type downloadProps = {
//   path?: string;
//   url?: string;
//   params?: object;
//   includeHeaders?: object;
//   bearer?: string;
//   fileName: string;
//   onDownloadProgress: (e: AxiosProgressEvent) => void;
// };

// =========================>
// ## Download function
// =========================>
// export const download = async ({
//   path,
//   url,
//   params,
//   includeHeaders,
//   bearer,
//   fileName,
//   onDownloadProgress,
// }: downloadProps) => {
//   const fetchUrl = url
//     ? url
//     : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
//   const fetchHeaders: any = includeHeaders || {};

//   if (!fetchHeaders.Authorization) {
//     if (bearer) {
//       fetchHeaders.Authorization = `Bearer ${bearer}`;
//     } else if (Cookies.get(token_cookie_name)) {
//       fetchHeaders.Authorization = `Bearer ${Decrypt(
//         Cookies.get(token_cookie_name)
//       )}`;
//     }
//   }

//   if (!fetchHeaders.responseType) {
//     fetchHeaders.responseType = 'blob';
//   }

//   const fetch = await axios.get(fetchUrl, {
//     headers: fetchHeaders,
//     params: {
//       ...params,
//     },
//     onDownloadProgress: onDownloadProgress,
//   });

//   if (fetch.status == 401) {
//     Router.push(loginPath);
//   } else if (fetch.status == 403) {
//     Router.push(basePath);
//   } else {
//     fileDownload(fetch.data, fileName);
//     return fetch.data;
//   }
// };
