/* eslint-disable no-console */
type LogType = "start" | "info" | "error" | "warning" | "cavity" | "socket" | "cavityError" | "socketError";

const colors: Record<LogType | "default", string> = {
  default      :  "\x1b[0m",      // default
  start        :  "\x1b[32m",     // green
  info         :  "\x1b[36m",     // cyan
  error        :  "\x1b[31m",     // red
  warning      :  "\x1b[33m",     // yellow
  cavity       :  "\x1b[34m",     // blue
  cavityError  :  "\x1b[31m",     // red
  socket       :  "\x1b[35m",     // magenta
  socketError  :  "\x1b[31m",     // red
};

const prefixes: Record<LogType, string> = {
  start        :  "START",
  info         :  "INFO",
  error        :  "ERROR",
  warning      :  "WARNING",
  cavity       :  "CAVITY",
  socket       :  "SOCKET",
  cavityError  :  "CAVITY ERROR",
  socketError  :  "SOCKET ERROR",
};

function log(type: LogType, ...msg: unknown[]) {
  const color = colors[type];
  const prefix = prefixes[type];
  console.log(`${color}[${prefix}]${colors.default}`, ...msg);
}

export const logger = {
  start        :  (...msg: unknown[]) => log("start", ...msg),
  info         :  (...msg: unknown[]) => log("info", ...msg),
  error        :  (...msg: unknown[]) => log("error", ...msg),
  warning      :  (...msg: unknown[]) => log("warning", ...msg),
  cavity       :  (...msg: unknown[]) => log("cavity", ...msg),
  cavityError  :  (...msg: unknown[]) => log("cavityError", ...msg),
  socket       :  (...msg: unknown[]) => log("socket", ...msg),
  socketError  :  (...msg: unknown[]) => log("socketError", ...msg),
};
