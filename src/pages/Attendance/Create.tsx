import AttendanceForm from "@/components/forms/attendance-form";
import { attendanceService } from "@/services/attendanceService";
export function CreateAttendance() {
  const handleCreate = async (values: any) => {
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

    const localISO = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    const payload = {
      employeeCode: values.employeeCode,
      employeeName: values.employeeName,
      checkinLocation: values.checkinLocation,
      checkoutLocation: values.checkoutLocation,
      checkinTime: values.checkinTime ? localISO(values.checkinTime) : null,
      checkoutTime: values.checkoutTime ? localISO(values.checkoutTime) : null,
      // send date as yyyy-mm-dd
      date: toDatePart(values.date),
      workingHour: values.workingHour,
      status: values.status,
      remark: values.remark,
    };
    const payloadWithListKeys = {
      ...payload,
      name: values.employeeName,
      attendanceDate: toDatePart(values.date),
      checkInTime: values.checkinTime ? localISO(values.checkinTime) : null,
      checkoutTime: values.checkoutTime ? localISO(values.checkoutTime) : null,
      workingHour: values.workingHour,
    };
    console.log(payloadWithListKeys)
    await attendanceService.createAttendanceRecord(payloadWithListKeys);
    try {
      await attendanceService.fetchAttendanceRecords();
    } catch (err) {
      console.log("Failed to refresh attendance list cache", err);
    }
  };

  return <AttendanceForm mode="create" onSubmitExternal={handleCreate} />;
}
