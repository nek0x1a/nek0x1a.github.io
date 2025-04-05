import type { ComponentProps } from "react";
import type { basicTypeStyle } from "../types/basictypes";

export type ButtonType = basicTypeStyle | "link";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonState = "outline" | "active";

interface ButtonProps extends ComponentProps<"button"> {
  buttonType?: ButtonType;
  size?: ButtonSize;
  state?: ButtonState;
  block?: boolean;
  href?: string;
}

export default function Button({
  buttonType = "primary",
  size = "md",
  block = false,
  disabled = false,
  state,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    `button--${buttonType}`,
    size == "md" ? "" : `button--${size}`,
    state ? `button--${state}` : "",
    block ? "button--block" : "",
    disabled ? "disabled" : "",
  ];
  return (
    <button className={`button ${classes.join(" ")}`} {...rest}>
      {children}
    </button>
  );
}
