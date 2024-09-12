import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { FileUploadProvider } from "./controllers/file-upload/file-upload.context";
import { Assembly } from "./features/assembly/assembly";

export function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <FileUploadProvider>
        <Assembly />
      </FileUploadProvider>
    </ThemeProvider>
  );
}
