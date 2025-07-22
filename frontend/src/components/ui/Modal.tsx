import React, { forwardRef } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import type { DialogProps } from "@mui/material";

export interface CustomModalProps extends DialogProps {
  modalTitle?: ReactNode;
  children: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, CustomModalProps>(
  ({ modalTitle, children, ...props }, ref) => (
    <Dialog ref={ref} {...props}>
      {modalTitle && <DialogTitle>{modalTitle}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
);

Modal.displayName = "Modal";
export default Modal;
