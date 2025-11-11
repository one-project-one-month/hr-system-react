import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar1Icon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type SetStateAction } from "react";
import { Link, useNavigate } from "react-router-dom";

export type DemoProject = {
  id: number;
  code: string;
  name: string;
  status: "ASDF" | "OPEN" | "DONE";
  startDate: string;
  endDate: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const demoProjects: DemoProject[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: i + 1,
    code: "PJ1234",
    name: "Chan Lay",
    status: "ASDF",
    startDate: "10/18/2025",
    endDate: "10/18/2025",
  })
);

export default function ProjectListing() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({});
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchTerm) return demoProjects;
    const q = searchTerm.toLowerCase();
    return demoProjects.filter((r) =>
      [String(r.id), r.code, r.name, r.status, r.startDate, r.endDate]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [searchTerm]);

  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + rowsPerPage);
  const startRow = totalRows === 0 ? 0 : startIndex + 1;
  const endRow = Math.min(startIndex + rowsPerPage, totalRows);

  // Keep page in range if filter changes
  if (currentPage > totalPages) setCurrentPage(totalPages);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  return (
    <div className="p-6 w-full flex-1">
      {/* Header row */}
      <div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
        <p className="">Project Listing</p>

        {/* date picker */}
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "justify-start text-left font-normal w-[250px] outline-btn",
                  !date.from && "text-muted-foreground"
                )}
              >
                <Calendar1Icon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")}/
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-primary-500 text-white"
              align="start"
            >
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* search */}
        <div className="relative w-full md:w-[20%] text-primary-800">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primay-800 h-4 w-4" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9"
          />
        </div>

        <Button className="outline-btn">Export</Button>
        <Link to="/projects/new">
          <Button className="outline-btn">
            <Plus className="mr-2 h-4 w-4" />
            Add new
          </Button>
        </Link>

        {/**Add Employee */}
        <Link to="/projects/add-employee">
          <Button className="outline-btn">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none">
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentData.map((row, idx) => (
            <TableRow
              key={row.id}
              className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none cursor-pointer"
              onClick={() => navigate(`/projects/${row.id}`)}
            >
              <TableCell className="font-medium">
                {startIndex + idx + 1}.
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-3">
                  <button
                    className="p-1 hover:bg-primary-300/50 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${row.id}/edit`);
                    }}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-primary-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-primary-300/50 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${row.id}`);
                    }}
                    title="View"
                  >
                    <Eye className="h-4 w-4 text-primary-700" />
                  </button>
                  <button
                    className="p-1 hover:bg-primary-300/50 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // delete logic here
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-error-400" />
                  </button>
                  <button
                    className="p-1 hover:bg-primary-300/50 rounded"
                    onClick={(e) => e.stopPropagation()}
                    title="More"
                  >
                    <MoreVertical className="h-4 w-4 text-primary-700" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
            aria-label="First page"
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="Previous page"
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
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
          <button
            onClick={goToLast}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="Last page"
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
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm p-3"
          >
            {[10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
