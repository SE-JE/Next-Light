"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LZString from "lz-string";
import { ApiFilterType, ApiParamsType, conversion, useGetApi } from "@utils";



export type TableStateType = {
  params    ?:  ApiParamsType;
  data      ?:  Record<string, any>[];
  selected  ?:  Record<string, any> | null;
  checks    ?:  (string | number)[] | null;
  focus    ?:  number | null;
};

export type FetchControlType = {
  path           ?:  string;
  url            ?:  string;
  headers        ?:  Record<string, any>;
  params         ?:  ApiParamsType;
  includeParams  ?:  object;
  bearer         ?:  string;
};



export const useTable = (
  fetchControl  :  FetchControlType,
  id            :  string = "",
  title         :  string = "",
  urlParam     :  boolean | {
    compressed ?:  boolean
  }
) => {
  const [state, setState]  =  useState<TableStateType>({});
  const router             =  useRouter();
  const searchParams       =  useSearchParams();

  // ======================
  // ## Table state key
  // ======================
  const getTableKey = () => id || (title ? conversion.strSlug(title) : null) || fetchControl.path || "";
  const tableKey = getTableKey();

  // ======================
  // ## Parse state url
  // ======================
  const getParamsFromUrl = (): ApiParamsType => {
    if (typeof urlParam == "object" && urlParam?.compressed) {
      const t = searchParams.get(tableKey ? `${tableKey}.t` : "t");
      if (!t) return {};
      
      const decoded = LZString.decompressFromEncodedURIComponent(t);
      return decoded ? JSON.parse(decoded) : {};
    }

    const params: ApiParamsType = {};
    const prefix = tableKey ? `${tableKey}.` : "";

    searchParams.forEach((value, key) => {
      if (!key.startsWith(prefix)) return;
      const shortKey = key.slice(prefix.length);

      try {
        (params as Record<string, any>)[shortKey] = JSON.parse(value);
      } catch {
        (params as Record<string, any>)[shortKey] = value;
      }
    });

    return params;
  };

  // =======================
  // ## Update url state
  // =======================
  const updateUrlParams = (params: ApiParamsType) => {
    const url = new URL(window.location.href);

    if (typeof urlParam == "object" && urlParam?.compressed) {
      const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(params));
      url.searchParams.set(tableKey ? `${tableKey}.t` : "t", encoded);
    } else {
      const prefix = tableKey ? `${tableKey}.` : "";

      for (const key of Array.from(url.searchParams.keys())) {
        if (key.startsWith(prefix)) url.searchParams.delete(key);
      }

      Object.entries(params || {}).forEach(([key, value]) => {
        const paramKey = `${prefix}${key}`;
        if (value === undefined || value === null || value === "") {
          url.searchParams.delete(paramKey);
        } else if (typeof value === "object") {
          url.searchParams.set(paramKey, JSON.stringify(value));
        } else {
          url.searchParams.set(paramKey, String(value));
        }
      });
    }

    router.replace(url.pathname + "?" + url.searchParams.toString(), { scroll: false });
  };

  useEffect(() => {
    if (state.params && urlParam) updateUrlParams(state.params);
  }, [state.params]);



  // ===========================
  // ## get url state
  // ===========================
  useEffect(() => {
    if(urlParam) {
      const params = getParamsFromUrl();
      setState((prev) => ({ ...prev, params }));
    }
  }, []);




  // ==========================
  // ## Fetch api
  // ==========================
  const { loading, data, reset } = useGetApi({
    ...fetchControl,
    method: "GET",
    params: {
      ...state.params,
      ...fetchControl.params
    },
  });
  

  // ==========================
  // ## Setter helper
  // ==========================
  const setParam = <K extends keyof ApiParamsType>(key: K, value: ApiParamsType[K]) => setState((prev) => ({ ...prev, params: { ...prev.params, [key]: value } }));

  const setSelected = (selected: Record<string, any> | null) => setState((prev) => ({ ...prev, selected }))
  
  const setChecks = (checks: (string | number)[] | null) => setState((prev) => ({ ...prev, checks }))

  const setFocus = (focus: number | null) => setState((prev) => ({ ...prev, focus }))


  // ==========================
  // ## Table Control
  // ==========================
  const tableControl  =  {
    loading: loading,
    sortBy          :  state?.params?.sort,
    onChangeSortBy  :  (e: string[]) => setParam('sort', e),
    search          :  state?.params?.search,
    onChangeSearch  :  (e: string) => setParam('search', e),
    filter          :  state?.params?.filter,
    onChangeFilter  :  (e: ApiFilterType[]) => setParam('filter', e),
    onRefresh       :  () => reset(),
    pagination      :  {
      totalRow      :  data?.total_row,
      page          :  state?.params?.page          ||  1,
      paginate      :  state?.params?.paginate      ||  10,
      onChange      :  (_: number, paginate: number, page: number) => {
        setParam('paginate', paginate);
        setParam('page', page);
      },
    },
  };

  return {
    tableKey,
    data,
    reset,
    loading,
    params: state.params,
    setParam,
    focus: state.focus,
    setFocus,
    selected: state.selected,
    setSelected: setSelected,
    checks: state.checks,
    setChecks: setChecks,
    tableControl,
  };
};
