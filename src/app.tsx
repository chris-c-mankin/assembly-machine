import { useMemo, useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { BillOfMaterialsParser } from "./app/parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "./app/parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "./app/parsers/feeder-setup/feeder-setup.parser";
import { ProductionFile } from "./app/models/production-file.model";
import { BillOfMaterials } from "./app/models/bill-of-materials.model";
import { AssemblyFile } from "./app/models/assembly-file.model";
import { FeederSetup } from "./app/models/feeder-setup.model";
import { ProductionFileParser } from "./app/parsers/production-file/production-file.parser";
import InputFileUpload from "./components/file-upload.component";
import { useImmer } from "use-immer";
import { useClientLogger } from "./features/client-logger/client-logger";
import { ClientLogs } from "./components/client-logs.component";

interface FileUploadState<T> {
  blob?: File;
  csv?: string;
  model?: T;
  isProcessing: boolean;
}

interface State {
  billOfMaterials: FileUploadState<BillOfMaterials>;
  assemblyFile: FileUploadState<AssemblyFile>;
  feederSetupFile: FileUploadState<FeederSetup>;
}

const initialState: State = {
  billOfMaterials: {
    isProcessing: false,
  },
  assemblyFile: {
    isProcessing: false,
  },
  feederSetupFile: {
    isProcessing: false,
  },
};

export function Assembly() {
  const [state, setState] = useImmer(initialState);
  const logger = useClientLogger();

  function onUploadBillOfMaterials(file: File | undefined) {
    logger.info("File Upload: Uploading Bill of Materials");
    setState((draft) => {
      draft.billOfMaterials.blob = file;
      draft.billOfMaterials.isProcessing = true;
    });
    processFile((csv) => {
      logger.info("File Upload: Parsing Bill of Materials");
      const billOfMaterialsDtos = BillOfMaterialsParser.Parse(csv);
      const billOfMaterials = new BillOfMaterials(billOfMaterialsDtos);
      setState((state) => {
        state.billOfMaterials.csv = csv;
        state.billOfMaterials.model = billOfMaterials;
        state.billOfMaterials.isProcessing = false;
      });
      logger.info("File Upload: Bill of Materials Parsed Successfully");
    }, file);
  }

  function onUploadAssembly(file: File | undefined) {
    logger.info("File Upload: Uploading Assembly File");
    setState((state) => {
      state.assemblyFile.blob = file;
      state.assemblyFile.isProcessing = true;
    });
    processFile((csv) => {
      logger.info("File Upload: Parsing Assembly File");
      const assemblyDtos = AssemblyFileParser.Parse(csv);
      const assemblyFile = new AssemblyFile(assemblyDtos);
      setState((state) => {
        state.assemblyFile.csv = csv;
        state.assemblyFile.model = assemblyFile;
        state.assemblyFile.isProcessing = false;
      });
      logger.info("File Upload: Assembly File Parsed Successfully");
    }, file);
  }

  function onUploadFeederSetup(file: File | undefined) {
    logger.info("File Upload: Uploading Feeder Setup");
    setState((state) => {
      state.feederSetupFile.blob = file;
      state.feederSetupFile.isProcessing = true;
    });
    processFile((csv) => {
      logger.info("File Upload: Parsing Feeder Setup");
      const feederSetupDtos = FeederSetupParser.Parse(csv);
      const feederSetupFile = new FeederSetup(feederSetupDtos);
      setState((state) => {
        state.feederSetupFile.csv = csv;
        state.feederSetupFile.model = feederSetupFile;
        state.feederSetupFile.isProcessing = false;
      });
      logger.info("File Upload: Feeder Setup Parsed Successfully");
    }, file);
  }

  function onDeleteBillOfMaterials() {
    logger.info("File Upload: Deleting Bill of Materials");
    setState((state) => {
      state.billOfMaterials = {
        ...initialState.billOfMaterials,
      };
    });
  }

  function onDeleteAssembly() {
    logger.info("File Upload: Deleting Assembly File");
    setState((state) => {
      state.assemblyFile = {
        ...initialState.assemblyFile,
      };
    });
  }

  function onDeleteFeederSetup() {
    logger.info("File Upload: Deleting Feeder Setup");
    setState((state) => {
      state.feederSetupFile = {
        ...initialState.feederSetupFile,
      };
    });
  }

  function processFile(onLoad: (csv: string) => void, file: File | undefined) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        onLoad(csv);
      };
      reader.onerror = (error) => {
        throw error;
      };
      reader.readAsText(file);
    }
  }

  const canGenerate = useMemo(() => {
    return state.billOfMaterials.model &&
      state.assemblyFile.model &&
      state.feederSetupFile.model
      ? true
      : false;
  }, [
    state.billOfMaterials.model,
    state.assemblyFile.model,
    state.feederSetupFile.model,
  ]);

  function onGenerate() {
    logger.info("Production File: Starting Production File Generation Process");
    if (!canGenerate) {
      logger.error(
        "Production File: Cannot generate production file without all required files"
      );
      return;
    }

    const billOfMaterials = state.billOfMaterials.model;
    const assemblyFile = state.assemblyFile.model;
    const feederSetupFile = state.feederSetupFile.model;

    if (!billOfMaterials || !assemblyFile || !feederSetupFile) {
      return;
    }

    logger.info(
      "Production File: Merging Bill of Materials, Assembly File, and Feeder Setup"
    );
    const productionFile = new ProductionFile();
    productionFile.generateOperations(
      billOfMaterials,
      assemblyFile,
      feederSetupFile
    );

    logger.info("Production File: Serializing Production File");
    const csv = ProductionFileParser.Serialize(productionFile);

    // Download the file
    logger.info("Production File: Downloading Production File");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "production-file.csv";
    link.click();
  }

  return (
    <Container
      sx={{
        textAlign: "center",
        height: "100%",
      }}
    >
      <Typography variant="h4">Assembly Machine</Typography>
      <Typography variant="h6">Production File Generator</Typography>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        sx={{
          height: "100%",
        }}
      >
        <Box
          sx={{
            fontSize: "0.7rem",
            marginBottom: "8px",
          }}
        >
          <Grid
            item
            container
            direction="row"
            spacing={4}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <Grid item>
              <InputFileUpload
                label="Bill of Materials"
                onChange={onUploadBillOfMaterials}
                fileName={state.billOfMaterials.blob?.name}
                isProcessing={state.billOfMaterials.isProcessing}
                isValid={state.billOfMaterials.model?.isValid() ?? false}
                onDelete={onDeleteBillOfMaterials}
              />
            </Grid>
            <Grid item>
              <InputFileUpload
                label="Assembly File"
                onChange={onUploadAssembly}
                fileName={state.assemblyFile.blob?.name}
                isProcessing={state.assemblyFile.isProcessing}
                isValid={state.assemblyFile.model?.isValid() ?? false}
                onDelete={onDeleteAssembly}
              />
            </Grid>
            <Grid item>
              <InputFileUpload
                label="Feeder Setup"
                onChange={onUploadFeederSetup}
                fileName={state.feederSetupFile.blob?.name}
                isProcessing={state.feederSetupFile.isProcessing}
                isValid={state.feederSetupFile.model?.isValid() ?? false}
                onDelete={onDeleteFeederSetup}
              />
            </Grid>
          </Grid>
        </Box>
        <ClientLogs />
        <Grid item>
          <Button
            disabled={!canGenerate}
            onClick={onGenerate}
            variant="contained"
          >
            Generate
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
