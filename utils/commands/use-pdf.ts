import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger";

export function usePdf() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.join(__dirname, "..", "..");

  const source = path.join(
    projectRoot,
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.min.mjs"
  );

  const target = path.join(projectRoot, "public", "pdf.worker.min.mjs");

  if (!fs.existsSync(source)) {
    logger.error(`Gagal: pdf.worker.min.mjs tidak ditemukan.`)
    process.exit(1);
  }

  fs.copyFileSync(source, target);
  logger.info("Berhasil memindahkan worker ke public/pdf.worker.min.mjs")
}
