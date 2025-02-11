import React, { ReactNode } from "react";
import { floatingPageProps } from "../modal/FloatingPage.component";
import { getProps } from "@/helpers";

export type tableSupervisionColumnProps = {
  selector: string;
  label?: string;
  width?: string;
  sortable?: boolean;
  item?: (data: object) => string | ReactNode;
  permissionCode?: string;
};

export type tableSupervisionFormProps = {
  form: string[];
  except: string[];
  customDefaultValue?: object;
  modalControl?: floatingPageProps;
  contentType?: "application/json" | "multipart/form-data";
};

export type tableSupervisionProps = {
  title?: string;
  fetchControl: getProps;
  setToRefresh?: boolean;
  refreshOnClose?: boolean;
  setToLoading?: boolean;
  // customTopBar?: any;
  customTopBarWithForm?: any;
  headBar?: any;
  columnControl?: string[] | tableSupervisionColumnProps[];
  // formControl?:
  // columnControl?: tableSupervisionColumnGroupProps;
  // formControl?: tableSupervisionFormGroupProps;
  // formUpdateControl?: tableSupervisionFormUpdateGroupProps;
  // actionControl?: tableSupervisionActionProps;
  // includeFilters?: getFilterParams[];
  // unUrlPage?: boolean;
  // noControlBar?: boolean;
  permissionCode?: number;
  searchable?: boolean;
  customDetail?: (data: object) => any;
};

export default function TableSupervisionComponent() {
  return <></>;
}
