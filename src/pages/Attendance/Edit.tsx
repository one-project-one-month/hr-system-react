import AttendanceForm from "@/components/forms/attendance-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceService } from "@/services/attendanceService";

export function UpdateAttendance() {
  const { code } = useParams();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    const load = async () => {
      try {
        const data = await attendanceService.editAttendanceRecord(code as string);
        const record = Array.isArray(data) ? data[0] : data;
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

  const handleUpdate = async (values: any) => {
    const payload = {
      attendanceCode: code,
      employeeCode: values.employeeCode,
      employeeName: values.employeeName,
      checkInLocation: values.checkinLocation,
      checkOutLocation: values.checkoutLocation,
      checkInTime: values.checkinTime ? values.checkinTime.toISOString() : null,
      checkOutTime: values.checkinTime ? values.checkinTime.toISOString() : null,
      attendanceDate: toDatePart(values.date),
      workingHour: values.workingHour,
      status: values.status,
      remark: values.remark,
    };

    await attendanceService.updateAttendanceRecord(payload);
    // try {
    //   await attendanceService.fetchAttendanceRecords();
    // } catch (err) {
    //   console.warn("Failed to refresh attendance list cache after update", err);
    // }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <AttendanceForm mode="edit" initialValues={initialValues} onSubmitExternal={handleUpdate} />
  );
}
