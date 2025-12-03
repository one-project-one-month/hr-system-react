import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { SuccessDialog } from "@/components/ui/custom/SuccessDialog";

export default function PayrollCreate() {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 9, 6, 8, 30));
  const [isTaxOpen, setIsTaxOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [taxSearch, setTaxSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [isEmployeeCodeOpen, setIsEmployeeCodeOpen] = useState(false);
  const [employeeCodeSearch, setEmployeeCodeSearch] = useState("");
  const employeeCodeOptions = ["EMP00123", "EMP00124", "EMP00125"];
  const statusOptions = ["Pending", "Complete"];
  const taxOptions = ["10%", "15%", "20%"];
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: "EMP00123",
    employeeName: "Alice",
    payrollDate: "2025-10-06 08:30",
    status: "Pending",
    totalWorkingHour: "",
    actualWorkingHour: "5.0",
    leaveHour: "3",
    basicSalary: "200,000",
    allowance: "",
    bonus: "",
    grossPay: "400,000",
    deduction: "20,000",
    tax: "10%",
    netPay: "380,000",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Calculate net pay when relevant fields change
      if (['basicSalary', 'allowance', 'bonus', 'grossPay', 'deduction', 'tax'].includes(field)) {
        newData.netPay = calculateNetPay(newData);
      }

      return newData;
    });
  };

  const calculateNetPay = (data: typeof formData) => {
    const basicSalary = parseFloat(data.basicSalary.replace(/,/g, '')) || 0;
    const allowance = parseFloat(data.allowance.replace(/,/g, '')) || 0;
    const bonus = parseFloat(data.bonus.replace(/,/g, '')) || 0;
    const deduction = parseFloat(data.deduction.replace(/,/g, '')) || 0;
    const taxRate = parseFloat(data.tax.replace('%', '')) || 0;

    const totalGross = basicSalary + allowance + bonus;
    const taxAmount = (totalGross * taxRate) / 100;
    const netPay = totalGross - taxAmount - deduction;

    return netPay.toLocaleString();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = format(date, "yyyy-MM-dd HH:mm");
      setFormData(prev => ({
        ...prev,
        payrollDate: formattedDate
      }));
      setIsCalendarOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/payroll");
  };

  const filteredTaxOptions = taxOptions.filter((opt) =>
    opt.toLowerCase().includes(taxSearch.toLowerCase())
  );

  const filteredStatusOptions = statusOptions.filter((opt) =>
    opt.toLowerCase().includes(statusSearch.toLowerCase())
  );

  const filteredEmployeeCodeOptions = employeeCodeOptions.filter((opt) =>
    opt.toLowerCase().includes(employeeCodeSearch.toLowerCase())
  );

  const handleSelectTax = (value: string) => {
    handleInputChange("tax", value);
    setIsTaxOpen(false);
    setTaxSearch("");
  };

  const handleSelectStatus = (value: string) => {
    handleInputChange("status", value);
    setIsStatusOpen(false);
    setStatusSearch("");
  }

  const handleSelectEmployeeCode = (value: string) => {
    handleInputChange("employeeCode", value);
    setIsEmployeeCodeOpen(false);
    setEmployeeCodeSearch("");
  }

  const validateForm = () => {
    const requiredFields = ['employeeCode', 'employeeName', 'payrollDate', 'basicSalary'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    // Handle create logic here
    console.log("Creating payroll:", formData);
    // You can add API call here

    // Show success dialog instead of alert
    setShowSuccessDialog(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigate("/payroll");
  };

  return (
    <div className="p-6 md:p-8 w-full flex-1 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Payroll</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Employee Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Code
            </label>
            <Popover open={isEmployeeCodeOpen} onOpenChange={setIsEmployeeCodeOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    // value={formData.tax}
                    readOnly
                    className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                    placeholder="Select code"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white" align="start">
                <div className="space-y-2">
                  <Input
                    placeholder="search"
                    value={employeeCodeSearch}
                    onChange={(e) => setEmployeeCodeSearch(e.target.value)}
                    className="h-8"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredEmployeeCodeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectEmployeeCode(opt)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                    {filteredEmployeeCodeOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Payroll Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payroll Date
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    // value={formData.payrollDate}
                    onChange={(e) => handleInputChange("payrollDate", e.target.value)}
                    className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                    placeholder="Pick a date"
                    readOnly
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Total Working Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Working Hour
            </label>
            <Input
              // value={formData.totalWorkingHour}
              onChange={(e) => handleInputChange("totalWorkingHour", e.target.value)}
              placeholder="e.g. 8.0"
              className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
            />
          </div>

          {/* Actual Working Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Working Hour
            </label>
            <Input
              value={formData.actualWorkingHour}
              onChange={(e) => handleInputChange("actualWorkingHour", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="5.0"
            />
          </div>

          {/* Allowance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowance
            </label>
            <Input
              // value={formData.allowance}
              onChange={(e) => handleInputChange("allowance", e.target.value)}
              placeholder="Enter amount"
              className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
            />
          </div>

          {/* Gross Pay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gross Pay
            </label>
            <Input
              // value={formData.grossPay}
              onChange={(e) => handleInputChange("grossPay", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="400,000"
            />
          </div>

          {/* Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax
            </label>
            <Popover open={isTaxOpen} onOpenChange={setIsTaxOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    // value={formData.tax}
                    readOnly
                    className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                    placeholder="Enter Tax"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white" align="start">
                <div className="space-y-2">
                  <Input
                    // placeholder="Search tax"
                    value={taxSearch}
                    onChange={(e) => setTaxSearch(e.target.value)}
                    className="h-8"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredTaxOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectTax(opt)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                    {filteredTaxOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name
            </label>
            <Input
              // value={formData.employeeName}
              onChange={(e) => handleInputChange("employeeName", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="Aung Min"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Popover open={isStatusOpen} onOpenChange={setIsStatusOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    // value={formData.tax}
                    readOnly
                    className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
                    placeholder="Select status"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white" align="start">
                <div className="space-y-2">
                  <Input
                    placeholder="Select status"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    className="h-8"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredStatusOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectStatus(opt)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                    {filteredTaxOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Leave Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Hour
            </label>
            <Input
              // value={formData.leaveHour}
              onChange={(e) => handleInputChange("leaveHour", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="3"
            />
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Salary
            </label>
            <Input
              // value={formData.basicSalary}
              onChange={(e) => handleInputChange("basicSalary", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="200,000"
            />
          </div>

          {/* Bonus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bonus
            </label>
            <Input
              // value={formData.bonus}
              onChange={(e) => handleInputChange("bonus", e.target.value)}
              placeholder="Enter amount"
              className="pr-8 cursor-pointer bg-natural-50 border-natural-500 h-10 text-natural-800"
            />
          </div>

          {/* Deduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deduction
            </label>
            <Input
              // value={formData.deduction}
              onChange={(e) => handleInputChange("deduction", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="30,000"
            />
          </div>

          {/* Net Pay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Net Pay
            </label>
            <Input
              // value={formData.netPay}
              onChange={(e) => handleInputChange("netPay", e.target.value)}
              className="bg-natural-400 border-natural-500 text-gray-700 h-10"
              placeholder="380,000"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-12">
        <Button
          variant="outline"
          onClick={handleBack}
          className="px-8 py-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 h-10"
        >
          CANCEL
        </Button>
        <Button
          variant="default"
          onClick={handleCreate}
          className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
        >
          CREATE
        </Button>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
        title="Success!"
        description="New Payroll has been added successfully."
      />
    </div>
  );
}
