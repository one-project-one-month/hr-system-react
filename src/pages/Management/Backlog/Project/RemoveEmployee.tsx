import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
interface Employee {
  Id: number;
  EmployeeCode: string;
  Username: string;
  Name: string;
  Role: string;
  Email: string;
  PhoneNo: string;
  StartDate: string;
  ResignDate: string;
  Salary?: number;
  Password?: string;
}
const EmployeeData = [
  {
    Id: 1,
    EmployeeCode: "1111",
    Username: "ajohnson",
    Password: "12345678",
    Salary: 1000000,
    Name: "Alice Johnson",
    Role: "Developer",
    Email: "ajohnson@example.com",
    PhoneNo: "09270569999",
    StartDate: "2024-10-30",
    ResignDate: "",
  },
  {
    Id: 2,
    EmployeeCode: "1112",
    Username: "bsmith",
    Name: "Bob Smith",
    Role: "Developer",
    Email: "bsmith@example.com",
    PhoneNo: "09760265871",
    StartDate: "2024-07-29",
    ResignDate: "2025-04-24",
  },
  {
    Id: 3,
    EmployeeCode: "1113",
    Username: "clee",
    Name: "Carol Lee",
    Role: "Developer",
    Email: "clee@example.com",
    PhoneNo: "09166024140",
    StartDate: "2024-12-03",
    ResignDate: "2025-11-29",
  },
  {
    Id: 4,
    EmployeeCode: "1114",
    Username: "dbrown",
    Name: "David Brown",
    Role: "Sales Executive",
    Email: "dbrown@example.com",
    PhoneNo: "09167383304",
    StartDate: "2024-05-22",
    ResignDate: "2025-09-01",
  },
  {
    Id: 5,
    EmployeeCode: "1115",
    Username: "emartinez",
    Name: "Ella Martinez",
    Role: "Sales Executive",
    Email: "emartinez@example.com",
    PhoneNo: "09514246085",
    StartDate: "2024-12-20",
    ResignDate: "2025-11-30",
  },
  {
    Id: 6,
    EmployeeCode: "1116",
    Username: "fwilson",
    Name: "Frank Wilson",
    Role: "Developer",
    Email: "fwilson@example.com",
    PhoneNo: "09876521019",
    StartDate: "2024-07-23",
    ResignDate: "2025-09-22",
  },
  {
    Id: 7,
    EmployeeCode: "1117",
    Username: "gtaylor",
    Name: "Grace Taylor",
    Role: "HR",
    Email: "gtaylor@example.com",
    PhoneNo: "09615733460",
    StartDate: "2024-11-29",
    ResignDate: "2025-08-02",
  },
  {
    Id: 8,
    EmployeeCode: "1118",
    Username: "hdavis",
    Name: "Henry Davis",
    Role: "Sales Executive",
    Email: "hdavis@example.com",
    PhoneNo: "09583728789",
    StartDate: "2024-08-06",
    ResignDate: "2025-08-19",
  },
  {
    Id: 9,
    EmployeeCode: "1119",
    Username: "iwhite",
    Name: "Isla White",
    Role: "Designer",
    Email: "iwhite@example.com",
    PhoneNo: "09269599084",
    StartDate: "2024-10-09",
    ResignDate: "2025-03-28",
  },
  {
    Id: 10,
    EmployeeCode: "1120",
    Username: "jharris",
    Name: "Jack Harris",
    Role: "Accountant",
    Email: "jharris@example.com",
    PhoneNo: "09498693044",
    StartDate: "2024-07-17",
    ResignDate: "2025-08-20",
  },
  {
    Id: 11,
    EmployeeCode: "1121",
    Username: "klane",
    Name: "Karen Lane",
    Role: "HR",
    Email: "klane@example.com",
    PhoneNo: "09846575124",
    StartDate: "2024-06-24",
    ResignDate: "2025-04-14",
  },
  {
    Id: 12,
    EmployeeCode: "1122",
    Username: "lmorgan",
    Name: "Liam Morgan",
    Role: "Designer",
    Email: "lmorgan@example.com",
    PhoneNo: "09724896536",
    StartDate: "2024-02-08",
    ResignDate: "2025-06-26",
  },
  {
    Id: 13,
    EmployeeCode: "1123",
    Username: "mking",
    Name: "Mia King",
    Role: "Sales Executive",
    Email: "mking@example.com",
    PhoneNo: "09929037474",
    StartDate: "2024-06-02",
    ResignDate: "2025-10-22",
  },
  {
    Id: 14,
    EmployeeCode: "1124",
    Username: "nscott",
    Name: "Noah Scott",
    Role: "Developer",
    Email: "nscott@example.com",
    PhoneNo: "09850993511",
    StartDate: "2024-06-21",
    ResignDate: "2025-10-12",
  },
  {
    Id: 15,
    EmployeeCode: "1125",
    Username: "owright",
    Name: "Olivia Wright",
    Role: "Sales Executive",
    Email: "owright@example.com",
    PhoneNo: "09969510787",
    StartDate: "2024-04-25",
    ResignDate: "2025-06-30",
  },
  {
    Id: 16,
    EmployeeCode: "1126",
    Username: "pthomas",
    Name: "Paul Thomas",
    Role: "Designer",
    Email: "pthomas@example.com",
    PhoneNo: "09602962188",
    StartDate: "2024-01-06",
    ResignDate: "2025-03-13",
  },
  {
    Id: 17,
    EmployeeCode: "1127",
    Username: "qramos",
    Name: "Quinn Ramos",
    Role: "Sales Executive",
    Email: "qramos@example.com",
    PhoneNo: "09734588622",
    StartDate: "2024-06-28",
    ResignDate: "2025-02-03",
  },
  {
    Id: 18,
    EmployeeCode: "1128",
    Username: "rclark",
    Name: "Ryan Clark",
    Role: "Designer",
    Email: "rclark@example.com",
    PhoneNo: "09512491947",
    StartDate: "2024-12-21",
    ResignDate: "2025-09-30",
  },
  {
    Id: 19,
    EmployeeCode: "1129",
    Username: "ssanchez",
    Name: "Sophia Sanchez",
    Role: "Manager",
    Email: "ssanchez@example.com",
    PhoneNo: "09186159226",
    StartDate: "2024-12-19",
    ResignDate: "2025-09-15",
  },
  {
    Id: 20,
    EmployeeCode: "1130",
    Username: "tlopez",
    Name: "Tyler Lopez",
    Role: "HR",
    Email: "tlopez@example.com",
    PhoneNo: "09338542537",
    StartDate: "2024-01-27",
    ResignDate: "2025-11-05",
  },
  {
    Id: 21,
    EmployeeCode: "1131",
    Username: "umorris",
    Name: "Uma Morris",
    Role: "Manager",
    Email: "umorris@example.com",
    PhoneNo: "09706774245",
    StartDate: "2024-09-22",
    ResignDate: "2025-07-23",
  },
  {
    Id: 22,
    EmployeeCode: "1132",
    Username: "vparker",
    Name: "Victor Parker",
    Role: "HR",
    Email: "vparker@example.com",
    PhoneNo: "09983270822",
    StartDate: "2024-06-22",
    ResignDate: "2025-01-17",
  },
  {
    Id: 23,
    EmployeeCode: "1133",
    Username: "wreed",
    Name: "Wendy Reed",
    Role: "Accountant",
    Email: "wreed@example.com",
    PhoneNo: "09977891857",
    StartDate: "2024-03-27",
    ResignDate: "2025-03-26",
  },
  {
    Id: 24,
    EmployeeCode: "1134",
    Username: "xross",
    Name: "Xavier Ross",
    Role: "Sales Executive",
    Email: "xross@example.com",
    PhoneNo: "09158278488",
    StartDate: "2024-08-25",
    ResignDate: "2025-03-18",
  },
  {
    Id: 25,
    EmployeeCode: "1135",
    Username: "yprice",
    Name: "Yara Price",
    Role: "Sales Executive",
    Email: "yprice@example.com",
    PhoneNo: "09937311776",
    StartDate: "2024-08-05",
    ResignDate: "2025-05-27",
  },
  {
    Id: 26,
    EmployeeCode: "1136",
    Username: "zward",
    Name: "Zoe Ward",
    Role: "HR",
    Email: "zward@example.com",
    PhoneNo: "09512291779",
    StartDate: "2024-03-13",
    ResignDate: "2025-08-08",
  },
  {
    Id: 27,
    EmployeeCode: "1137",
    Username: "aevans",
    Name: "Adam Evans",
    Role: "Accountant",
    Email: "aevans@example.com",
    PhoneNo: "09943927242",
    StartDate: "2024-05-18",
    ResignDate: "2025-10-28",
  },
  {
    Id: 28,
    EmployeeCode: "1138",
    Username: "bgreen",
    Name: "Bella Green",
    Role: "Manager",
    Email: "bgreen@example.com",
    PhoneNo: "09278127957",
    StartDate: "2024-02-07",
    ResignDate: "2025-07-15",
  },
  {
    Id: 29,
    EmployeeCode: "1139",
    Username: "cturner",
    Name: "Chris Turner",
    Role: "Designer",
    Email: "cturner@example.com",
    PhoneNo: "09481395000",
    StartDate: "2024-02-25",
    ResignDate: "2025-06-07",
  },
  {
    Id: 30,
    EmployeeCode: "1140",
    Username: "dphillips",
    Name: "Daisy Phillips",
    Role: "Manager",
    Email: "dphillips@example.com",
    PhoneNo: "09851622798",
    StartDate: "2024-05-18",
    ResignDate: "2025-02-24",
  },
  {
    Id: 31,
    EmployeeCode: "1141",
    Username: "emurphy",
    Name: "Ethan Murphy",
    Role: "Developer",
    Email: "emurphy@example.com",
    PhoneNo: "09694160962",
    StartDate: "2024-07-01",
    ResignDate: "2025-06-25",
  },
  {
    Id: 32,
    EmployeeCode: "1142",
    Username: "fbell",
    Name: "Fiona Bell",
    Role: "Sales Executive",
    Email: "fbell@example.com",
    PhoneNo: "09798424736",
    StartDate: "2024-12-23",
    ResignDate: "2025-01-18",
  },
  {
    Id: 33,
    EmployeeCode: "1143",
    Username: "ggomez",
    Name: "Gabriel Gomez",
    Role: "Designer",
    Email: "ggomez@example.com",
    PhoneNo: "09586313600",
    StartDate: "2024-11-03",
    ResignDate: "2025-11-09",
  },
  {
    Id: 34,
    EmployeeCode: "1144",
    Username: "hcooper",
    Name: "Hazel Cooper",
    Role: "HR",
    Email: "hcooper@example.com",
    PhoneNo: "09178081012",
    StartDate: "2024-09-05",
    ResignDate: "2025-11-08",
  },
  {
    Id: 35,
    EmployeeCode: "1145",
    Username: "ijames",
    Name: "Ian James",
    Role: "Sales Executive",
    Email: "ijames@example.com",
    PhoneNo: "09706833124",
    StartDate: "2024-11-28",
    ResignDate: "2025-12-15",
  },
  {
    Id: 36,
    EmployeeCode: "1146",
    Username: "jkelley",
    Name: "Julia Kelley",
    Role: "Developer",
    Email: "jkelley@example.com",
    PhoneNo: "09142626836",
    StartDate: "2024-11-03",
    ResignDate: "2025-11-20",
  },
  {
    Id: 37,
    EmployeeCode: "1147",
    Username: "kramirez",
    Name: "Kevin Ramirez",
    Role: "Developer",
    Email: "kramirez@example.com",
    PhoneNo: "09151411087",
    StartDate: "2024-07-19",
    ResignDate: "2025-01-13",
  },
  {
    Id: 38,
    EmployeeCode: "1148",
    Username: "llawson",
    Name: "Lily Lawson",
    Role: "Accountant",
    Email: "llawson@example.com",
    PhoneNo: "09102770472",
    StartDate: "2024-07-27",
    ResignDate: "2025-02-12",
  },
  {
    Id: 39,
    EmployeeCode: "1149",
    Username: "mclarkson",
    Name: "Mason Clarkson",
    Role: "Developer",
    Email: "mclarkson@example.com",
    PhoneNo: "09349528082",
    StartDate: "2024-06-15",
    ResignDate: "2025-01-24",
  },
  {
    Id: 40,
    EmployeeCode: "1150",
    Username: "nbrooks",
    Name: "Nora Brooks",
    Role: "Developer",
    Email: "nbrooks@example.com",
    PhoneNo: "09698192031",
    StartDate: "2024-08-25",
    ResignDate: "2025-11-15",
  },
  {
    Id: 41,
    EmployeeCode: "1151",
    Username: "operez",
    Name: "Owen Perez",
    Role: "Developer",
    Email: "operez@example.com",
    PhoneNo: "09853223787",
    StartDate: "2024-11-01",
    ResignDate: "2025-05-28",
  },
  {
    Id: 42,
    EmployeeCode: "1152",
    Username: "qross",
    Name: "Quinn Ross",
    Role: "Accountant",
    Email: "qross@example.com",
    PhoneNo: "09611459125",
    StartDate: "2024-07-15",
    ResignDate: "2025-11-17",
  },
  {
    Id: 43,
    EmployeeCode: "1153",
    Username: "rriley",
    Name: "Ruby Riley",
    Role: "HR",
    Email: "rriley@example.com",
    PhoneNo: "09506206243",
    StartDate: "2024-04-02",
    ResignDate: "2025-03-13",
  },
  {
    Id: 44,
    EmployeeCode: "1154",
    Username: "sbailey",
    Name: "Sean Bailey",
    Role: "Developer",
    Email: "sbailey@example.com",
    PhoneNo: "09585719549",
    StartDate: "2024-04-17",
    ResignDate: "2025-06-09",
  },
  {
    Id: 45,
    EmployeeCode: "1155",
    Username: "tcarter",
    Name: "Tara Carter",
    Role: "HR",
    Email: "tcarter@example.com",
    PhoneNo: "09541159639",
    StartDate: "2024-10-30",
    ResignDate: "2025-02-10",
  },
  {
    Id: 46,
    EmployeeCode: "1156",
    Username: "ugriffin",
    Name: "Uriel Griffin",
    Role: "HR",
    Email: "ugriffin@example.com",
    PhoneNo: "09787368027",
    StartDate: "2024-02-22",
    ResignDate: "2025-05-04",
  },
  {
    Id: 47,
    EmployeeCode: "1157",
    Username: "vwells",
    Name: "Violet Wells",
    Role: "Designer",
    Email: "vwells@example.com",
    PhoneNo: "09120439262",
    StartDate: "2024-05-10",
    ResignDate: "2025-09-11",
  },
  {
    Id: 48,
    EmployeeCode: "1158",
    Username: "wturner",
    Name: "Wyatt Turner",
    Role: "Accountant",
    Email: "wturner@example.com",
    PhoneNo: "09116545383",
    StartDate: "2024-07-11",
    ResignDate: "2025-12-29",
  },
  {
    Id: 49,
    EmployeeCode: "1159",
    Username: "xadams",
    Name: "Xavier Adams",
    Role: "Designer",
    Email: "xadams@example.com",
    PhoneNo: "09566709866",
    StartDate: "2024-06-21",
    ResignDate: "2025-01-11",
  },
  {
    Id: 50,
    EmployeeCode: "1160",
    Username: "yyoung",
    Name: "Yvonne Young",
    Role: "Sales Executive",
    Email: "yyoung@example.com",
    PhoneNo: "09529722554",
    StartDate: "2024-06-12",
    ResignDate: "2025-10-05",
  },
];

export function RemoveEmployee() {
  const location = useLocation();
  const navigate = useNavigate();

  const { project, employees } = location.state || {
    project: "",
    employees: EmployeeData,
  };
  const [employeeList, setEmployeeList] = useState<Employee[]>(
    employees.length ? employees : EmployeeData
  );
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(employeeList.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = employeeList.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = employeeList.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const toggleEmployee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, id]);
    } else {
      setSelectedEmployees((prev) => prev.filter((empId) => empId !== id));
    }
  };

  const isAllSelected = currentData.every((emp) =>
    selectedEmployees.includes(emp.Id)
  );
  const isSomeSelected = currentData.some((emp) =>
    selectedEmployees.includes(emp.Id)
  );

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      const idsToAdd = currentData
        .map((emp) => emp.Id)
        .filter((id) => !selectedEmployees.includes(id));
      setSelectedEmployees((prev) => [...prev, ...idsToAdd]);
    } else {
      const idsToRemove = currentData.map((emp) => emp.Id);
      setSelectedEmployees((prev) =>
        prev.filter((id) => !idsToRemove.includes(id))
      );
    }
  };
  const handleRemoveSelected = () => {
    if (selectedEmployees.length === 0) return;
    setEmployeeList((prev) =>
      prev.filter((emp) => !selectedEmployees.includes(emp.Id))
    );
    setSelectedEmployees([]);
  };

  return (
    <div className="p-6 w-full flex flex-col">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h2 className="text-xl font-semibold mb-4 text-black">
          <span className="text-primary-600">{project}</span>
        </h2>
      </div>
      <div>
        {employeeList.length === 0 ? (
          <p className="text-muted-foreground">No employees selected.</p>
        ) : (
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-primary-300">
                <TableHead>
                  <Checkbox.Root
                    checked={
                      isAllSelected
                        ? true
                        : isSomeSelected
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={handleSelectAll}
                    className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center"
                  >
                    <Checkbox.Indicator>
                      {isSomeSelected ? (
                        <div className="w-2.5 h-0.5 bg-black" />
                      ) : (
                        <Check className="w-4 h-4 text-black" />
                      )}
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((emp) => (
                <TableRow
                  key={emp.Id}
                  className="odd:bg-primary-100 even:bg-primary-50"
                >
                  <TableCell>
                    <Checkbox.Root
                      checked={selectedEmployees.includes(emp.Id)}
                      onCheckedChange={(checked) =>
                        toggleEmployee(emp.Id, Boolean(checked))
                      }
                      className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-black" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </TableCell>
                  <TableCell className="text-black">{emp.Name}</TableCell>
                  <TableCell className="text-black">{emp.Email}</TableCell>
                  <TableCell className="text-black">{emp.PhoneNo}</TableCell>
                  <TableCell className="text-black">{emp.Role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Paginations */}
      <div className="flex items-center justify-between p-4 border-t">
        {/* Left: Showing rows */}
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {totalRows}
        </div>

        {/* Middle: Page buttons */}

        <div className="flex space-x-1">
          <button
            onClick={goToFirst}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-primary-500 text-natural-50"
                  : "bg-natural-50 text-black hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronRight />
          </button>
          <button
            onClick={goToLast}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronsRight />
          </button>
        </div>

        {/* Right: Rows per page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows/page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset page
            }}
            className="border rounded px-2 py-1 text-sm p-3"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end mt-6 gap-3">
        <Button
          variant="secondary"
          className="bg-gray-100 text-black border border-gray-300"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          className="bg-primary-500 text-white hover:bg-primary-600"
          disabled={selectedEmployees.length === 0}
          onClick={handleRemoveSelected}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
