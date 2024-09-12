import { Meta } from "@storybook/react/*";
import { Layout } from "./layout.component";

const meta = {
  title: "Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Layout>;

export default meta;

export const Primary = {
  args: {},
};

export const WithChildren = {
  args: {
    children: "Hello, world! This is a layout component.",
  },
};