import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faHandHolding, faTrash } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useValidation, validation } from "@utils";
import { IconButtonComponent } from "@components";



type CT = "label" | "error" | "input" | "tip";

export interface InputImageProps {
  name    :  string;
  label  ?:  string;
  tip    ?:  string;

  value        ?:  string | File;
  aspect       ?:  string;
  invalid      ?:  string;
  disabled     ?:  boolean;
  validations  ?:  string;

  onChange  ?:  (file?: File | null) => void;
  register  ?:  (name: string, rules?: string) => void;

  /** Use custom class with: "label::", "error::". */
  className  ?:  string;
};




export const InputImageComponent: React.FC<InputImageProps> = ({
  name,
  label,
  tip,

  value,
  disabled,
  aspect = "1/1",
  invalid,
  validations,

  onChange,
  register,

  className = "",
}) => {

  const inputRef                     =  useRef<HTMLInputElement>(null);
  const [preview, setPreview]        =  useState<string>("");
  const [dragActive, setDragActive]  =  useState(false);


  // =========================>
  // ## Invalid handler
  // =========================>
  const inputHandler  =  useInputHandler(name, value, validations, register, true)
  const randomId      =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage, setInvalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  useEffect(() => {
    if (value) {
      const url = typeof value === "object" ? URL.createObjectURL(value) : value;
      
      setPreview(url);
      
      return () => { (typeof value === "object") && URL.revokeObjectURL(url) };
    } else {
      setPreview("");
    }
  }, [value]);


  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setInvalidMessage("Format gambar tidak diperbolehkan (hanya JPG/PNG/WebP).");
      return;
    }

    setInvalidMessage("");

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragActive(false);
    const file = e.dataTransfer.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange?.(file);
    }
  };


  const handleRemove = () => {
    setPreview("");
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };


  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={randomId}
          className={cn(
            "mb-1 block text-sm font-medium select-none",
            pcn<CT>(className, "label"),
            disabled ? "opacity-60" : ""
          )}
        >
          {label}
          {validations && validation.hasRules(validations, "required") && <span className="text-danger">*</span>}
        </label>
      )}

      {tip && (
        <small
          className={cn(
            "input-tip",
            pcn<CT>(className, "tip"),
            disabled && "opacity-60"
          )}
        >{tip}</small>
      )}

      <label htmlFor={randomId}>
        <div
          className={cn(
            "border rounded-xl w-full flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-background transition-all duration-200 relative",
            "border-dashed border-2 p-2",
            pcn<CT>(className, "input"),
            dragActive ? "border-primary" : "border-gray-200",
            !!invalidMessage && "border-red-500"
          )}
          style={{
            aspectRatio: aspect,
            backgroundImage: preview ? `url(${preview})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {!preview && (
            <div className="flex flex-col items-center text-gray-400">
              <FontAwesomeIcon
                icon={dragActive ? faHandHolding : faCamera}
                className="text-3xl mb-1"
              />
              <p className="text-xs">
                {dragActive ? "Letakkan di sini" : "Klik atau seret gambar"}
              </p>
            </div>
          )}

          <input
            ref={inputRef}
            id={randomId}
            name={name}
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </label>

      {preview && !disabled && (
        <IconButtonComponent icon={faTrash} onClick={handleRemove} variant="light" paint="danger" size="xs" className="absolute top-10 right-4" />
      )}

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
      )}
    </div>
  );
};
