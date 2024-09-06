import { Box, Grid, Typography } from "@mui/material";
import { useClientLogger } from "../features/client-logger/client-logger";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export interface FileProps {
  blob: Blob;
  fileName: string;
}

export function File(props: FileProps) {
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
    <Box>
      <Grid container direction="row">
        <Grid item xs={6}>
          <Typography>{props.fileName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{props.blob.type}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{props.blob.size} bytes</Typography>
        </Grid>
        <Grid item xs={2}>
          <FileDownloadIcon
            onClick={() => onDownloadFile(props.blob, props.fileName)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
