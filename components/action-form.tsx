"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

export default function ActionForm({
  action,
  success,
  error = "Something went wrong. Please try again.",
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  success: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      className={className}
      action={async (formData: FormData) => {
        try {
          await action(formData);
         toast.success(success, { id: success });
        } catch (e) {
          const digest = (e as { digest?: string })?.digest;
          if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
            toast.success(success, { id: success });// redirect = the action succeeded
            throw e;
          }
          toast.error(error, { id: error });
        }
      }}
    >
      {children}
    </form>
  );
}