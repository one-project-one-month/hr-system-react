"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon, FileDown } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type ExportFormat = "pdf" | "xlsx" | "csv";

export interface ExportPayload {
  range: DateRange;
  format: ExportFormat;
}

interface ExportDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onConfirm: (payload: ExportPayload) => void;
  loading?: boolean;
  error: string;
}

export function ExportDateDialog({
  open,
  onOpenChange,
  title = "Export",
  onConfirm,
  loading = false,
  error,
}: ExportDateDialogProps) {
  const [date, setDate] = useState<DateRange>({});
  const [formatType, setFormatType] = useState<ExportFormat>("xlsx");

  const handleConfirm = () => {
    if (!date.from || !date.to) return;

    onConfirm({
      range: date,
      format: formatType,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Choose date range and export format
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "justify-between text-left font-normal w-[260px] border",
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
                <CalendarIcon className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={(range) =>
                  setDate({ from: range?.from, to: range?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Export Format */}
          <Select
            value={formatType}
            onValueChange={(v) => setFormatType(v as ExportFormat)}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent className="bg-natural-50">
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Excel (.xlsx)
                </div>
              </SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
            </SelectContent>
          </Select>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>No data to export within this date range</span>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!date.from || !date.to || loading}
            className="primary-btn"
          >
            {loading ? "Exporting..." : "Download"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
