import React from "react";
import { cn } from "../../lib/utils";

export function Container({ className, ...props }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        "max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1400px]",
        className
      )}
      {...props}
    />
  );
}
