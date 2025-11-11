import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  FolderUp,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  Search,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { SpinnerCustom } from "@/components/ui/spinner";
import { backlogService } from "@/services/backlogService";

export default function BacklogList() {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await backlogService.fetchTasks(currentPage, rowsPerPage);
        setTasks(result.tasks ?? []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, rowsPerPage]);

  // Handle loading
  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <SpinnerCustom /> Loading...
      </div>
    );

  // Handle no tasks
  if (!tasks || tasks.length === 0)
    return (
      <div className="flex flex-col p-10 text-muted-foreground">
        <p className="text-lg font-medium">No tasks found</p>
      </div>
    );

  const totalPages = Math.ceil(tasks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = tasks.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = tasks.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const handleRowClick = (taskId: number) => {
    navigate(`/backlog/${taskId}`);
  };

  const handleEdit = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    navigate(`/backlog/edit/${taskId}`);
  };

  const handleDelete = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const result = await backlogService.deleteTask(taskToDelete);

      if (result.isSuccess) {
        // Refetch the latest list
        const updatedData = await backlogService.fetchTasks(currentPage, rowsPerPage);
        setTasks(updatedData.tasks ?? []);
      } else {
        console.error("Delete failed:", result);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="p-6 w-full flex-1">
      {/* Header and Controls */}
      <div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
        <p className="font-semibold">Backlog Group Listing</p>

        {/* Search Bar */}
        <div className="relative w-full md:w-[20%] text-primary-800">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-800 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9"
          />
        </div>

        {/* Action Buttons */}
        <Button className="outline-btn">
          <FolderUp /> Export
        </Button>
        <Link to="/backlog/create">
          <Button className="outline-btn">
            <Plus /> Create
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none">
            <TableHead>No</TableHead>
            <TableHead>Task Code</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentData.map((task, index) => (
            <TableRow
              key={task.taskId}
              onClick={() => handleRowClick(task.taskId)}
              className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
            >
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{task.taskCode}</TableCell>
              <TableCell>{task.taskName}</TableCell>
              <TableCell>
                {task.employeeName || task.employeeCode || "—"}
              </TableCell>
              <TableCell>
                {task.projectName || task.projectCode || "—"}
              </TableCell>

              <TableCell className="flex gap-2">
                <Edit
                  className="text-primary-500 cursor-pointer"
                  onClick={(e) => handleEdit(e, task.taskId)}
                />
                <Trash2
                  className="text-error-400 hover:text-destructive cursor-pointer"
                  onClick={(e) => handleDelete(e, task.taskId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Section */}
      <div className="flex flex-col md:flex-col lg:flex-row items-center justify-between gap-4 p-4 border-t">
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {totalRows}
        </div>

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
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-secondary-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-md">
              <div className="flex gap-3">
                <Trash2 className="h-6 w-6 text-gray-600" /> Are you sure you
                want to delete this record?
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}