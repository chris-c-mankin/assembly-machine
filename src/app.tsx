import { Box, Container, Grid, Typography } from "@mui/material";
import { BillOfMaterialsParser } from "./app/parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "./app/parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "./app/parsers/feeder-setup/feeder-setup.parser";
import { BillOfMaterials } from "./app/models/bill-of-materials.model";
import { AssemblyFile } from "./app/models/assembly-file.model";
import { FeederSetup } from "./app/models/feeder-setup.model";
import { useImmer } from "use-immer";
import { useClientLogger } from "./features/client-logger/client-logger";
import { Logs } from "./components/logs/client-logs.component";
import { FileUploadComponent } from "./controllers/file-upload/file-upload.component";
import { ProductionFileGenerator } from "./features/assembly-machine-production-file-generator/production-file-generator/production-file-generator.component";

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

  // function onDownloadFile(csv: string, fileName: string) {
  //   logger.info("Production File: Downloading " + fileName);
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "production-file.csv";
  //   link.click();
  // }

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
        </Box>
        <Logs logs={logger.logs} />
        <Grid item>
          <ProductionFileGenerator
            assemblyFile={state.assemblyFile}
            billOfMaterials={state.billOfMaterials}
            feederSetupFile={state.feederSetupFile}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
