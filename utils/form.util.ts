"use client"

import { useReducer, useEffect, useState } from "react";
import { api, ApiType } from "./api.util";
import { validation, ValidationRules } from "@utils";

export interface FormRegisterType { 
  name         : string; 
  status      ?: boolean; 
  validations ?: string;
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

// ==============================>
// ## Form state
// ==============================>
const initialState: FormStateType = {
  formRegisters   : [],
  formValues      : [],
  formErrors      : [],
  loading         : false,
  showConfirm     : false,
};

type ActionPayloadType = {
  SET_REGISTER  : FormRegisterType;
  SET_VALUES    : FormValueType[];
  SET_VALUE     : FormValueType;
  SET_ERRORS    : FormErrorType[];
  SET_LOADING   : boolean;
  SET_CONFIRM   : boolean;
};

type TypeKeys = keyof ActionPayloadType;

export type ActionType<
  T extends TypeKeys =
    | "SET_REGISTER"
    | "SET_VALUES"
    | "SET_VALUE"
    | "SET_ERRORS"
    | "SET_LOADING"
    | "SET_CONFIRM"
    | "RESET"
    | any,
> = {
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
export const useForm = (
  submitControl   : ApiType,
  payload        ?: ((values: any)  => object) | false,
  confirmation   ?: boolean,
  onSuccess      ?: (data: any)     => void,
  onFailed       ?: (code: number)  => void,
) => {
  const [state, dispatch] = useReducer(formReducer, initialState);


  // ==============================>
  // ## Reset when first load
  // ==============================>
  useEffect(() => dispatch({ type: "RESET" }), [submitControl?.path]);


  // ==============================>
  // ## Set value from changes
  // ==============================>
  const onChange     =  (name: string, value?: any) => dispatch({ type: "SET_VALUE", payload: { name, value: value ?? "" } });


  // ==============================>
  // ## FormControl handler
  // ==============================>
  const formControl  =  (name: string)  =>  ({
    register  : (regName: string, regValidations?: ValidationRules) => dispatch({
      type    : "SET_REGISTER",
      payload : { name: regName, validations: regValidations },
    }),
    onChange  :  (e: any)                                        =>  onChange(name, e),
    value     :  state.formValues.find((val)                     =>  val.name === name)?.value || undefined,
    invalid   :  state.formErrors.find((err: { name: string })   =>  err.name === name)?.error || undefined,
  });


  // ==============================>
  // ## Fetch to api
  // ==============================>
  const fetch        =  async () => {
    // ==============================>
    // ## Set to loading
    // ==============================>
    dispatch({ type: "SET_LOADING", payload: true });


    // ==============================>
    // ## State values to payload
    // ==============================>
    const formData = new FormData();
        
    if(!payload) {
      // ==============================>
      // ## Basic from state values
      // ==============================>
      state.formValues.forEach((val) => {
        formData.append(val.name, val.value);
      });
    } else {
      // ==============================>
      // ## Custom from payload
      // ==============================>
      const objValues = state.formValues.reduce<Record<string, any>>((acc, val) => {
        acc[val.name] = val.value;
        return acc;
      }, {});
      
      const payloadValues: Record<string, any> = payload(objValues);
      Object.keys(payloadValues).forEach((key) => {
        formData.append(key, payloadValues[key]);
      });
    }


    // ==============================>
    // ## Execute api handler
    // ==============================>
    const execute = await api({
      url               : submitControl.url,
      path              : submitControl.path,
      method            : submitControl.method || "POST",
      bearer            : submitControl.bearer,
      headers           : submitControl.headers,
      payload           : formData,
    });

    if (execute?.status === 200 || execute?.status === 201) {
      // ==============================>
      // ## When success
      // ==============================>
      dispatch({ type: "SET_LOADING", payload: false });
      onSuccess?.(execute.data);
      dispatch({ type: "RESET" });
    } else if (execute?.status === 422) {
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
      name  : keyName,
      value : values[keyName],
    })) : [];
    
    dispatch({ type: "SET_VALUES", payload: newValues });
  };


  // ==============================>
  // ## Return hook handler
  // ==============================>
  return [
    {
      submit,
      formControl,
      setDefaultValues,
      values          : state.formValues,
      setValues       : (values: FormValueType[])   => dispatch({ type: "SET_VALUES", payload: values || [] }),
      errors          : state.formErrors,
      setErrors       : (errors: FormErrorType[])   => dispatch({ type: "SET_ERRORS", payload: errors }),
      setRegister     : (inputs: FormRegisterType)  => dispatch({ type: "SET_REGISTER", payload: inputs }),
      loading         : state.loading,
      confirm         : {
        onConfirm,
        show          : state.showConfirm,
        onClose       : () => dispatch({ type: "SET_CONFIRM", payload: false }),
      },
    },
  ];
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
  isFile?: boolean,
  // multiple?: boolean,
) => {
  const [inputValue, setInputValue]                    =  useState<any>("");
  const [focus, setFocus]                              =  useState<boolean>(false);
  const [idle, setIdle]                                =  useState(true);

  useEffect(() => {
    name && register?.(name || "", validations);
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