import type { Meta, StoryObj } from "@storybook/react";
import { FileDownload } from "./file-download.component";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "FileDownload",
  component: FileDownload,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof FileDownload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    fileName: "assemble-file.csv",
    blob: new Blob(["test"], { type: "text/csv" }),
  },
};