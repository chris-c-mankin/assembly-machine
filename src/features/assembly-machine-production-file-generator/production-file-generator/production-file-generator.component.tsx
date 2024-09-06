import { useMemo } from "react";
import { AssemblyFile } from "../../../app/models/assembly-file.model";
import { BillOfMaterials } from "../../../app/models/bill-of-materials.model";
import { FeederSetup } from "../../../app/models/feeder-setup.model";
import { useClientLogger } from "../../client-logger/client-logger";
import { ProductionFile } from "../../../app/models/production-file.model";
import { ProductionFileParser } from "../../../app/parsers/production-file/production-file.parser";
import { useImmer } from "use-immer";
import { Box, Button, Grid } from "@mui/material";
import { FileDownload } from "../../../components/file-download/file-download.component";

export interface ProductionFileGeneratorProps {
  billOfMaterials?: BillOfMaterials;
  assemblyFile?: AssemblyFile;
  feederSetupFile?: FeederSetup;
}

interface State {
  productionOperationsCsv?: string;
  manualOperationsCsv?: string;
  productionOperations?: Blob;
  manualOperations?: Blob;
}

export function ProductionFileGenerator(props: ProductionFileGeneratorProps) {
  const logger = useClientLogger();
  const [state, setState] = useImmer<State>({});

  const canGenerate = useMemo(() => {
    return props.billOfMaterials?.isValid() &&
      props.assemblyFile?.isValid() &&
      props.feederSetupFile?.isValid()
      ? true
      : false;
  }, [props.billOfMaterials, props.assemblyFile, props.feederSetupFile]);

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

    const { billOfMaterials, assemblyFile, feederSetupFile } = props;

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
    <Box>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Button
            disabled={!canGenerate}
            onClick={onGenerate}
            variant="contained"
          >
            Generate
          </Button>
        </Grid>
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
  );
}
