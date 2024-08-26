import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadProps {
  onChange: (file: File) => void;
  label: string;
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
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {props.label}
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => {
          const file = event.target.files?.item(0);
          if (file) {
            props.onChange(file);
          }
        }}
      />
    </Button>
  );
}
