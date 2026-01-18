"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
}: DateTimePickerProps) {
  const [time, setTime] = React.useState(
    value ? `${value.getHours()}:${value.getMinutes()}` : "09:00"
  );

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    const [h, m] = time.split(":").map(Number);
    date.setHours(h);
    date.setMinutes(m);
    onChange(date);
  };

  const handleTimeChange = (t: string) => {
    setTime(t);
    if (!value) return;
    const [h, m] = t.split(":").map(Number);
    const updated = new Date(value);
    updated.setHours(h);
    updated.setMinutes(m);
    onChange(updated);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? value.toLocaleString() : "Select date & time"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto bg-white dark:bg-neutral-900">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
