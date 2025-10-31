import clsx from "clsx";

export function TypographyLead({ children, className, ...props }) {
  return (
    <p
      className={clsx(
        "text-muted-foreground text-xl",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
