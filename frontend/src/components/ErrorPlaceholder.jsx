

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

const ErrorPlaceholder = ({
  icon: Icon = AlertTriangle,
  message,
  subMessage,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 rounded-md border border-dashed",
        className
      )}
    >
      <Icon className="h-10 w-10 text-destructive mb-3" />
      <TypographyH2 className="mb-1">{message}</TypographyH2>
      {subMessage && (
        <TypographyMuted className="mb-4">{subMessage}</TypographyMuted>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorPlaceholder;
