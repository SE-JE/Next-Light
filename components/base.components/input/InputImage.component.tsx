"use client"

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHolding, faImages, faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useInputHandler, useInputRandomId, useResponsive, useValidation, validation, ValidationRules } from "@utils";
import { BottomSheetComponent, ButtonComponent, IconButtonComponent, ModalComponent } from "@components";


type CT = "label" | "error" | "input" | "tip";

export interface InputImageProps {
  name    :  string;
  label  ?:  string;
  tip    ?:  string;

  value        ?:  string | File;
  aspect       ?:  string;
  invalid      ?:  string;
  disabled     ?:  boolean;
  validations  ?:  ValidationRules;

  onChange?: (file?: File | null) => void;
  register?: (name: string, validations?: ValidationRules) => void;

  className?: string;
}



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
  const { isSm }  =  useResponsive();

  const randomId  =  useInputRandomId();
  const inputRef  =  useRef<HTMLInputElement>(null);

  const [preview, setPreview]    =  useState("");
  const [drag, setDrag]          =  useState(false);
  const [cropSrc, setCropSrc]    =  useState<string | null>(null);
  const [openCrop, setOpenCrop]  =  useState(false);

  const inputHandler                         =  useInputHandler(name, value, validations, register, true);
  const [invalidMessage, setInvalidMessage]  =  useValidation(inputHandler.value, validations, invalid, inputHandler.idle);

  useEffect(() => {
    if (value) {
      const url = typeof value === "object" ? URL.createObjectURL(value) : value;
      setPreview(url);

      return () => {
        typeof value === "object" && URL.revokeObjectURL(url);
      };
    } else {
      setPreview("");
    }
  }, [value]);

  const openCropper = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setOpenCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setInvalidMessage("Format gambar tidak diperbolehkan (JPG/PNG/WebP)");
      return;
    }

    openCropper(file);
  };

  const onCropDone = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
    setOpenCrop(false);
  };

  const onCropCancel = () => {
    setOpenCrop(false);
    inputRef.current!.value = "";
  };

  const remove = () => {
    setPreview("");
    onChange?.(null);
    inputRef.current && (inputRef.current.value = "");
  };

  const onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);

    const file = e.dataTransfer.files?.[0];
    file && openCropper(file);
  };

  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={randomId}
          className={cn(
            "input-label",
            pcn<CT>(className, "label"),
            disabled && "opacity-50",
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
            disabled && "opacity-60",
          )}
        >{tip}</small>
      )}

      <label htmlFor={randomId}>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-2 w-full bg-background cursor-pointer overflow-hidden",
            drag ? "border-primary" : "border-gray-300",
            invalidMessage && "border-danger",
            pcn<CT>(className, "input")
          )}
          style={{
            aspectRatio: aspect,
            backgroundImage: preview ? `url(${preview})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDropFile}
        >
          <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center text-light">
            <FontAwesomeIcon icon={drag ? faHandHolding : faImages} className="text-3xl" />
            <p className="text-xs text-center mt-4">{drag ? "Letakkan di sini" : preview  ? "Klik atau seret untuk ganti Gambar" : "Klik atau seret gambar"}</p>
          </div>

          <input
            id={randomId}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={onUpload}
          />
        </div>
      </label>

      {preview && !disabled && (
        <IconButtonComponent
          icon={faTimes}
          paint="danger"
          size="sm"
          className="absolute top-10 right-4"
          onClick={remove}
        />
      )}

      {invalidMessage && (
        <small className={cn("input-error-message", pcn<CT>(className, "error"))}>
          {invalidMessage}
        </small>
      )}

      {!isSm ? (
        <ModalComponent show={openCrop} onClose={onCropCancel} title="Sesuaikan Gambar" className="w-max max-w-[350px]">
          {cropSrc && (
            <div className="p-4">
              <CanvasCropper
                src={cropSrc}
                aspect={eval(aspect.replace(":", "/"))}
                onDone={onCropDone}
              />
            </div>
          )}
        </ModalComponent>
      ) : (
        <BottomSheetComponent show={openCrop} onClose={onCropCancel} size={400}>
          {cropSrc && (
            <div className="p-4">
              <CanvasCropper
                src={cropSrc}
                aspect={eval(aspect.replace(":", "/"))}
                onDone={onCropDone}
              />
            </div>
          )}
        </BottomSheetComponent>
      )}
      
    </div>
  );
};



interface CropperProps {
  src      :  string;
  aspect   :  number;
  onDone  ?:  (file: File) => void;
}

export const CanvasCropper: React.FC<CropperProps> = ({
  src,
  aspect,
  onDone,
}) => {
  const canvasRef                =  useRef<HTMLCanvasElement>(null);
  const previewRef               =  useRef<HTMLCanvasElement>(null);
  const pinchDistRef             =  useRef(0);
  const pinchStartZoomRef        =  useRef(1);

  const [img, setImg]            =  useState<HTMLImageElement | null>(null);
  const [zoom, setZoom]          =  useState(1);
  const [minZoom, setMinZoom]    =  useState(1);
  const [maxZoom, setMaxZoom]    =  useState(4);
  const [pos, setPos]            =  useState({ x: 0, y: 0 });
  const [dragging, setDragging]  =  useState(false);
  const [start, setStart]        =  useState({ x: 0, y: 0 });

  const CROP_SIZE  =  280;
  const CROP_W     =  CROP_SIZE * aspect;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  const renderCanvas = () => {
    if (!img) return;

    const canvas   =  canvasRef.current!;
    const ctx      =  canvas.getContext("2d")!;

    canvas.width   =  CROP_W;
    canvas.height  =  CROP_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaledW  =  img.width * zoom;
    const scaledH  =  img.height * zoom;

    const x        =  pos.x - scaledW / 2 + CROP_W / 2;
    const y        =  pos.y - scaledH / 2 + CROP_SIZE / 2;

    ctx.drawImage(img, x, y, scaledW, scaledH);
  };

  useEffect(() => {
    renderCanvas();
  }, [img, zoom, pos]);

  useEffect(() => {
    if (!img) return;

    const imgW    =  img.naturalWidth;
    const imgH    =  img.naturalHeight;

    const scaleW  =  CROP_W / imgW;
    const scaleH  =  CROP_SIZE / imgH;

    const base    =  Math.max(scaleW, scaleH);

    setMinZoom(base);
    setZoom(base);
    setMaxZoom(base * 4);

  }, [img]);

  const handleDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleUp   =  () => setDragging(false);

  const handleMove =  (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    setStart({ x: e.clientX, y: e.clientY });
    setPos((p) => {
      const scaledW  =  img!.naturalWidth * zoom;
      const scaledH  =  img!.naturalHeight * zoom;

      const minX     =  (scaledW - CROP_W) / 2;
      const maxX     =  -(scaledW - CROP_W) / 2;
      const minY     =  (scaledH - CROP_SIZE) / 2;
      const maxY     =  -(scaledH - CROP_SIZE) / 2;

      return {
        x: clamp(p.x + dx, maxX, minX),
        y: clamp(p.y + dy, maxY, minY),
      };
    });
  };

  const performCrop = () => {
    if (!img) return;

    const preview   =  previewRef.current!;
    const pctx      =  preview.getContext("2d")!;

    preview.width   =  CROP_W;
    preview.height  =  CROP_SIZE;

    const scaledW   = img.width * zoom;
    const scaledH   = img.height * zoom;

    const x         =  pos.x - scaledW / 2 + CROP_W / 2;
    const y         =  pos.y - scaledH / 2 + CROP_SIZE / 2;

    pctx.drawImage(img, x, y, scaledW, scaledH);

    preview.toBlob((blob) => {
      const file = new File([blob!], "cropped.png", { type: "image/png" });
      onDone?.(file);
    });
  };


  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    setZoom((z) => {
      let next = z - e.deltaY * 0.002;
      next = Math.max(minZoom, Math.min(maxZoom, next));

      const scaledW = img!.naturalWidth * next;
      const scaledH = img!.naturalHeight * next;

      const minX = (scaledW - CROP_W) / 2;
      const maxX = -(scaledW - CROP_W) / 2;

      const minY = (scaledH - CROP_SIZE) / 2;
      const maxY = -(scaledH - CROP_SIZE) / 2;

      setPos((p) => ({
        x: clamp(p.x, maxX, minX),
        y: clamp(p.y, maxY, minY),
      }));

      return next;
    });
  };


  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const dist = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );

      pinchDistRef.current       =  dist;
      pinchStartZoomRef.current  =  zoom;

      e.preventDefault();
    }

    // Jika satu jari → drag
    if (e.touches.length === 1) {
      setDragging(true);
      setStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };


  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1        =  e.touches[0];
      const t2        =  e.touches[1];
      const currDist  =  Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

      const diff      =  currDist - pinchDistRef.current;
      let   nextZoom  =  pinchStartZoomRef.current + diff * 0.005;

      nextZoom  =  Math.max(minZoom, Math.min(maxZoom, nextZoom));

      setZoom(nextZoom);

      setPos((p) => {
        const scaledW = img!.naturalWidth * nextZoom;
        const scaledH = img!.naturalHeight * nextZoom;

        const minX = (scaledW - CROP_W) / 2;
        const maxX = -(scaledW - CROP_W) / 2;

        const minY = (scaledH - CROP_SIZE) / 2;
        const maxY = -(scaledH - CROP_SIZE) / 2;

        return {
          x: Math.max(maxX, Math.min(minX, p.x)),
          y: Math.max(maxY, Math.min(minY, p.y)),
        };
      });

      e.preventDefault();
      return;
    }

    if (dragging && e.touches.length === 1) {
      const { clientX, clientY } = e.touches[0];

      const dx = clientX - start.x;
      const dy = clientY - start.y;

      setStart({ x: clientX, y: clientY });

      setPos((p) => {
        const scaledW = img!.naturalWidth * zoom;
        const scaledH = img!.naturalHeight * zoom;

        const minX = (scaledW - CROP_W) / 2;
        const maxX = -(scaledW - CROP_W) / 2;

        const minY = (scaledH - CROP_SIZE) / 2;
        const maxY = -(scaledH - CROP_SIZE) / 2;

        return {
          x: Math.max(maxX, Math.min(minX, p.x + dx)),
          y: Math.max(maxY, Math.min(minY, p.y + dy)),
        };
      });

      e.preventDefault();
    }
  };


  const handleTouchEnd = () => {
    setDragging(false);
    pinchDistRef.current = 0;
  };

  return (
    <div style={{ touchAction: "none" }}>
      <div
        className="relative bg-background rounded-lg overflow-hidden mx-auto"
        style={{ width: CROP_W, height: CROP_SIZE }}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={CROP_W}
          height={CROP_SIZE}
          onMouseDown={handleDown}
          className="cursor-move"
        />

        <div className="absolute top-0 left-0 pointer-events-none" style={{ width: CROP_W, height: CROP_SIZE }}>
          <div className="absolute inset-0 border-2 border-slate-200"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full border-t border-slate-200"></div>
            <div className="absolute top-2/3 left-0 w-full border-t border-slate-200"></div>
            <div className="absolute left-1/3 top-0 h-full border-l border-slate-200"></div>
            <div className="absolute left-2/3 top-0 h-full border-l border-slate-200"></div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-2">
        <ButtonComponent 
          label="Selesai"
          variant="outline"
          onClick={performCrop}
          block
        />
      </div>

      <canvas ref={previewRef} className="hidden" />
    </div>
  );
};



