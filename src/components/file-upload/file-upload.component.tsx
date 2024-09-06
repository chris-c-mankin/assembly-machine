import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { createRef } from "react";
import { FileIconWithName } from "../file-icon-with-name/file-icon-with-name.component";

export interface FileUploadProps {
  onChange: (file: File) => void;
  onDelete(): void;
  label: string;
  fileName?: string;
  isProcessing: boolean;
  isValid: boolean;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload(props: FileUploadProps) {
  const fileRef = createRef<HTMLInputElement>();

  function onDelete() {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    props.onDelete();
  }
  return (
    <Box
      sx={{
        width: "180px",
      }}
    >
      <Grid container direction="column" alignItems="center">
        <Grid
          item
          sx={{
            width: "100%",
            border: "1px solid lightgray",
            borderRadius: "5%",
            marginBottom: "4px",
            padding: "8px",
            position: "relative",
          }}
        >
          {props.fileName ? (
            <DeleteForeverIcon
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
                color: "red",
              }}
              onClick={onDelete}
            />
          ) : null}
          <FileIconWithName
            fileName={props.fileName}
            isProcessing={props.isProcessing}
            isValid={props.isValid}
          />
        </Grid>
        <Grid item>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            disabled={!!props.fileName}
            sx={{
              fontSize: "0.7rem",
              width: "180px",
            }}
          >
            {props.label}
            <VisuallyHiddenInput
              type="file"
              ref={fileRef}
              onChange={(event) => {
                const file = event.target.files?.item(0);
                if (file) {
                  props.onChange(file);
                }
              }}
            />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
