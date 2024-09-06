import { useImmer } from "use-immer";
import { useClientLogger } from "../../features/client-logger/client-logger";
import InputFileUpload from "../../components/file-upload/file-upload.component";

export interface FileUploadComponentProps {
  label: string;
  onLoadFile: (csv: string) => boolean;
  onDeleteFile?: () => void;
}

interface State {
  blob: File | undefined;
  isProcessing: boolean;
  isValid: boolean;
}

const initialState: State = {
  blob: undefined,
  isProcessing: false,
  isValid: false,
};

export function FileUploadComponent(props: FileUploadComponentProps) {
  const logger = useClientLogger();
  const [state, setState] = useImmer<State>(initialState);

  function onUpload(file: File | undefined) {
    logger.info(`File Upload: Uploading ${props.label}`);
    setState((draft) => {
      draft.blob = file;
      draft.isProcessing = true;
    });
    processFile(props.onLoadFile, file);
  }

  function processFile(
    onLoad: (csv: string) => boolean,
    file: File | undefined
  ) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        const isValid = onLoad(csv);
        setState((draft) => {
          draft.isValid = isValid;
          draft.isProcessing = false;
        });
      };
      reader.onerror = (error) => {
        throw error;
      };
      reader.readAsText(file);
    }
  }

  function onDelete() {
    logger.info(`File Upload: Deleting ${props.label}`);
    setState(() => ({ ...initialState }));
    if (props.onDeleteFile) {
      props.onDeleteFile();
    }
  }

  return (
    <InputFileUpload
      label={props.label}
      onChange={onUpload}
      fileName={state.blob?.name}
      isProcessing={state.isProcessing}
      isValid={state.isValid}
      onDelete={onDelete}
    />
  );
}
