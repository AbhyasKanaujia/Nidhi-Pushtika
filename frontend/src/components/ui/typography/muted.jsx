import clsx from "clsx";

export function TypographyMuted({ children, className, ...props }) {
  return (
    <p
      className={clsx(
        "text-muted-foreground text-sm",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
