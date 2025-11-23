import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { capitalizeCamelCase } from '@/lib/utils';
import {
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  Search,
  Calendar1Icon,
  FileUp,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { SuccessDialog } from '@/components/ui/SuccessDialog';
import { useAuthStore } from '@/stores/useAuthStore';
export function AttendanceList() {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      code: '001',
      name: 'Alice Johnson',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 2,
      code: '002',
      name: 'Bob Smith',
      checkinTime: '09:15 AM',
      checkoutTime: '05:10 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 3,
      code: '003',
      name: 'Charlie Brown',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 4,
      code: '004',
      name: 'Diana Prince',
      checkinTime: '09:05 AM',
      checkoutTime: '04:55 PM',
      date: '2025-10-01',
      workingHours: '7h 50m',
      status: 'Present',
    },
    {
      id: 5,
      code: '005',
      name: 'Ethan White',
      checkinTime: '09:45 AM',
      checkoutTime: '04:30 PM',
      date: '2025-10-01',
      workingHours: '6h 45m',
      status: 'Late',
    },
    {
      id: 6,
      code: '006',
      name: 'Fiona Green',
      checkinTime: '08:50 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h 10m',
      status: 'Present',
    },
    {
      id: 7,
      code: '007',
      name: 'George Miller',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 8,
      code: '008',
      name: 'Hannah Lee',
      checkinTime: '09:10 AM',
      checkoutTime: '05:05 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 9,
      code: '009',
      name: 'Ian Black',
      checkinTime: '09:30 AM',
      checkoutTime: '04:40 PM',
      date: '2025-10-01',
      workingHours: '7h 10m',
      status: 'Late',
    },
    {
      id: 10,
      code: '010',
      name: 'Jane Doe',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 11,
      code: '011',
      name: 'Kevin Hart',
      checkinTime: '09:05 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 12,
      code: '012',
      name: 'Laura King',
      checkinTime: '09:20 AM',
      checkoutTime: '04:50 PM',
      date: '2025-10-01',
      workingHours: '7h 30m',
      status: 'Late',
    },
    {
      id: 13,
      code: '013',
      name: 'Michael Scott',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 14,
      code: '014',
      name: 'Nina Patel',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 15,
      code: '015',
      name: 'Oscar Wilde',
      checkinTime: '09:10 AM',
      checkoutTime: '05:05 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 16,
      code: '016',
      name: 'Paula Abdul',
      checkinTime: '09:35 AM',
      checkoutTime: '04:45 PM',
      date: '2025-10-01',
      workingHours: '7h 10m',
      status: 'Late',
    },
    {
      id: 17,
      code: '017',
      name: 'Quincy Adams',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 18,
      code: '018',
      name: 'Rachel Green',
      checkinTime: '08:55 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h 5m',
      status: 'Present',
    },
    {
      id: 19,
      code: '019',
      name: 'Steve Rogers',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 20,
      code: '020',
      name: 'Tina Fey',
      checkinTime: '09:15 AM',
      checkoutTime: '04:55 PM',
      date: '2025-10-01',
      workingHours: '7h 40m',
      status: 'Late',
    },
    {
      id: 21,
      code: '021',
      name: 'Uma Thurman',
      checkinTime: '09:05 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 22,
      code: '022',
      name: 'Victor Hugo',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 23,
      code: '023',
      name: 'Wendy Darling',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 24,
      code: '024',
      name: 'Xander Cage',
      checkinTime: '09:20 AM',
      checkoutTime: '04:50 PM',
      date: '2025-10-01',
      workingHours: '7h 30m',
      status: 'Late',
    },
    {
      id: 25,
      code: '025',
      name: 'Yara Shahidi',
      checkinTime: '09:00 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h',
      status: 'Present',
    },
    {
      id: 26,
      code: '026',
      name: 'Zachary Levi',
      checkinTime: '09:10 AM',
      checkoutTime: '05:05 PM',
      date: '2025-10-01',
      workingHours: '7h 55m',
      status: 'Present',
    },
    {
      id: 27,
      code: '027',
      name: 'Aaron Paul',
      checkinTime: '09:30 AM',
      checkoutTime: '04:40 PM',
      date: '2025-10-01',
      workingHours: '7h 10m',
      status: 'Late',
    },
    {
      id: 28,
      code: '028',
      name: 'Betty White',
      checkinTime: '-',
      checkoutTime: '-',
      date: '2025-10-01',
      workingHours: '0h',
      status: 'Absent',
    },
    {
      id: 29,
      code: '029',
      name: 'Carl Jung',
      checkinTime: '08:50 AM',
      checkoutTime: '05:00 PM',
      date: '2025-10-01',
      workingHours: '8h 10m',
      status: 'Present',
    },
    {
      id: 30,
      code: '030',
      name: 'Daisy Ridley',
      checkinTime: '09:05 AM',
      checkoutTime: '04:55 PM',
      date: '2025-10-01',
      workingHours: '7h 50m',
      status: 'Present',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = data.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const token = useAuthStore((state) => state.token);

  const goToCreatForm = () => {
    navigate('/attendance/create');
  };

  const updateAttendance = (code: string) => {
    navigate(`/attendance/${code}/update`);
  };

  const deleteAttendance = (code: string) => {};
  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate('/attendance');
  };

  alert(token);
  return (
    <div className='p-6 w-full flex-1'>
      <div className='flex justify-between flex-col md:flex-row gap-2 mb-4'>
        <p className='text-3xl font-semibold'>Attendance</p>
        {/* date picker */}
        <div className='grid gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  'justify-between text-left font-normal w-[250px] outline-btn font-semibold',
                  !date && 'text-muted-foreground'
                )}>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')}/
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
                <Calendar1Icon className='mr-2 h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 bg-natural-50'
              align='start'>
              <Calendar
                mode='range'
                selected={date}
                onSelect={(dateRange) =>
                  setDate({ from: dateRange?.from, to: dateRange?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* search */}
        <div className='relative w-full md:w-[20%] text-primary-800'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-primay-800 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search...'
            className='focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9' // Add left padding so text doesn’t overlap the icon
          />
        </div>
        {/* buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger className='outline-btn border border-primary-600 focus:outline-none py-1 px-2 rounded-md flex gap-2'>
            <FileUp />
            Export
          </DropdownMenuTrigger>
          <DropdownMenuContent className='z-20 bg-natural-50 w-24 p-4 rounded-md'>
            <DropdownMenuSeparator />
            <DropdownMenuItem> PDF</DropdownMenuItem>
            <DropdownMenuItem>Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className='outline-btn'
          onClick={goToCreatForm}>
          <Plus />
          Add new
        </Button>
      </div>
      <Table className='w-full overflow-auto'>
        <TableHeader className='bg-primary-300'>
          <TableRow className='border-none'>
            {Object.keys(data[0]).map((columnName) => (
              <TableHead key={columnName}>
                {columnName === 'id' ? 'No' : capitalizeCamelCase(columnName)}
              </TableHead>
            ))}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((user, index) => (
            <TableRow
              key={index}
              className='odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3'>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.code}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.checkinTime}</TableCell>
              <TableCell>{user.checkoutTime}</TableCell>
              <TableCell>{user.date}</TableCell>
              <TableCell>{user.workingHours}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell className='flex '>
                <Edit
                  className='text-primary-500 cursor-pointer'
                  onClick={() => updateAttendance(user.code)}
                />
                <Trash2
                  className='text-error-400 cursor-pointer'
                  onClick={() => deleteAttendance(user.code)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex flex-col md:flex-row items-center gap-2'>
        {/* Paginations */}
        <div className='w-full flex items-center justify-center md:justify-around p-4 border-t flex-col md:flex-row gap-3 '>
          {/* Left: Showing rows */}
          <div className='text-sm text-muted-foreground'>
            {startRow}–{endRow} of {totalRows}
          </div>
          {/* Middle: Page buttons */}
          <div className='flex space-x-1'>
            <button
              onClick={goToFirst}
              disabled={currentPage === 1}
              className='px-2 py-1 rounded pagination-btn disabled:opacity-50'>
              <ChevronsLeft />
            </button>
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className='px-2 py-1 rounded pagination-btn disabled:opacity-50'>
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-primary-500 text-natural-50'
                    : 'bg-natural-50 text-black hover:bg-gray-200'
                }`}>
                {page}
              </button>
            ))}
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className='px-2 py-1 rounded pagination-btn disabled:opacity-50'>
              <ChevronRight />
            </button>
            <button
              onClick={goToLast}
              disabled={currentPage === totalPages}
              className='px-2 py-1 rounded pagination-btn disabled:opacity-50'>
              <ChevronsRight />
            </button>
          </div>
          {/* Right: Rows per page */}
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-muted-foreground'>Rows/page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset page
              }}
              className='border rounded px-2 py-1 text-sm p-3'>
              {[10, 20, 30, 50].map((n) => (
                <option
                  key={n}
                  value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
