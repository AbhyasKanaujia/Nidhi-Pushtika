import React from "react";
import { Loader2 } from "lucide-react";
import { TypographyMuted } from "./typography";
import clsx from "clsx";

export function Loader({message, className, ...props }) {
  return (
    <div className={clsx("flex justify-center items-center", className)} {...props}>
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      <TypographyMuted>{message || "Loading..."}</TypographyMuted>
    </div>
  );
}
