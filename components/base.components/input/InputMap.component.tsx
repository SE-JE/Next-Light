"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { cn, pcn, useInputHandler, useInputRandomId, useResponsive, useValidation, validation, ValidationRules } from "@utils";
import { BottomSheetComponent, ButtonComponent, OutsideClickComponent } from "@components";



type CT = "label" | "tip" | "error" | "input" | "icon";

export interface ValueMapProps {
  lat       :  number | null;
  lng       :  number | null;
  address  ?:  string;
}

export interface InputMapProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label      ?:  string;
  tip        ?:  string | React.ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  any;
  invalid      ?:  string;
  validations  ?:  ValidationRules;

  onChange  ?:  (value: any) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  className  ?:  string;
}



export function InputMapComponent({
  label,
  tip,
  leftIcon,
  rightIcon,

  value,
  invalid,
  validations,
  
  register,
  onChange,
  
  className = "",
  ...props
}: InputMapProps) {
  const { isSm }  =  useResponsive();

  // =========================>
  // ## Invalid handler
  // =========================>
  const inputHandler  =  useInputHandler(props.name, value, validations, register, false)
  const randomId      =  useInputRandomId()


  // =========================>
  // ## Invalid handler
  // =========================>
  const [invalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);


  return (
    <>
    <div className="relative flex flex-col gap-y-0.5">
      {label && (
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            props.disabled && "opacity-50",
            inputHandler.focus && "text-primary",
            !!invalidMessage && "text-danger",
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
            props.disabled && "opacity-60",
          )}
        >{tip}</small>
      )}

      <OutsideClickComponent onOutsideClick={!isSm ? () => inputHandler.setFocus(false) : undefined}>
        <div className="relative">
          <input
            {...props}
            id={randomId}
            className={cn(
              "input",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              pcn<CT>(className, "input"),
              !!invalidMessage && "input-error",
            )}
            value={inputHandler.value?.address || ""}
            readOnly
            onFocus={(e) => {
              props.onFocus?.(e);
              inputHandler.setFocus(true);
              inputHandler.setIdle(false);
            }}
            autoComplete="off"
          />

          {leftIcon && (
            <FontAwesomeIcon
              className={cn(
                "left-4 input-icon",
                pcn<CT>(className, "icon"),
                props.disabled && "opacity-60",
                inputHandler.focus && "text-primary",
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
                inputHandler.focus && "text-primary",
              )}
              icon={rightIcon}
            />
          )}

          {!isSm && inputHandler.focus && (
            <div
              className="absolute top-full left-0 mt-2 w-full z-50 bg-background border border-light-border rounded-md overflow-hidden shadow-lg"
              style={{ height: 300 }}
            >
              <InputMapPickerComponent 
                value={inputHandler.value}
                onChange={(e) => {
                  inputHandler.setValue(e)
                  onChange?.(e)
                }}
              />
            </div>
          )}
        </div>
      </OutsideClickComponent>

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>{invalidMessage}</small>
      )}
    </div>

    {isSm && (
      <BottomSheetComponent
        show={inputHandler.focus}
        onClose={() => inputHandler.setFocus(false)}
        size={450}
        footer={
          <div className="p-4">
            <ButtonComponent
              label="Selesai"
              variant="outline"
              onClick={() => inputHandler.setFocus(false)}
              block
            />
          </div>
        }
      >
        <div className="p-4">
          <InputMapPickerComponent
            onChange={(e) => {
              inputHandler.setValue(e);
              onChange?.(e);
            }}
          />
        </div>
      </BottomSheetComponent>
    )}
    </>
  );
}


export interface MapPickerProps {
  value     ?:  any;
  onChange  ?:  (value: any) => any;
}

export const InputMapPickerComponent: React.FC<MapPickerProps> = ({
  onChange,
  value
}) => {
  const mapRef  =  useRef<google.maps.Map | null>(null);

  const [addressLoading, setAddressLoading]  =  useState(false);
  const [drag, setDrag]                      =  useState(false);


  // =========================>
  // ## Map Events
  // =========================>
  const setCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "",
        };

        onChange?.(newPos);
        mapRef.current?.panTo(new google.maps.LatLng(newPos.lat, newPos.lng));
      });
    }
  };


  const handleDragEnd = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();

      if (center) {
        onChange?.({
          lat: center.lat(),
          lng: center.lng(),
          address: "",
        });
      }

      setDrag(false);
    }
  }, []);


  // =========================>
  // ## Reverse Geocode
  // =========================>
  useEffect(() => {
    if (value?.lat && value?.lng) {
      setAddressLoading(true);
      onChange?.((prev: any) => ({ ...prev, address: "" }));

      axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${value?.lat}&lon=${value?.lng}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`)
        .then((res) => {
          if (res.status === 200 && !res.data.error) {
            const data = res.data.features?.at(0)?.properties;
            const address =(data?.address_line1 || "") + " " + (data?.address_line2 || "");

            onChange?.((prev: any) => ({ ...prev, address }));
            onChange?.({ ...value, address });
          }
        })
        .finally(() => setAddressLoading(false));
    }
  }, [value?.lat, value?.lng]);

  return (
    <div className="relative w-full">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_KEY || ""}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{
            lat: value?.lat || -6.208,
            lng: value?.lng || 106.689,
          }}
          zoom={18}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {mapRef.current = map}}
          onDrag={() => setDrag(true)}
          onDragEnd={handleDragEnd}
        />
      </LoadScript>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <FontAwesomeIcon
          icon={faLocationDot}
          className={cn(
            "text-3xl text-primary drop-shadow-md transition-transform",
            drag && "scale-125 -translate-y-2",
          )}
        />
      </div>

      <div className="absolute top-3 left-3 bg-background px-3 py-2 rounded-lg shadow">
        {addressLoading && !value?.address ? (
          <div className="py-4 w-[200px]" />
        ) : (
          <span className="text-sm">{value?.address}</span>
        )}
      </div>

      <div
        className="absolute top-3 right-3 bg-background p-3 rounded-lg cursor-pointer shadow"
        onClick={() => setCurrentPosition()}
      ><FontAwesomeIcon icon={faLocationCrosshairs} className="text-lg" /></div>
    </div>
  )
}