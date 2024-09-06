import React from "react";
import { Box, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useClientLogger } from "../../features/client-logger/client-logger";

export interface FileProps {
  blob: Blob;
  fileName: string;
}

export function FileDownload(props: FileProps) {
  const logger = useClientLogger();

  function onDownloadFile(blob: Blob, fileName: string) {
    logger.info("File: Downloading " + fileName);
    const fileExtension = blob.type.split("/")[1];
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName + "." + fileExtension;
    link.click();
  }

  return (
    <Paper
      sx={{
        width: "100%",
        minWidth: "250px",
        padding: "8px",
      }}
    >
      <Stack width="100%" direction="row" justifyContent='space-between' alignItems='center'>
        <Stack direction="column">
          <Typography>{props.fileName}</Typography>
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Typography fontSize={12}>{props.blob.type}</Typography>
            <Typography fontSize={12}>{props.blob.size} bytes</Typography>
          </Stack>
        </Stack>
        <IconButton onClick={() => onDownloadFile(props.blob, props.fileName)}>
          <FileDownloadIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}
