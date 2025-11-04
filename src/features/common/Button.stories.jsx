import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    onClick: { action: "clicked" },
  },
};

export const Primary = {
  args: {
    children: "Button",
    variant: "primary",
    disabled: false,
  },
};

export const Secondary = {
  args: {
    children: "Button",
    variant: "secondary",
    disabled: false,
  },
};

export const Outline = {
  args: {
    children: "Button",
    variant: "outline",
    disabled: false,
  },
};

export const Disabled = {
  args: {
    children: "Button",
    variant: "primary",
    disabled: true,
  },
};

export const PrimaryWithCustomText = {
  args: {
    children: "Click Me",
    variant: "primary",
    disabled: false,
  },
};
