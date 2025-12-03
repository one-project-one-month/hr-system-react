import {
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../alert-dialog";
import { Check } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function SuccessDialog({
  open = true,
  onOpenChange,
  onConfirm,
  title = "Success!",
  description = "New Data has been added successfully.",
}: SuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-xs flex flex-col gap-6 border-none bg-primary-50">
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 absolute -top-20 rounded-full p-5 bg-primary-100">
            <div className="mx-auto w-18 h-18 bg-primary-500 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>
        <AlertDialogHeader className="items-center mt-2">
          <AlertDialogTitle className="text-xl text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center rounded-md">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary-500 hover:bg-emerald-600 text-white px-10 py-1 rounded-md"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
