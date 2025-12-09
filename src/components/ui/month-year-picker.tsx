import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// MonthYearPicker
// Props:
// - value: a Date object (optional)
// - onChange: function(Date) => void
// - startYear: number (default: currentYear - 10)
// - endYear: number (default: currentYear + 10)
// - placeholder: string

export default function MonthYearPicker({
    value = null,
    onChange = () => { },
    startYear,
    endYear,
    placeholder = "Select month & year",
}) {
    const now = value ? new Date(value) : new Date();
    const currentYear = new Date().getFullYear();
    const sYear = startYear ?? currentYear - 10;
    const eYear = endYear ?? currentYear + 10;

    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setYear(d.getFullYear());
            setMonth(d.getMonth());
        }
    }, [value]);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    function handlePick(m, y) {
        const chosen = new Date(y, m, 1);
        onChange(chosen);
        setOpen(false);
    }

    function decYear() {
        setYear((y) => Math.max(y - 1, sYear));
    }

    function incYear() {
        setYear((y) => Math.min(y + 1, eYear));
    }

    const displayLabel = value
        ? `${months[new Date(value).getMonth()]} ${new Date(value).getFullYear()}`
        : placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-56 justify-between">
                    <span className={cn(!value && "text-muted-foreground")}>{displayLabel}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
                    </svg>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2 bg-natural-100">
                <div className="flex items-center justify-between px-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                        onClick={decYear}
                        aria-label="Previous year"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="rounded-md border px-2 py-1 text-sm"
                        >
                            {Array.from({ length: eYear - sYear + 1 }, (_, i) => sYear + i).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                        onClick={incYear}
                        aria-label="Next year"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 px-1">
                    {months.map((m, idx) => {
                        const isSelected = idx === month && year === (value ? new Date(value).getFullYear() : year);
                        return (
                            <button
                                key={m}
                                type="button"
                                onClick={() => handlePick(idx, year)}
                                className={cn(
                                    "rounded-md px-2 py-1 text-sm text-left hover:bg-muted/60",
                                    isSelected ? "bg-primary text-primary-foreground font-medium" : ""
                                )}
                                aria-pressed={isSelected}
                            >
                                {m.slice(0, 3)}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-3 flex justify-end">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setYear(currentYear);
                            setMonth(new Date().getMonth());
                        }}
                    >
                        Today
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

