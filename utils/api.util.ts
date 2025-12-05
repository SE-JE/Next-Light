"use client"

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { redirect } from "next/navigation";
import { auth, cavity } from "@utils";

// =========================>
// ## Build auth bearer
// =========================>
export const authBearer = (bearer?: string): string | null => {
  const token  =  bearer || auth.getAccessToken() || null;
  return token ? `Bearer ${token}` : null;
};

// =========================>
// ## Api error handler
// =========================>
const handleErrors = (fetch: AxiosResponse) => {
  if (fetch?.status === 401) redirect(auth.PATH_LOGIN);
  if (fetch?.status === 403) redirect(auth.PATH_BASE);
  return fetch;
};

// =========================>
// ## Type of filter params
// =========================>
export type ApiFilterType = {
  /** Use filter logic with: "and" / "or". */
  logic   ?:  "and" | "or";
  /** Use filter type with: "eq" = Equal, "ne" = Not Equal, "in" = In, "ni" = Not In, "bw" = Between. */
  type    ?:  "eq" | "ne" | "in" | "ni" | "bw" | "";
  column  ?:  string;
  value   ?:  string | number | number[] | string[] | null;
};

// =========================>
// ## Type of api params
// =========================>
export type ApiParamsType = {
  page           ?:  number;
  paginate       ?:  number;
  sort           ?:  string[];
  search         ?:  string;
  searchable     ?:  string[];
  selectable     ?:  string[];
  expand         ?:  string[];
  filter         ?:  ApiFilterType[];
};

// =========================>
// ## Type of api props
// =========================>
export type ApiType = {
  path           ?:  string;
  url            ?:  string;
  method         ?:  "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params         ?:  ApiParamsType;
  payload        ?:  any;
  includeParams  ?:  Record<string, any>;
  headers        ?:  Record<string, any>;
  bearer         ?:  string;
};

// =========================>
// ## Api filter value
// =========================>
export const ApiFilterValue = {
  eq  :  "eq",
  ne  :  "ne",
  in  :  "in",
  ni  :  "ni",
  bw  :  "bw",
};



// =========================>
// ## Api fetching handler
// =========================>
export const api = async ({
  path,
  url,
  method,
  params,
  payload,
  includeParams,
  headers,
  bearer,
}: ApiType) => {
  const fetchUrl                              =  url || `${process.env.NEXT_PUBLIC_API_HOST}/${path || ""}`;
  
  const buildHeaders: Record<string, string>  =  {Authorization: authBearer(bearer) || "", ...headers};

  buildHeaders["Content-Type"]                =  buildHeaders["Content-Type"] || "multipart/form-data";
  
  const filter: Record<string, any>           =  {};
  const jsonParams: Record<string, any>       =  {};
  
  if (params?.filter) {
    params?.filter?.map((val) => {
      filter[val.column as keyof object] = `${ApiFilterValue[val.type as keyof object]}:${Array.isArray(val.value) ? val.value.join(",") : val.value}`;
    });
  }

  if (params) {
    const normalizeToJson = ["sort", "searchable", "selectable", "expand"];

    normalizeToJson.forEach((key) => {
      const k = key as keyof ApiParamsType;
      if (Array.isArray(params[k])) {
        jsonParams[k] = JSON.stringify(params[k]) as any;
      }
    });
  }

  return await axios(fetchUrl, {
      method   :  method || "GET",
      headers  :  buildHeaders,
      data     :  payload,
      params   : {
        ...params,
        ...jsonParams,
        ...(params?.filter ? { filter: JSON.stringify(filter)} : {}),
        ...includeParams,
      },
    })
    .then((res) => res)
    .catch((err) => handleErrors(err.response));
};



// =========================>
// ## Hook of get api 
// =========================>
export const useGetApi = (props: ApiType & { method?: "GET", cacheName?: string; expired?: number }, sleep?: boolean) => {
  const [loading, setLoading]  =  useState<boolean>(true);
  const [code, setCode]        =  useState<number | null>(null);
  const [data, setData]        =  useState<any | null>(null);

  const fetch = async (revalidation: boolean = false) => {
    setLoading(true);

    // =========================>
    // ## When cache ready 
    // =========================>
    const cacheData = props.expired && !revalidation ? await cavity.get(props.cacheName || `fetch_${props?.path}`) : null;

    if (cacheData) {
      setLoading(false);
      setCode(200);
      setData(cacheData);
      return "";
    }
    
    // =========================>
    // ## Fetch from api
    // =========================>
    const response = await api(props);

    if (response?.status) {
      setLoading(false);
      setCode(response?.status);
      setData(response?.data);

      // =========================>
      // ## Save to cache
      // =========================>
      if (props.expired) cavity.set({key: props?.cacheName || `fetch_${props?.path}`, data: response?.data, expired: props.expired});
    }
  };
  
  useEffect(() => {
    if (!sleep && (props.path || props.url)) fetch();
  }, [
    props.path,
    props.url,
    props.params?.paginate,
    props.params?.page,
    props.params?.search,
    props.params?.sort,
    props.params?.filter,
    props.includeParams,
    props.headers,
    props.bearer,
    sleep
  ]);

  const reset = () => fetch(true);

  return { loading, code, data, reset };
};




// =========================>
// ## type of post props
// =========================>
// export type PostPropsType = {
//   path         ?:  string;
//   url          ?:  string;
//   params       ?:  object;
//   body         ?:  object;
//   headers      ?:  object;
//   bearer       ?:  string;
//   contentType  ?:  "application/json" | "multipart/form-data";
// };

// =========================>
// ## Post function
// =========================>
// export const post = async ({
//   path,
//   url,
//   params,
//   body,
//   headers,
//   bearer,
//   contentType,
// }: PostPropsType) => {
//   const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
//   const buildHeaders: Record<string, string>  =  { Authorization: authBearer(bearer) || "", ...headers };

//   buildHeaders["Content-Type"] = buildHeaders["Content-Type"] || contentType || "application/json";

//   return await axios
//     .post(fetchUrl, body, {
//       headers: buildHeaders,
//       params: {
//         ...params,
//       },
//     })
//     .then((res) => res)
//     .catch((err) => handleErrors(err.response));
// };

// =========================>
// ## type of patch props
// =========================>
// export type PatchPropsType = {
//   path?: string;
//   url?: string;
//   params?: object;
//   body?: object;
//   includeHeaders?: object;
//   bearer?: string;
//   contentType?: "application/json" | "multipart/form-data";
// };

// =========================>
// ## Patch function
// =========================>
// export const patch = async ({
//   path,
//   url,
//   params,
//   body,
//   includeHeaders,
//   bearer,
//   contentType,
// }: PatchPropsType) => {
//   const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
//   const headers: Record<string, string> = {
//     Authorization: authHeader(bearer) || "",
//     ...includeHeaders,
//   };

//   headers["Content-Type"] =
//     headers["Content-Type"] || contentType || "application/json";

//   return await axios
//     .patch(fetchUrl, body, {
//       headers,
//       params: {
//         ...params,
//       },
//     })
//     .then((res) => res)
//     .catch((err) => handleErrors(err.response));
// };

// =========================>
// ## type of destroy props
// =========================>
// export type DestroyPropsType = {
//   path?: string;
//   url?: string;
//   params?: object;
//   includeHeaders?: object;
//   bearer?: string;
// };

// =========================>
// ## Destroy function
// =========================>
// export const destroy = async ({
//   path,
//   url,
//   params,
//   includeHeaders,
//   bearer,
// }: DestroyPropsType) => {
//   const fetchUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/${path || ""}`;
//   const headers: Record<string, string> = {
//     Authorization: authHeader(bearer) || "",
//     ...includeHeaders,
//   };

//   return await axios
//     .delete(fetchUrl, {
//       headers: headers,
//       params: {
//         ...params,
//       },
//     })
//     .then((res) => res)
//     .catch((err) => handleErrors(err.response));
// };

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
