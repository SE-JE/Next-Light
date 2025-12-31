"use client"

import { useState, useRef, InputHTMLAttributes, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useResponsive, useValidation, validation, ValidationRules } from "@utils";
import { DocumentViewerComponent, IconButtonComponent, ButtonComponent, FloatingPageComponent, DocumentViewerIcon, BottomSheetComponent } from "@components";



type DocFile = {
  id: string;
  file: File;
  url: string;
  type: string;
};

type CT = "label" | "tip" | "error" | "base" | "icon";

export interface InputDocumentProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  any;
  invalid      ?:  string;

  validations   ?:  ValidationRules;

  onChange  ?:  (value: any) => any;
  register  ?:  (name: string, validations  ?: ValidationRules) => void;

  /** Use custom class with: "label::", "tip::", "error::", "icon::", "suggest::", "suggest-item::". */
  className  ?:  string;
}



export function InputDocumentComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  invalid,

  validations,

  register,
  onChange,

  ...props
} : InputDocumentProps) {
  const { isSm }  =  useResponsive();

  // =========================>
  // ## Initial
  // =========================>
  const inputHandler      =  useInputHandler(props.name, value, validations, register, props.type == "file")
  const randomId          =  useInputRandomId()

  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  return (
    <>
      <div className="relative flex flex-col gap-y-0.5">
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            props.disabled && pcn<CT>(className, "label", "disabled"),
            inputHandler.focus && "text-primary",
            inputHandler.focus && pcn<CT>(className, "label", "focus"),
            !!invalidMessage && "text-danger",
            !!invalidMessage && pcn<CT>(className, "label", "focus"),
          )}
        >
          {label}
          {validations && validation.hasRules(validations, "required") && <span className="text-danger">*</span>}
        </label>

        {tip && (
          <small
            className={cn(
              "input-tip",
              pcn<CT>(className, "tip"),
              props.disabled && "opacity-60",
              props.disabled && pcn<CT>(className, "tip", "disabled"),
            )}
          >{tip}</small>
        )}

        <div className="relative">
          <input
            {...props}
            id={randomId}
            placeholder={!inputHandler.value ? props.placeholder : ""}
            className={cn(
              "input cursor-pointer",
              props.type == "file" && "input-file",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "base"),
              !!invalidMessage && "input-error",
              !!invalidMessage && pcn<CT>(className, "base", "error"),
            )}
            onFocus={(e) => {
              props.onFocus?.(e);
              inputHandler.setFocus(true);
            }}
            inputMode="none"
          />


          {(inputHandler.value) && (
            <div
              className={`${(leftIcon ? "5.2rem" : "ml-2")} absolute top-1/2 -translate-y-1/2 overflow-x-hidden py-1.5 input-scroll w-max flex gap-2 overflow-hidden cursor-pointer`} 
              style={{ maxWidth: `calc(100% - ${leftIcon ? "5.2rem" : "2rem"})` }}
              onClick={() => {
                inputHandler.setFocus(true);
              }}
            >
              {(Array.isArray(inputHandler.value) ? inputHandler.value : []).map((f) => {
                return (
                  <span
                    key={f.id}
                    className="flex items-center gap-1 input-values-item py-1 max-w-[150px] border-dashed"
                  >
                    <FontAwesomeIcon icon={DocumentViewerIcon(f.file.name.split(".").pop()?.toLowerCase())} className="text-light-foreground" />
                    <span className="line-clamp-1">{f.file.name}</span>
                  </span>
                )
              })}
            </div>
          )}

          {leftIcon && (
            <FontAwesomeIcon
              className={cn(
                "left-4 input-icon",
                pcn<CT>(className, "icon"),
                props.disabled && "opacity-60",
                props.disabled && pcn<CT>(className, "icon", "disabled"),
                inputHandler.focus && "text-primary",
                inputHandler.focus && pcn<CT>(className, "icon", "focus"),
              )}
              icon={leftIcon}
            />
          )}

          {rightIcon && (
            <FontAwesomeIcon
              className={cn(
                "right-4 input-icon",
                pcn<CT>(className, "icon"),
                props.disabled && "opacity-60",
                props.disabled && pcn<CT>(className, "icon", "disabled"),
                inputHandler.focus && "text-primary",
                inputHandler.focus && pcn<CT>(className, "icon", "focus"),
              )}
              icon={rightIcon}
            />
          )}
        </div>

        {invalidMessage && <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>}
      </div>

      {!isSm ? (
        <FloatingPageComponent
          show={inputHandler.focus}
          onClose={() => inputHandler.setFocus(false)}
          title={label}
          footer={
            <ButtonComponent
              label="Selesai"
              variant="outline"
              onClick={() => inputHandler.setFocus(false)}
              block
            />
          }
        >
          <InputDocumentPicker 
            value={inputHandler.value}
            onChange={(e) => {
              inputHandler.setValue(e);
              if (inputHandler.idle) inputHandler.setIdle(false);
              onChange?.(e)
            }}
          />

        </FloatingPageComponent>
      ) : (
        <BottomSheetComponent
          show={inputHandler.focus}
          onClose={() => inputHandler.setFocus(false)}
          size={'98vh'}
          footer={
            <ButtonComponent
              label="Selesai"
              variant="outline"
              onClick={() => inputHandler.setFocus(false)}
              block
            />
          }
        >
          <InputDocumentPicker 
            value={inputHandler.value}
            onChange={(e) => {
              inputHandler.setValue(e);
              if (inputHandler.idle) inputHandler.setIdle(false);
              onChange?.(e)
            }}
          />

        </BottomSheetComponent>
      )}
    </>
  );
}


export interface InputDocumentPickerProps {
  value     ?:  any[];
  onChange  ?:  (value: any[]) => void;
}

export const InputDocumentPicker: React.FC<InputDocumentPickerProps> = ({ value, onChange }) => {
  const { isSm }  =  useResponsive();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewActive, setPreviewActive] = useState<string | null>(null);

  const files: DocFile[] = Array.isArray(value) ? value : [];

  function updateFiles(next: DocFile[]) {
    onChange?.(next);
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files;
    if (!picked) return;

    const next = [...files];

    Array.from(picked).forEach((f) => {
      const id = Math.random().toString(36).substring(7);
      next.push({
        id,
        file: f,
        url: URL.createObjectURL(f),
        type: f.type,
      });

      if (!previewActive) setPreviewActive(id);
    });

    updateFiles(next);
    e.target.value = "";
  }

  function removeFile(id: string) {
    const next = files.filter((x) => x.id !== id);

    updateFiles(next);

    if (previewActive === id) {
      setPreviewActive(next[0]?.id || null);
    }
  }

  return (<>
    <div className="p-4 flex flex-col gap-4">
      <div className="border rounded border-dashed p-3 bg-background h-[350px] md:h-[600px] flex justify-center items-center">
        {files.find((x) => x.id === previewActive)?.file ? (
          <DocumentViewerComponent 
            file={files.find((x) => x.id === previewActive)?.file}
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-6 justify-center items-center cursor-pointer text-light-foreground" onClick={() => fileInputRef.current?.click()}>
            <FontAwesomeIcon icon={faPlus} className="text-3xl" />
            <p className="text-lg">Tambah Dokumen</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilePick}
      />

      <div className="max-h-[calc(100vh-650px)] md:max-h-[calc(100vh-750px)] overflow-y-auto">
        <div className="grid grid-cols-5 gap-1">
          {files.map((f) => {
            return (
              <div
                key={f.id}
                className={`relative w-full aspect-square flex justify-center bg-white items-center cursor-pointer ${
                  previewActive === f.id ? "brightness-100" : "brightness-70 hover:brightness-90"
                }`}
                onClick={() => setPreviewActive(f.id)}
              >
                <DocumentViewerComponent 
                  file={f.file}
                  mode="thumb"
                />

                <IconButtonComponent
                  icon={faTimes}
                  onClick={() => removeFile(f.id)}
                  variant="light"
                  paint="danger"
                  className="absolute top-2 right-2"
                  size={isSm ? "xs" : "sm"}
                />
              </div>
            );
          })}

          <div className="w-full aspect-square flex flex-col gap-2 justify-center items-center border border-dashed cursor-pointer text-light-foreground" onClick={() => fileInputRef.current?.click()}>
            <FontAwesomeIcon icon={faPlus} />
            <p className="text-[10px] text-center">Tambah Dokumen</p>
          </div>
        </div>
      </div>
    </div>
  </>)
}