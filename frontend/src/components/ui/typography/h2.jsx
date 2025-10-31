
import clsx from "clsx";

export function TypographyH2({ children, className, ...props }) {
  return (
    <h2
      className={clsx(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
