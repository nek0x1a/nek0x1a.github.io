import type { ComponentProps, ReactNode } from "react";
import { basicTypeStyle } from "../types/basictypes";

interface BadgeProps extends ComponentProps<"span"> {
  label: string;
  type?: basicTypeStyle;
}

export default function Badge({
  type = "primary",
  label,
  children,
  ...rest
}: BadgeProps) {
  const classes = [`badge--${type}`];
  return (
    <span className={`badge ${classes.join(" ")}`} {...rest}>
      {label}
    </span>
  );
}
