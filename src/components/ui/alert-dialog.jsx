"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classNames as cn } from "@/lib/utils";

const AlertDialog = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => { setIsOpen(false); onOpenChange?.(false); }}
      />
      <div
        ref={contentRef}
        className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        {children}
      </div>
    </div>
  );
};

const AlertDialogTrigger = ({ children, onClick }) => {
  return <>{children}</>;
};

const AlertDialogContent = ({ children, className }) => {
  return <div className={classNames("space-y-4", className)}>{children}</div>;
};

const AlertDialogHeader = ({ children, className }) => {
  return <div className={classNames("space-y-2", className)}>{children}</div>;
};

const AlertDialogTitle = ({ children, className }) => {
  return <h2 className={classNames("text-lg font-semibold", className)}>{children}</h2>;
};

const AlertDialogDescription = ({ children, className }) => {
  return <p className={classNames("text-sm text-muted-foreground", className)}>{children}</p>;
};

const AlertDialogCancel = ({ children, onClick, className, ...props }) => {
  return (
    <Button
      variant="outline"
      onClick={(e) => { onClick?.(e); }}
      className={classNames("rounded-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

const AlertDialogAction = ({ children, onClick, className, ...props }) => {
  return (
    <Button
      onClick={(e) => { onClick?.(e); }}
      className={classNames("rounded-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction };