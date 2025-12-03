import AttendanceForm from "@/components/forms/attendance-form";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { attendanceService } from "@/services/attendanceService";

export function DetailsAttendance() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    console.log("Loading attendance record for code:", code);
    if (!code) return;
    const load = async () => {
      try {
        const data = await attendanceService.editAttendanceRecord(code as string);
        const record = Array.isArray(data) ? data[0] : data;
        record.attendance.status = searchParams.get("status")
        setInitialValues(record.attendance);
      } catch (err) {
        console.error("Failed to load attendance record", err);
      }
    };
    load();
  }, [code]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const toDatePart = (date: any) => {
    if (!date) return null;
    const d = typeof date === "string" ? new Date(date) : date;
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  };
  const combineDateTime = (date: any, timeStr?: string) => {
    if (!date || !timeStr) return null;
    const datePart = toDatePart(date);
    return `${datePart}T${timeStr}:00`;
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <AttendanceForm mode="view" initialValues={initialValues} />
  );
}
