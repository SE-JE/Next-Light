"use client"

import { useReducer, useEffect, useState } from "react";
import { DBSchema, idb, validation, ValidationRules, api, ApiType } from "@utils";

export interface FormRegisterType { 
  name         : string; 
  status      ?: boolean; 
  validations ?: ValidationRules;
}

export interface FormValueType { 
  name         : string; 
  value       ?: any;
}

export interface FormErrorType { 
  name         : string; 
  error       ?: string | null;
}

export interface FormStateType {
  formRegisters : FormRegisterType[];
  formValues    : FormValueType[];
  formErrors    : FormErrorType[];
  loading       : boolean;
  showConfirm   : boolean;
}

const initialState: FormStateType = {
  formRegisters   : [],
  formValues      : [],
  formErrors      : [],
  loading         : false,
  showConfirm     : false,
};

type ActionPayloadType = {
  SET_REGISTER      : FormRegisterType;
  UNREGISTER        : string;
  UNREGISTER_PREFIX : string;
  SET_VALUES        : FormValueType[];
  SET_VALUE         : FormValueType;
  SET_ERRORS        : FormErrorType[];
  SET_LOADING       : boolean;
  SET_CONFIRM       : boolean;
};

type TypeKeys = keyof ActionPayloadType;

export type ActionType<T extends TypeKeys = "SET_REGISTER" | "SET_VALUES" | "SET_VALUE" | "SET_ERRORS" | "SET_LOADING" | "SET_CONFIRM" | "RESET" | any> = {
  type: T,
  payload?: ActionPayloadType[T];
};



// ==============================>
// ## Form state handler
// ==============================>
const formReducer = (state: FormStateType, action: ActionType) => {
  switch (action.type) {
    // ==============================>
    // ## Register handler
    // ==============================>
    case "SET_REGISTER"     : return {
      ...state,
      formRegisters: [
        ...state.formRegisters.filter((reg) => reg.name !== action.payload.name),
        action.payload,
      ],
    };

    // ==============================>
    // ## Unregister single field — removes register, value, and error
    // ==============================>
    case "UNREGISTER"       : return {
      ...state,
      formRegisters : state.formRegisters.filter((reg) => reg.name !== action.payload),
      formValues    : state.formValues.filter((val) => val.name !== action.payload),
      formErrors    : state.formErrors.filter((err) => err.name !== action.payload),
    };

    // ==============================>
    // ## Unregister all fields matching prefix — for cluster group removal
    // ==============================>
    case "UNREGISTER_PREFIX" : return {
      ...state,
      formRegisters : state.formRegisters.filter((reg) => !reg.name.startsWith(action.payload)),
      formValues    : state.formValues.filter((val) => !val.name.startsWith(action.payload)),
      formErrors    : state.formErrors.filter((err) => !err.name.startsWith(action.payload)),
    };

    // ==============================>
    // ## Multiple values handler
    // ==============================>
    case "SET_VALUES"   : return {
      ...state,
      formValues: action.payload as { name: string; value?: any }[],
    };

    // ==============================>
    // ## Single value handler
    // ==============================>
    case "SET_VALUE"    : return {
      ...state,
      formValues: [
        ...state.formValues.filter((val) => val.name !== action.payload.name),
        { name: action.payload.name, value: action.payload.value },
      ],
    };

    // ==============================>
    // ## Errors handler
    // ==============================>
    case "SET_ERRORS"   : return { ...state, formErrors: action.payload };

    // ==============================>
    // ## Loading handler
    // ==============================>
    case "SET_LOADING"  : return { ...state, loading: action.payload };

    // ==============================>
    // ## Confirm handler
    // ==============================>
    case "SET_CONFIRM"  : return { ...state, showConfirm: action.payload };

    // ==============================>
    // ## Reset handler
    // ==============================>
    case "RESET"        : return { ...initialState };

    // ==============================>
    // ## Return state
    // ==============================>
    default             : return state;
  }
};



// ==============================>
// ## Hook form
// ==============================>
export const useForm = (submitControl: ((ApiType & { idb?: never }) | { idb: { store: string, schema?: DBSchema }}) & {
  payload       ?:  ((values: any)  => Promise<Record<string, any>> | Record<string, any>) | false,
  confirmation  ?:  boolean,
  onSuccess     ?:  (data: any)     => void,
  onFailed      ?:  (code: number)  => void,
}) => {
  const isApiSubmit                                   =  !!(submitControl as ApiType)?.path || !!(submitControl as ApiType)?.url
  const isIdbSubmit                                   =  !!submitControl?.idb
  const [state, dispatch]                             =  useReducer(formReducer, initialState);
  const {payload, confirmation, onSuccess, onFailed}  =  submitControl


  // ==============================>
  // ## Reset when first load
  // ==============================>
  useEffect(() => dispatch({ type: "RESET" }), [(submitControl as ApiType)?.path, (submitControl as ApiType)?.url, submitControl?.idb]);


  // ==============================>
  // ## Set value from changes
  // ==============================>
  const onChange     =  (name: string, value?: any) => dispatch({ type: "SET_VALUE", payload: { name, value: value ?? "" } });


  // ==============================>
  // ## FormControl handler
  // ==============================>
  const formControl  =  (name: string)  =>  ({
    register    : (_: string, regValidations?: ValidationRules) => dispatch({
      type      : "SET_REGISTER",
      payload   : { name, validations: regValidations },
    }),
    unregister  : () => dispatch({ type: "UNREGISTER", payload: name }),
    onChange    :  (e: any)                                        =>  onChange(name, e),
    value       :  state.formValues.find((val)                     =>  val.name === name)?.value || undefined,
    invalid     :  state.formErrors.find((err: { name: string })   =>  err.name === name)?.error || undefined,
  });



  const getObjectValues = () => {
    const registeredNames = new Set(state.formRegisters.map(r => r.name));
    return state.formValues.reduce<Record<string, any>>((acc, val) => {
      if (registeredNames.has(val.name)) acc[val.name] = val.value;
      return acc;
    }, {});
  }
    
  const submitIdb = async () => {
    const values  =  payload ? await payload(getObjectValues()) : getObjectValues()
    const client  =  submitControl?.idb?.schema ? idb.useSchema(submitControl?.idb?.schema) : idb

    await client.put(submitControl?.idb?.store || "", values)

    return { status: 200, data: values }
  }

  const submitApi = async () => {
    const formData  =  new FormData()
    const values    =  payload ? await payload(getObjectValues()) : getObjectValues()

    Object.entries(values as Record<string, any>).forEach(([k, v]) => {
      formData.append(k, v ?? "")
    })

    return api({
      url     : (submitControl as ApiType).url,
      path    : (submitControl as ApiType).path,
      method  : (submitControl as ApiType).method || "POST",
      bearer  : (submitControl as ApiType).bearer,
      headers : (submitControl as ApiType).headers,
      payload : formData,
    })
  }

  // ==============================>
  // ## Fetch to api
  // ==============================>
  const fetch        =  async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    let execute

    if (isApiSubmit) {
      execute = await submitApi()
    } else if (isIdbSubmit) {
      execute = await submitIdb()
    } else {
      throw new Error("Invalid submitControl")
    }

    if (execute?.status === 200 || execute?.status === 201) {
      // ==============================>
      // ## When success
      // ==============================>
      dispatch({ type: "SET_LOADING", payload: false });
      onSuccess?.(execute.data);
      dispatch({ type: "RESET" });
    } else if (isApiSubmit && execute?.status === 422) {
      // ==============================>
      // ## When error invalid
      // ==============================>
      const errors = Object.keys(execute.data.errors).map((key) => ({
        name: key,
        error: execute.data.errors[key][0],
      }));
      onFailed?.(execute?.status || 500);
      dispatch({ type: "SET_ERRORS", payload: errors });
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_CONFIRM", payload: false });
    } else {
      // ==============================>
      // ## When error server
      // ==============================>
      onFailed?.(execute?.status || 500);
      dispatch({ type: "SET_CONFIRM", payload: false });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };


  // ==============================>
  // ## Submit handler
  // ==============================>
  const submit = async (e: any) => {
    e?.preventDefault();
    dispatch({ type: "SET_ERRORS", payload: [] });

    const newErrors: { name: string; error?: any }[] = [];

    // ==============================>
    // ## Check register validation
    // ==============================>
    state.formRegisters.forEach((form) => {
      const { valid, message } = validation.check({
        value: state.formValues.find((val) => val.name === form.name)?.value,
        rules: form.validations,
      });

      if (!valid) {
        newErrors.push({ name: form.name, error: message });
      }
    });
    
    if (newErrors.length) {
      dispatch({ type: "SET_ERRORS", payload: newErrors });
      return;
    }

    // ==============================>
    // ## Execute handler
    // ==============================>
    if (confirmation) {
      dispatch({ type: "SET_CONFIRM", payload: true });
    } else {
      fetch();
    }
  };



  // ==============================>
  // ## Confirmation handler
  // ==============================>
  const onConfirm = () => fetch();


  // ==============================>
  // ## Set default value
  // ==============================>
  const setDefaultValues = (values: Record<string, any> | null) => {
    const newValues = values ? Object.keys(values).map((keyName) => ({
    name   :  keyName,
    value  :  values[keyName],
    }))    :  [];
    
    dispatch({ type: "SET_VALUES", payload: newValues });
  };


  // ==============================>
  // ## Return hook handler
  // ==============================>
  return {
    submit,
    formControl,
    setDefaultValues,
    values            :  state.formValues,
    setValues         :  (values: FormValueType[])   => dispatch({ type: "SET_VALUES", payload: values || [] }),
    errors            :  state.formErrors,
    setErrors         :  (errors: FormErrorType[])   => dispatch({ type: "SET_ERRORS", payload: errors }),
    setRegister       :  (inputs: FormRegisterType)  => dispatch({ type: "SET_REGISTER", payload: inputs }),
    unregister        :  (name: string)              => dispatch({ type: "UNREGISTER", payload: name }),
    unregisterPrefix  :  (prefix: string)            => dispatch({ type: "UNREGISTER_PREFIX", payload: prefix }),
    loading           :  state.loading,
    confirm           :  {
      onConfirm,
      show       : state.showConfirm,
      onClose    : () => dispatch({ type: "SET_CONFIRM", payload: false }),
    },
  }
};



// ==============================>
// ## Generate random id
// ==============================>
export const useInputRandomId = () => {
  const [randomId, setRandomId]  =  useState("");

  useEffect(() => {
      setRandomId(Math.random().toString(36).substring(7));
    }, []);

  return randomId;
};


// ==============================>
// ## Input handle
// ==============================>
export const useInputHandler = (
  name?: string, 
  value?: any, 
  validations?: ValidationRules,
  register?: (name: string, validations?: ValidationRules) => void,
  unregister?: (name: string) => void,
  isFile?: boolean,
) => {
  const [inputValue, setInputValue]                    =  useState<any>("");
  const [focus, setFocus]                              =  useState<boolean>(false);
  const [idle, setIdle]                                =  useState(true);

  useEffect(() => {
    name && register?.(name || "", validations);
    return () => { name && unregister?.(name); };
  }, [name, validations]);

  useEffect(() => {
    setInputValue(value && (!isFile || value instanceof File) ? value : "");
    value && setIdle(false);
  }, [value]);

  return {
    value: inputValue, 
    setValue: setInputValue,
    idle,
    setIdle,
    focus,
    setFocus
  };
};