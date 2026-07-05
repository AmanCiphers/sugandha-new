"use client";

import { useState, useEffect, useCallback } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({ children, open, onOpenChange }) {
  return typeof children === "function"
    ? children({ open, onOpenChange })
    : children;
}

export function SheetTrigger({ children, className, onClick, ...props }) {
  return (
    <button
      data-slot="sheet-trigger"
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetContent({
  children,
  className,
  open,
  onClose,
  side = "right",
  ...props
}) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs"
        onClick={handleClose}
      />
      <div
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg transition-transform duration-200 ease-in-out",
          "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          className
        )}
        {...props}
      >
        {typeof children === "function" ? children() : children}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}
