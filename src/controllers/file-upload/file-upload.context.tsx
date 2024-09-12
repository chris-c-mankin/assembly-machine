import React, { createContext, useContext, useRef } from "react";

interface FileUploadContextProps {
  register: (ref: React.RefObject<HTMLInputElement>, resetFile: () => void) => void;
  clearAll: () => void;
}

const FileUploadContext = createContext<FileUploadContextProps | undefined>(
  undefined
);

export const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error(
      "useFileUploadContext must be used within a FileUploadProvider"
    );
  }
  return context;
};

export const FileUploadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const fileInputRefs = useRef<
    { ref: React.RefObject<HTMLInputElement>; resetFile: () => void }[]
  >([]);

  const register = (
    ref: React.RefObject<HTMLInputElement>,
    resetFile: () => void
  ) => {
    if (!fileInputRefs.current.some((input) => input.ref === ref)) {
      fileInputRefs.current.push({ ref, resetFile });
    }
  };

  const clearAll = () => {
    fileInputRefs.current.forEach(({ ref, resetFile }) => {
      // if (ref.current) {
      //   ref.current.value = ""; // Clear the input element value
      // }
      resetFile(); // Call the function to reset the file state
    });
  };

  return (
    <FileUploadContext.Provider value={{ register, clearAll }}>
      {children}
    </FileUploadContext.Provider>
  );
};
