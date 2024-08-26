import { useMemo, useState } from "react";
import InputFileUpload from "./file-upload";
import { Button } from "@mui/material";
import { BillOfMaterialsParser } from "./parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "./parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "./parsers/feeder-setup/feeder-setup.parser";
import { ProductionFile } from "./models/production-file.model";
import { BillOfMaterials } from "./models/bill-of-materials.model";
import { AssemblyFile } from "./models/assembly-file.model";
import { FeederSetup } from "./models/feeder-setup.model";
import { ProductionFileParser } from "./parsers/production-file/production-file.parser";

interface State {
  billOfMaterialsFile?: File;
  assemblyFile?: File;
  feederSetupFile?: File;

  billOfMaterialsCsv?: string;
  assemblyCsv?: string;
  feederSetupCsv?: string;
}

export function Assembly() {
  const [state, setState] = useState<State>({});

  function onUploadBillOfMaterials(file: File | undefined) {
    setState({ ...state, billOfMaterialsFile: file });
    processFile((csv) => setState({ ...state, billOfMaterialsCsv: csv }), file);
  }

  function onUploadAssembly(file: File | undefined) {
    setState({ ...state, assemblyFile: file });
    processFile((csv) => setState({ ...state, assemblyCsv: csv }), file);
  }

  function onUploadFeederSetup(file: File | undefined) {
    setState({ ...state, feederSetupFile: file });
    processFile((csv) => setState({ ...state, feederSetupCsv: csv }), file);
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
    return state.billOfMaterialsCsv && state.assemblyCsv && state.feederSetupCsv
      ? true
      : false;
  }, [state.billOfMaterialsCsv, state.assemblyCsv, state.feederSetupCsv]);

  function onGenerate() {
    if (!canGenerate) {
      return;
    }
    if (
      !state.billOfMaterialsCsv ||
      !state.assemblyCsv ||
      !state.feederSetupCsv
    ) {
      return;
    }
    const billOfMaterialsDtos = BillOfMaterialsParser.Parse(
      state.billOfMaterialsCsv
    );
    const assemblyDtos = AssemblyFileParser.Parse(state.assemblyCsv);
    const feederSetupDtos = FeederSetupParser.Parse(state.feederSetupCsv);

    const billOfMaterials = new BillOfMaterials(billOfMaterialsDtos);
    const assemblyFile = new AssemblyFile(assemblyDtos);
    const feederSetupFile = new FeederSetup(feederSetupDtos);

    const productionFile = new ProductionFile();
    productionFile.generateOperations(
      billOfMaterials,
      assemblyFile,
      feederSetupFile
    );

    const csv = ProductionFileParser.Serialize(productionFile);

    // Download the file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "production-file.csv";
    link.click();
  }

  console.log({
    billOfMaterialsCsv: state.billOfMaterialsCsv,
    assemblyCsv: state.assemblyCsv,
    feederSetupCsv: state.feederSetupCsv,
    canGenerate,
  });

  return (
    <>
      <h1>Assembly</h1>
      <InputFileUpload
        label="Bill of Materials"
        onChange={onUploadBillOfMaterials}
      />
      <InputFileUpload label="Assembly File" onChange={onUploadAssembly} />
      <InputFileUpload label="Feeder Setup" onChange={onUploadFeederSetup} />
      <Button disabled={!canGenerate} onClick={onGenerate}>
        Generate
      </Button>
    </>
  );
}
