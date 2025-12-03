import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuccessDialog } from "@/components/ui/custom/SuccessDialog";
import { SpinnerCustom } from "@/components/ui/spinner";
import { companyRulesService } from "@/services/companyRulesService";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";

interface CompanyRule {
  companyRuleId: string;
  companyRuleCode: string;
  description: string;
  value: string;
}

export function CompanyRulesList() {
  const navigate = useNavigate();
  const [companyRulesList, setCompanyRulesList] = useState<CompanyRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { description, onConfirm, closeDialog } = useSuccessDialogStore();

  const totalPages = companyRulesList
    ? Math.ceil(companyRulesList.length / rowsPerPage)
    : 0;
  const startIndex = companyRulesList ? (currentPage - 1) * rowsPerPage : 0;
  const currentData = companyRulesList
    ? companyRulesList.slice(startIndex, startIndex + rowsPerPage)
    : [];
  const totalRows = companyRulesList ? companyRulesList.length : 0;
  const startRow = companyRulesList ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = companyRulesList
    ? Math.min(currentPage * rowsPerPage, totalRows)
    : 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await companyRulesService.fetchCompanyRules();
        setCompanyRulesList(data);
      } catch (error) {
        console.error("Error fetching company rules:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const handleSuccessConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  const handleRowClick = (item: CompanyRule) => {
    navigate(`/company-rules/${item.companyRuleCode}/detail?description=${item.description}&value=${item.value}`);
  };

  const handleEditClick = (event: React.MouseEvent, item: CompanyRule) => {
    event.stopPropagation();
    navigate(`/company-rules/${item.companyRuleCode}/edit?description=${item.description}&value=${item.value}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <SpinnerCustom /> Loading ...
      </div>
    );
  }

  return (
    <div className="p-6 w-full flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-5">
        <p className="text-2xl font-semibold">Company Rules Listing</p>
      </div>
      <>
        {!companyRulesList || companyRulesList.length === 0 ? (
          <div>No data to show</div>
        ) : (
          <>
            <Table className="w-full overflow-auto">
              <TableHeader className="bg-primary-300">
                <TableRow className="border-none">
                  <TableHead className="w-[60px]">No.</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Value</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData?.map((items, index) => (
                  <TableRow
                    key={index}
                    className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3 text-center"
                    onClick={() => handleRowClick(items)}
                  >
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{items.description}</TableCell>
                    <TableCell>{items.value}</TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Edit className="text-primary-500 cursor-pointer" onClick={(e) => handleEditClick(e, items)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col md:flex-row items-center gap-2">
              {/* Paginations */}
              <div className="w-full flex items-center justify-center md:justify-around p-4 border-t flex-col md:flex-row gap-3 ">
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${page === currentPage
                          ? "bg-primary-500 text-natural-50"
                          : "bg-natural-50 text-black hover:bg-gray-200"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
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
                  <span className="text-sm text-muted-foreground">
                    Rows/page:
                  </span>
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
            </div>
          </>
        )}
      </>
      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
