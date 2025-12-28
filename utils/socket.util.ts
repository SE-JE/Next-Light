"use client"

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { logger } from "./commands/logger";

const host = process.env.NEXT_PUBLIC_SOCKET_URL;
let s: Socket | null = null;

export const socket = {
  connect: () => {
    if (host) {
      if (!s) {
        s = io(host, {
          autoConnect           :  true,
          transports            :  ["websocket"],
          reconnection          :  true,
          reconnectionAttempts  :  5,
          reconnectionDelay     :  2000,
          withCredentials       :  true,
        });
  
        s.on("connect", () => {
          logger.socket("server connected:", s?.id)
        });
  
        s.on("disconnect", (reason) => {
          logger.socketError("server disconnected:", reason)
        });
  
        s.on("connect_error", (err) => {
          logger.socketError("server connection error:", err.message)
        });
      } else if (s.disconnected) {
        s.connect();
      }
    }

    return s;
  },

  disconnect: () => {
    if (s) {
      s.disconnect();
      s = null;
    }
  },
} 




export const useSocket = () => {
  const [socketState, setSocketState] = useState<Socket | null>(null);

  useEffect(() => {
    const soc = socket.connect();
    setSocketState(soc);

    return () => {
      soc?.off();
    };
  }, []);

  return {socket: socketState};
};