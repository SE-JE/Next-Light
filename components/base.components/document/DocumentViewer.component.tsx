"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileImage, faFileWord, faFileExcel, faFile } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils";



type Props = {
  file    ?:  File | string | null;
  width   ?:  number;
  height  ?:  number;
  mode    ?:  "full" | "thumb";
};



export const DocumentViewerIcon = (ext: string) => {
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
      return faFileImage;
    case "pdf":
      return faFilePdf;
    case "doc":
    case "docx":
      return faFileWord;
    case "xls":
    case "xlsx":
      return faFileExcel;
    default:
      return faFile;
  }
};



export function DocumentViewerComponent({ file, width, height, mode = "full" }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }

    if (typeof file === "string") {
      setFileUrl(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFileUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const extension = useMemo(() => {
    if (!file) return null;
    if (typeof file === "string") {
      const clean = file.split("?")[0].split("#")[0];
      return clean.split(".").pop()?.toLowerCase() || null;
    }
    return file.name.split(".").pop()?.toLowerCase() || null;
  }, [file]);

  const isImage = ["jpg", "jpeg", "png", "webp"].includes(extension || "");
  const isPdf = extension === "pdf";

  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!file || !isPdf || !fileUrl || !canvasRef.current) return;

    let cancelled = false;

    const renderPdf = async () => {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }

      let loadingTask;

      if (typeof file === "string") {
        loadingTask = pdfjs.getDocument(fileUrl);
      } else {
        const buf = await file.arrayBuffer();
        const uint8 = new Uint8Array(buf);
        loadingTask = pdfjs.getDocument({ data: uint8 });
      }

      const pdf = await loadingTask.promise;
      if (cancelled) return;

      const page = await pdf.getPage(1);
      if (cancelled) return;

      const scale = mode === "thumb" ? 0.35 : 1;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({ canvasContext: ctx, viewport, canvas });;
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      renderTaskRef.current = null;
    };

    renderPdf();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }
    };
  }, [isPdf, fileUrl, mode]);

  if (!fileUrl) return null;


  return (
    <div
      style={{
        width: width ? width : "100%",
        height: height ? height : "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isImage && <Image src={fileUrl} alt="document" fill className={mode === "thumb" ? "object-cover" : "object-contain"}/>}

      {isPdf && <canvas ref={canvasRef} className={cn("block w-full h-full",  mode === "thumb" ? "object-cover" : "object-contain")} />}

      {!isImage && !isPdf && (
        <div className={cn("w-full h-full flex flex-col items-center justify-center opacity-50 gap-4")}>
          <FontAwesomeIcon icon={DocumentViewerIcon(extension || "")} className={mode !== "thumb" ? "text-3xl" : "text-lg"} />
          {mode !== "thumb" && file instanceof File && (<p className="text-center text-sm">{file.name}</p>)}
        </div>
      )}
    </div>
  );
}