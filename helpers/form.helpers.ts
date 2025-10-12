import { useReducer, useEffect } from "react";
import { post, PostPropsType } from "./api.helpers";
import { validationHelper, ValidationRulesType } from "./validation.helpers";

const initialState = {
  formRegisters: [] as { name: string; validations?: ValidationRulesType }[],
  formValues: [] as { name: string; value?: any }[],
  formErrors: [] as { name: string; error?: any }[],
  loading: false,
  showConfirm: false,
};

const formReducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        formValues: [
          ...state.formValues.filter((val) => val.name !== action.payload.name),
          { name: action.payload.name, value: action.payload.value },
        ],
      };

    case "SET_ERRORS":
      return { ...state, formErrors: action.payload };

    case "REGISTER_FIELD":
      return {
        ...state,
        formRegisters: [
          ...state.formRegisters.filter(
            (reg) => reg.name !== action.payload.name,
          ),
          action.payload,
        ],
      };

    case "UNREGISTER_FIELD":
      return {
        ...state,
        formValues: state.formValues.filter(
          (val) => val.name !== action.payload.name,
        ),
        formRegisters: state.formRegisters.filter(
          (reg) => reg.name !== action.payload.name,
        ),
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_CONFIRM":
      return { ...state, showConfirm: action.payload };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
};

export const useForm = (
  submitControl: PostPropsType,
  payload?: ((values: any) => object) | false,
  confirmation?: boolean,
  onSuccess?: (data: any) => void,
  onFailed?: (code: number) => void,
) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [submitControl?.path]);

  const onChange = (name: string, value?: any) => {
    dispatch({ type: "SET_VALUE", payload: { name, value: value ?? "" } });
  };

  const formControl = (name: string) => ({
    onChange: (e: any) => onChange(name, e),
    value:
      state.formValues.find((val) => val.name === name)?.value || undefined,
    error:
      state.formErrors.find((err: { name: string }) => err.name === name)
        ?.error || undefined,
    register: (regName: string, regValidations?: ValidationRulesType) => {
      dispatch({
        type: "REGISTER_FIELD",
        payload: { name: regName, validations: regValidations },
      });
    },
    // unregister: () => {
    //   dispatch({ type: "UNREGISTER_FIELD", payload: { name } });
    // },
  });

  const fetch = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    const formData = new FormData();

    if(!payload) {
      state.formValues.forEach((val) => {
        formData.append(val.name, val.value);
      });
    } else {
      const payloadValues: Record<string, any> = payload(state.formValues);
      Object.keys(payloadValues).forEach((key) => {
        formData.append(key, payloadValues[key]);
      });
    }

    const mutate = await post({
      url: submitControl.url,
      path: submitControl.path,
      bearer: submitControl.bearer,
      includeHeaders: submitControl.includeHeaders,
      contentType: submitControl.contentType,
      body: formData,
    });

    if (mutate?.status === 200 || mutate?.status === 201) {
      dispatch({ type: "SET_LOADING", payload: false });
      onSuccess?.(mutate.data);
      dispatch({ type: "RESET" });
    } else if (mutate?.status === 422) {
      const errors = Object.keys(mutate.data.errors).map((key) => ({
        name: key,
        error: mutate.data.errors[key][0],
      }));
      dispatch({ type: "SET_ERRORS", payload: errors });
      onFailed?.(mutate?.status || 500);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_CONFIRM", payload: false });
    } else {
      onFailed?.(mutate?.status || 500);
      dispatch({ type: "SET_CONFIRM", payload: false });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const submit = async (e: any) => {
    e?.preventDefault();
    dispatch({ type: "SET_ERRORS", payload: [] });

    const newErrors: { name: string; error?: any }[] = [];

    state.formRegisters.forEach((form) => {
      const { valid, message } = validationHelper({
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

    if (confirmation) {
      dispatch({ type: "SET_CONFIRM", payload: true });
    } else {
      fetch();
    }
  };

  const onConfirm = () => {
    fetch();
  };

  const setDefaultValues = (values: Record<string, any>) => {
    const newValues = Object.keys(values).map((keyName) => ({
      name: keyName,
      value: values[keyName],
    }));
    dispatch({ type: "SET_VALUE", payload: newValues });
  };

  return [
    {
      formControl,
      values: state.formValues,
      setValues: (values: any) =>
        dispatch({ type: "SET_VALUE", payload: values }),
      errors: state.formErrors,
      setErrors: (errors: any) =>
        dispatch({ type: "SET_ERRORS", payload: errors }),
      setDefaultValues,
      registers: state.formRegisters,
      setRegisters: (regs: any) =>
        dispatch({ type: "REGISTER_FIELD", payload: regs }),
      submit,
      loading: state.loading,
      confirm: {
        show: state.showConfirm,
        onConfirm,
        onClose: () => dispatch({ type: "SET_CONFIRM", payload: false }),
      },
    },
  ];
};
