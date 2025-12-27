"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Calendar1Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";
import { cn } from "@/lib/utils";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface ExportDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onConfirm: (range: DateRange) => void;
  loading?: boolean;
  error: string;
}

export function ExportDateDialog({
  open,
  onOpenChange,
  title = "Export",
  onConfirm,
  loading = false,
  error
}: ExportDateDialogProps) {
  const [date, setDate] = useState<DateRange>({});

  const handleConfirm = () => {
    if (!date.from || !date.to) return;
    onConfirm(date);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>Pick a date range to export</AlertDialogDescription>
        {/* Date Picker */}
        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "justify-between text-left font-normal w-[260px]",
                  !date.from && "text-muted-foreground"
                )}
              >
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} –{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
                <Calendar1Icon className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 bg-natural-50" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={(range) =>
                  setDate({ from: range?.from, to: range?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
            {error && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>No Data to export within this date range!</span>
            </div>
          )}
          </Popover>
        </div>

        {/* Actions */}
        <AlertDialogFooter>
          <Button  onClick={() => onOpenChange(false)} className="cancel-btn">
            Cancel
          </Button>

          <Button
            className="primary-btn"
            onClick={handleConfirm}
            disabled={!date.from || !date.to || loading}
          >
            {loading ? "Exporting..." : "Download"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}