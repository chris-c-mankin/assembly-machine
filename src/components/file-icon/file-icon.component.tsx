import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";

export interface FileIconProps {
  color: "processing" | "valid" | "invalid";
  isPlaceholder: boolean;
}

export function FileIcon(props: FileIconProps) {
  return (
    <>
      {props.isPlaceholder ? (
        <UploadFileIcon
          sx={{
            fontSize: 50,
            color: "lightgray",
          }}
        />
      ) : (
        <DescriptionIcon
          sx={{
            fontSize: 50,
            color: getIconColor(props.color),
          }}
        />
      )}
    </>
  );
}

function getIconColor(color: FileIconProps["color"]) {
  switch (color) {
    case "processing":
      return "lightblue";
    case "valid":
      return "green";
    case "invalid":
      return "red";
  }
}
