import { Box, Grid, Typography } from "@mui/material";
import { ClientLog } from "../../features/client-logger/client-logger";
import { useEffect, useState } from "react";

interface LogsProps {
  logs: ClientLog[];
}

export function Logs(props: LogsProps) {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  function scrollToBottom(container: HTMLElement): void {
    container.scrollTop = container.scrollHeight;
  }

  useEffect(() => {
    const container = document.getElementById("client-logs") as HTMLElement;
    container.addEventListener("scroll", () => {
      const isCloseToBottom: boolean =
        Math.abs(
          container.scrollHeight - container.scrollTop - container.clientHeight
        ) < 10;
      setShouldScrollToBottom(isCloseToBottom);
    });
  }, []);

  useEffect(() => {
    if (shouldScrollToBottom) {
      const container = document.getElementById("client-logs") as HTMLElement;
      scrollToBottom(container);
    }
  }, [props.logs]);

  return (
    <Box
      id="client-logs"
      sx={{
        height: "calc(100% - 32px)",
        overflowY: "auto",
        padding: 2,
        border: "1px solid lightgray",
        borderRadius: 2,
        backgroundColor: "white smoke",
        fontFamily: "monospace",
      }}
    >
      {props.logs.map((log) => (
        <Grid container justifyContent="flex-start">
          <Grid item>
            <Typography
              fontSize={13}
              key={`icon-${log.timestamp.toISOString()}`}
              color={getLogColor(log.level)}
            >
              {getLogIcon(log.level)} &nbsp;
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              fontSize={13}
              key={log.timestamp.toISOString()}
              color={getLogColor(log.level)}
            >
              {log.message}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

function getLogColor(level: "info" | "warn" | "error") {
  switch (level) {
    case "info":
      return "primary";
    case "warn":
      return "warning";
    case "error":
      return "error";
  }
}

function getLogIcon(level: "info" | "warn" | "error") {
  switch (level) {
    case "info":
      return "[Info]";
    case "warn":
      return "[Warning]";
    case "error":
      return "[Error]";
  }
}
