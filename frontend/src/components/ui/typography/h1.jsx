
import clsx from "clsx";

export function TypographyH1({ children, className, ...props }) {
  return (
    <h1
      className={clsx(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
