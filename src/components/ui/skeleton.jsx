import { classNames as cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={classNames("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
