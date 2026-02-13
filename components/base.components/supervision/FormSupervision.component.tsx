"use client"

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { faSave, faQuestionCircle, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ApiType, cn, pcn, FormErrorType, FormRegisterType, FormValueType, useForm, ValidationRules, DBSchema } from "@utils";
import {
  InputCheckboxComponent,
  InputComponent,
  InputCurrencyComponent,
  InputDateComponent,
  InputNumberComponent,
  InputOtpComponent,
  InputPasswordComponent,
  InputRadioComponent,
  SelectComponent,
  ButtonComponent,
  ModalConfirmComponent,
  ToastComponent,
  InputProps,
  InputCheckboxProps,
  InputCurrencyProps,
  InputDateProps,
  InputNumberProps,
  InputRadioProps,
  SelectProps,
  InputPasswordProps,
  InputOtpProps,
  InputTimeProps,
  InputImageProps,
  InputDateTimeProps,
  InputDatetimeComponent,
  InputTimeComponent,
  IconButtonComponent,
  InputImageComponent,
  InputMapComponent,
  InputMapProps,
} from "@components";



type CT = "base" | "title" | "submit";

type formCustomConstructionProps = ({
  formControl,
  values,
  setValues,
  setRegister,
  errors,
  setErrors,
}: {
  formControl  :  (name: string) => {
    register: (regName: string, regValidations?: ValidationRules | undefined) => void;
    unregister: (regName: string) => void;
    onChange: (e: any) => void;
    value: any;
    invalid: any;
  };
  values       :  { name: string; value?: any }[];
  setValues    :  (values: FormValueType[]) => void;
  errors       :  FormErrorType[];
  setErrors    :  (errors: FormErrorType[]) => void;
  setRegister  :  (registers: FormRegisterType) => void;
  prefixName  ?:  string;
}) => ReactNode;

type ClusterConstruction = {
  name    :  string;
  label   :  string;
  tip     :  string;
  fields  :  FormType[];
  wrap    :  boolean;
  min     ?:  number;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className  :  string;
};

type ConstructionMap = {
  default           :  InputProps;
  check             :  InputCheckboxProps;
  currency          :  InputCurrencyProps;
  date              :  InputDateProps;
  datetime          :  InputDateTimeProps;
  time              :  InputTimeProps;
  image             :  InputImageProps;
  cluster           :  ClusterConstruction;
  number            :  InputNumberProps;
  radio             :  InputRadioProps;
  select            :  SelectProps;
  "enter-password"  :  InputPasswordProps;
  otp               :  InputOtpProps;
  map               :  InputMapProps;
  custom            :  formCustomConstructionProps;
};

type TypeKeys = keyof ConstructionMap;

export type WatchContext = {
  values  : Record<string, any>
  self    : string
  prev    : WatchAction
}

export type WatchAction = {
  disabled  ?: boolean
  hidden    ?: boolean
  value     ?: any
  required  ?: boolean
  readonly  ?: boolean
  reset     ?: boolean
}

export interface FormType<T extends TypeKeys = keyof ConstructionMap> {
  col           ?:  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | string;
  className     ?:  string;
  construction  ?:  ConstructionMap[T];
  type          ?:  T;
  onHide        ?:  (values: any) => boolean;
  watch         ?:  (ctx: WatchContext) => WatchAction | undefined;
}

export interface formSupervisionProps {
  title          ?:  string;
  fields          :  FormType[];
  confirmation   ?:  boolean;
  defaultValue   ?:  object | null;
  payload        ?:  (values: any) => Promise<object> | object;
  submitControl   :  (ApiType & { idb?: never }) | { idb: { store: string, schema?: DBSchema }};
  footerControl  ?:  ({ loading }: { loading: boolean }) => ReactNode;
  onSuccess      ?:  (data: any) => void;
  onError        ?:  (code: number) => void;
  className      ?:  string;
}



export function FormSupervisionComponent({
  title,
  fields,
  submitControl,
  confirmation,
  defaultValue,
  onSuccess,
  onError,
  footerControl,
  payload,
  className = "",
}: formSupervisionProps) {
  const [modal, setModal]          =  useState<boolean | "success" | "failed">(false);
  const [fresh, setFresh]          =  useState<boolean>(true);
  const [mapGroups, setMapGroups]    =  useState<Record<string, number[]>>({});
  const [watchState, setWatchState]  =  useState<Record<string, WatchAction>>({});
  const watchRef                     =  useRef<Record<string, WatchAction>>({});

  const { formControl, setRegister, unregister, unregisterPrefix, values, setValues, errors, setErrors, setDefaultValues, submit, loading, confirm } = useForm({
    ...submitControl,
    payload,
    confirmation,
    onSuccess: (data: any) => {
      onSuccess?.(data);
      setModal("success");
      resetFresh();
    },
    onFailed: (code: number) => {
      onError?.(code);
      if (code == 422) confirm.onClose();
      else setModal("failed");
    },
  });

  const resetFresh = () => {
    setFresh(false);
    setTimeout(() => setFresh(true), 300);
  };

  useEffect(() => {
    resetFresh();
  }, [fields]);

  useEffect(() => {
    if (defaultValue) setDefaultValues(defaultValue);
    else {
      setDefaultValues(null);
      resetFresh();
    }
  }, [defaultValue]);

  // ==============================>
  // ## Watch: collect watchers from fields
  // ==============================>
  const collectWatchers = (fieldList: FormType[], prefix?: string): { name: string, watch: NonNullable<FormType['watch']>, construction: any }[] => {
    const result: { name: string, watch: NonNullable<FormType['watch']>, construction: any }[] = [];

    for (const f of fieldList) {
      const inputType = f.type || "default";
      const name      = prefix ? `${prefix}.${f.construction?.name}` : f.construction?.name || "";

      if (inputType === "cluster") {
        const cluster   = f.construction as ClusterConstruction;
        const groupKey  = prefix ? `${prefix}.${cluster.name}` : cluster.name;
        const group     = mapGroups[groupKey] || [0];

        for (const gIndex of group) {
          result.push(...collectWatchers(cluster.fields, `${cluster.name}[${gIndex}]`));
        }
      } else if (f.watch) {
        result.push({ name, watch: f.watch, construction: f.construction });
      }
    }

    return result;
  };


  // ==============================>
  // ## Watch: execute watchers on value change
  // ==============================>
  useEffect(() => {
    const watchers = collectWatchers(fields);
    if (watchers.length === 0) {
      if (Object.keys(watchRef.current).length > 0) {
        watchRef.current = {};
        setWatchState({});
      }
      return;
    }

    const valMap = values.reduce<Record<string, any>>((acc, v) => { acc[v.name] = v.value; return acc; }, {});

    const nextState    : Record<string, WatchAction> = {};
    const valueUpdates : FormValueType[] = [];

    for (const { name, watch, construction } of watchers) {
      const prev   = watchRef.current[name] || {};
      const action = watch({ values: valMap, self: name, prev });

      if (!action) continue;

      nextState[name] = action;

      if (action.hidden && !prev.hidden) unregister(name);

      if (action.required !== prev.required) {
        const baseValidations = Array.isArray(construction?.validations) ? [...construction.validations] : [];
        const newValidations  = action.required ? (baseValidations.includes("required") ? baseValidations : [...baseValidations, "required"]) : baseValidations.filter((v: string) => v !== "required");

        setRegister({ name, validations: newValidations });
      }

      if (action.reset) {
        const cur = valMap[name];

        if (cur != null && cur !== "") valueUpdates.push({ name, value: "" });
      } else if (action.value !== undefined && action.value !== valMap[name]) {
        valueUpdates.push({ name, value: action.value });
      }
    }

    if (JSON.stringify(watchRef.current) !== JSON.stringify(nextState)) {
      watchRef.current = nextState;
      setWatchState(nextState);
    }

    if (valueUpdates.length > 0) {
      const merged = [...values];

      for (const upd of valueUpdates) {
        const idx = merged.findIndex(v => v.name === upd.name);
        if (idx >= 0) merged[idx] = upd;
        else merged.push(upd);
      }

      setValues(merged);
    }
  }, [values, fields, mapGroups]);


  const generateColClass = (col: string | number) => String(col).split(" ").map((c) => (c.includes(":") ? `${c.replace(":", ":col-span-")}` : `col-span-${c}`)).join(" ");

  const inputMap: Record<TypeKeys, React.FC<any>> = {
    default           :  InputComponent,
    check             :  InputCheckboxComponent,
    currency          :  InputCurrencyComponent,
    date              :  InputDateComponent,
    datetime          :  InputDatetimeComponent,
    time              :  InputTimeComponent,
    number            :  InputNumberComponent,
    radio             :  InputRadioComponent,
    select            :  SelectComponent,
    "enter-password"  :  InputPasswordComponent,
    otp               :  InputOtpComponent,
    image             :  InputImageComponent,
    map               :  InputMapComponent,
    cluster           :  () => null,
    custom            :  () => null,
  };

  const renderInput = (form: FormType, key: number, prefix?: string) => {
    const inputType = form.type || "default";
    const name = prefix ? `${prefix}.${form.construction?.name}` : form.construction?.name || "input_name";

    if (form?.onHide?.(values)) return null;

    const ws = watchState[name];
    if (ws?.hidden) return null;

    if (inputType === "cluster") {
      const { name: mapName, fields: innerForms, label, tip, wrap, className, min = 0 } = form.construction as ClusterConstruction;

      const groupKey = prefix ? `${prefix}.${mapName}` : mapName;
      const group = mapGroups[groupKey] || Array.from({ length: Math.max(min, 1) }, (_, i) => i);

      const addGroup = () => setMapGroups((prev) => ({ ...prev, [groupKey]: [...group, group.length > 0 ? Math.max(...group) + 1 : 0] }));

      const removeGroup = (gIndex: number) => {
        setMapGroups((prev) => ({ ...prev, [groupKey]: group.filter((g) => g !== gIndex) }));

        unregisterPrefix(`${groupKey}[${gIndex}]`);
      };

      return (
        <div key={key} className={cn("flex flex-col gap-4", generateColClass(form.col || "12"))}>
          {group.map((gIndex) => (
            <div key={gIndex} className={cn("relative pr-8", wrap && "p-4 rounded border", className)}>
              {label && <p className="input-label">{label} {gIndex + 1}</p>}
              {tip && <small className={cn("input-tip")}>{tip}</small>}
              {(label || tip) && <div className="mb-2"></div>}

              <div className="w-full grid grid-cols-12 gap-4">
                {innerForms.map((inner, i) => renderInput(inner, i, `${mapName}[${gIndex}]`))}
              </div>

              {group.length > min && (
                <IconButtonComponent
                  icon={faTimes}
                  paint="danger"
                  variant="outline"
                  size="xs"
                  className={cn("absolute top-10 right-2 translate-x-[50%] -translate-y-[50%]", wrap && "translate-x-0 -translate-y-0 top-1 right-1")}
                  onClick={() => removeGroup(gIndex)}
                />
              )}
            </div>
          ))}

          <div>
            <ButtonComponent
              icon={faPlus}
              label={`Tambah ${label || mapName}`}
              variant="outline"
              size="sm"
              onClick={addGroup}
            />
          </div>
        </div>
      );
    }

    if (inputType === "custom") {
      const customRender = form.construction as formCustomConstructionProps;
      return (
        <div key={key} className={cn(form.className, generateColClass(form.col || "12"))}>
          {customRender?.({ formControl, values, setValues, errors, setErrors, setRegister, prefixName: prefix })}
        </div>
      );
    }

    const Component = inputMap[inputType] || InputComponent;
    return (
      <div key={key} className={cn(form.className, generateColClass(form.col || "12"))}>
        <Component
          {...(form.construction as any)}
          {...formControl(name)}
          disabled={ws?.disabled}
          readOnly={ws?.readonly}
        />
      </div>
    );
  };

  return (
    <>
      {title && <h4 className={cn("text-lg font-semibold mb-4", pcn<CT>(className, "title"))}>{title}</h4>}

      <form className={cn("grid grid-cols-12 gap-4", pcn<CT>(className, "base"))} onSubmit={submit}>
        {fresh && fields.map((f, i) => renderInput(f, i))}

        <div className="col-span-12">
          {footerControl?.({ loading }) || (
            <div className="flex justify-end mt-4">
              <ButtonComponent
                type="submit"
                label="Simpan"
                icon={faSave}
                loading={loading}
                className={pcn<CT>(className, "submit")}
              />
            </div>
          )}
        </div>
      </form>

      <ModalConfirmComponent
        show={confirm.show}
        onClose={() => confirm.onClose()}
        icon={faQuestionCircle}
        title="Yakin"
        submitControl={{ onSubmit: () => confirm?.onConfirm(), paint: "primary" }}
      >
        <p className="px-2 pb-2 text-sm text-center">Yakin semua data sudah benar?</p>
      </ModalConfirmComponent>

      <ToastComponent
        show={modal == "failed"}
        onClose={() => setModal(false)}
        title="Gagal"
        className="!border-danger header::text-danger"
      >
        <p className="px-3 pb-2 text-sm">
          Data gagal disimpan, cek data dan koneksi internet lalu coba kembali!
        </p>
      </ToastComponent>

      <ToastComponent
        show={modal == "success"}
        onClose={() => setModal(false)}
        title="Berhasil"
        className="!border-success header::text-success"
      >
        <p className="px-3 pb-2 text-sm">Data berhasil disimpan!</p>
      </ToastComponent>
    </>
  );
}