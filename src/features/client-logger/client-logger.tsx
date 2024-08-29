import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useImmer } from "use-immer";

interface ClientLogger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  logs: ClientLog[];
}

const ClientLoggerContext = createContext<ClientLogger>(null!);

export const useClientLogger = () => {
  return useContext(ClientLoggerContext);
};

export interface ClientLog {
  message: string;
  level: "info" | "warn" | "error";
  timestamp: Date;
}

export const ClientLoggerContextProvider = (props: PropsWithChildren) => {
  const [logs, setLogs] = useImmer<ClientLog[]>([]);

  function addLog(log: ClientLog) {
    setLogs((logs) => {
      logs.push(log);
    });
  }

  const logger: ClientLogger = useMemo(
    () => ({
      info: (message: string) => {
        addLog({ message, level: "info", timestamp: new Date() });
      },
      warn: (message: string) => {
        addLog({ message, level: "warn", timestamp: new Date() });
      },
      error: (message: string) => {
        addLog({ message, level: "error", timestamp: new Date() });
      },
      logs,
    }),
    [logs]
  );

  return <ClientLoggerContext.Provider value={logger} {...props} />;
};
