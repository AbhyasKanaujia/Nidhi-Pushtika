import clsx from "clsx";

export function TypographyH4({ children, className, ...props }) {
  return (
    <h4
      className={clsx(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}
