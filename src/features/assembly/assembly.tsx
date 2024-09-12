import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { BillOfMaterialsParser } from "../../app/parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "../../app/parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "../../app/parsers/feeder-setup/feeder-setup.parser";
import { BillOfMaterials } from "../../app/models/bill-of-materials.model";
import { AssemblyFile } from "../../app/models/assembly-file.model";
import { FeederSetup } from "../../app/models/feeder-setup.model";
import { useImmer } from "use-immer";
import { useClientLogger } from "../../features/client-logger/client-logger";
import { Logs } from "../../components/client-logs/client-logs.component";
import { FileUploadComponent } from "../../controllers/file-upload/file-upload.component";
import { ProductionFileGenerator } from "../../features/assembly-machine-production-file-generator/production-file-generator/production-file-generator.component";
import { Layout } from "../../components/layout/layout.component";
import { useMemo } from "react";
import { ProductionFile } from "../../app/models/production-file.model";
import { ProductionFileParser } from "../../app/parsers/production-file/production-file.parser";
import { FileDownload } from "../../components/file-download/file-download.component";
import {
  FileUploadProvider,
  useFileUploadContext,
} from "../../controllers/file-upload/file-upload.context";

interface State {
  billOfMaterials?: BillOfMaterials;
  assemblyFile?: AssemblyFile;
  feederSetupFile?: FeederSetup;
  productionOperationsCsv?: string;
  manualOperationsCsv?: string;
  productionOperations?: Blob;
  manualOperations?: Blob;
}

const initialState: State = {};

export function Assembly() {
  const [state, setState] = useImmer(initialState);
  const logger = useClientLogger();
  const { clearAll } = useFileUploadContext();

  function onLoadBillOfMaterials(csv: string) {
    logger.info("File Upload: Parsing Bill of Materials");
    const billOfMaterialsDtos = BillOfMaterialsParser.Parse(csv);
    const billOfMaterials = new BillOfMaterials(billOfMaterialsDtos);
    setState((state) => {
      state.billOfMaterials = billOfMaterials;
    });
    logger.info("File Upload: Bill of Materials Parsed Successfully");
    return billOfMaterials.isValid();
  }

  function onLoadAssembly(csv: string) {
    logger.info("File Upload: Parsing Assembly File");
    const assemblyDtos = AssemblyFileParser.Parse(csv);
    const assemblyFile = new AssemblyFile(assemblyDtos);
    setState((state) => {
      state.assemblyFile = assemblyFile;
    });
    logger.info("File Upload: Assembly File Parsed Successfully");
    return assemblyFile.isValid();
  }

  function onLoadFeederSetup(csv: string) {
    logger.info("File Upload: Parsing Feeder Setup");
    const feederSetupDtos = FeederSetupParser.Parse(csv);
    const feederSetupFile = new FeederSetup(feederSetupDtos);
    setState((state) => {
      state.feederSetupFile = feederSetupFile;
    });
    logger.info("File Upload: Feeder Setup Parsed Successfully");
    return feederSetupFile.isValid();
  }

  function onDeleteBillOfMaterials() {
    setState((state) => {
      state.billOfMaterials = undefined;
    });
  }

  function onDeleteAssembly() {
    setState((state) => {
      state.assemblyFile = undefined;
    });
  }

  function onDeleteFeederSetup() {
    setState((state) => {
      state.feederSetupFile = undefined;
    });
  }

  function onResetAll() {
    setState(() => ({ ...initialState }));
    clearAll();
    logger.clearAll();
  }

  const canGenerate = useMemo(() => {
    return state.billOfMaterials?.isValid() &&
      state.assemblyFile?.isValid() &&
      state.feederSetupFile?.isValid()
      ? true
      : false;
  }, [state.billOfMaterials, state.assemblyFile, state.feederSetupFile]);

  function convertToBlob(csv: string) {
    return new Blob([csv], { type: "text/csv" });
  }

  function onGenerate() {
    logger.info("Production File: Starting Production File Generation Process");
    if (!canGenerate) {
      logger.error(
        "Production File: Cannot generate production file without all required files"
      );
      return;
    }

    const { billOfMaterials, assemblyFile, feederSetupFile } = state;

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
    const productionFileCsv = ProductionFileParser.Serialize(
      productionFile.getOperations()
    );
    const manualOperationsCsv = ProductionFileParser.Serialize(
      productionFile.getManualOperations()
    );

    setState((state) => {
      state.productionOperationsCsv = productionFileCsv;
      state.productionOperations = convertToBlob(productionFileCsv);
      state.manualOperationsCsv = manualOperationsCsv;
      state.manualOperations = convertToBlob(manualOperationsCsv);
    });
  }

  return (
    <Layout
      canGenerateProductionFile={canGenerate}
      generateProductionFile={onGenerate}
      resetAll={onResetAll}
    >
      <Grid
        container
        direction="row"
        sx={{
          height: "100%",
        }}
      >
        <Grid item container direction="column" spacing={2} xs={3}>
          <Grid item>
            <FileUploadComponent
              label="Bill of Materials"
              onLoadFile={onLoadBillOfMaterials}
              onDeleteFile={onDeleteBillOfMaterials}
            />
          </Grid>
          <Grid item>
            <FileUploadComponent
              label="Assembly File"
              onLoadFile={onLoadAssembly}
              onDeleteFile={onDeleteAssembly}
            />
          </Grid>
          <Grid item>
            <FileUploadComponent
              label="Feeder Setup"
              onLoadFile={onLoadFeederSetup}
              onDeleteFile={onDeleteFeederSetup}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            height: "420px",
          }}
        >
          <Logs logs={logger.logs} />
        </Grid>
      </Grid>
      <Box paddingTop={6}>
        <Grid container direction="column" spacing={2}>
          {state.productionOperations ? (
            <Grid item>
              <FileDownload
                blob={state.productionOperations}
                fileName="production-operations"
              />
            </Grid>
          ) : null}
          {state.manualOperations ? (
            <Grid item>
              <FileDownload
                blob={state.manualOperations}
                fileName="manual-operations"
              />
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </Layout>
  );
}
