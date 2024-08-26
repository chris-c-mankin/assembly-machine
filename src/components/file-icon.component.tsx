import { Box, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";

export interface FileIconProps {
  fileName?: string;
  isProcessing: boolean;
  isValid: boolean;
}

export function FileIcon(props: FileIconProps) {
  const iconColor = props.isProcessing
    ? "lightblue"
    : props.isValid
    ? "green"
    : "red";

  return (
    <Box>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          {props.fileName ? (
            <DescriptionIcon
              sx={{
                fontSize: 50,
                color: iconColor,
              }}
            />
          ) : (
            <UploadFileIcon
              sx={{
                fontSize: 50,
                color: "lightgray",
              }}
            />
          )}
        </Grid>
        <Grid
          item
          sx={{
            width: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <p
            style={{
              marginBlockEnd: 0,
              marginBlockStart: 0,
              minHeight: "13px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.fileName ? props.fileName : " "}
          </p>
        </Grid>
      </Grid>
    </Box>
  );
}
