// src/pages/Role.tsx

import { RoleService } from "@/services/roleService";
import type { Role } from "@/types/auth";
import type { RoleItems } from "@/types/role";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define the component using React.FC (Functional Component)
const Role: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleItems | null>(null);

  // --- PAGINATION STATE ---
  const [roleData, setRoleData] = useState<RoleItems[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // As requested, 10 items per page

  // --- PAGINATION CALCULATIONS ---
  const totalItems = roleData?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = roleData.slice(startIndex, endIndex);
  const [loading, setLoading] = useState(false);
  const [searchRole, setSearchRole] = useState("")
  // Calculate items for the "1-10 of 300" text
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

  // --- PAGINATION HANDLERS ---
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handlePageClick = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  // --- DYNAMIC PAGE NUMBER GENERATION ---
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // We will show 5 page numbers at a time
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    // eslint-disable-next-line prefer-const
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is at the limit
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };
  const pageNumbers = getPageNumbers();

  // --- MODAL HANDLERS (Unchanged) ---
  const handelOpenModal = (role: RoleItems) => {
    setRoleToDelete(role);
    setIsModalOpen(true);
  };

  const handelCloseModal = () => {
    setIsModalOpen(false);
    setRoleToDelete(null);
  };

  const handelDeleteRole = () => {
    if (roleToDelete) {
      console.log(
        `Deleting role: ${roleToDelete.name} (ID: ${roleToDelete.no})`
      );
      // Here you would filter `allRolesData` and update state
    }
    handelCloseModal();
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(false)
        fetchRoles()
      } catch (error) {

      }

    })()
  }, [])

  const fetchRoles = async () => {
    const roles = await RoleService.fetchRoles({
      roleName: searchRole,
      pageNo: currentPage,
      pageSize: totalItems,
    })
    setRoleData(roles.data.items)
  }

  return (
    <div className="p-3 sm:p-6 md:p-8 w-full">
      {/* Main content wrapper */}
      <div className="p-6 md:p-8 bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-Black-800">
            Role
          </h1>
          <Link
            to="/role/create"
            className="flex items-center gap-2 text-white bg-[rgba(2,177,108,1)] py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <Plus size={20} />
            New
          </Link>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full justify-between overflow-hidden rounded-lg border text-sm sm:text-base">
            <thead>
              <tr className="bg-[#55CB9D] font-bold text-m text-black-800">
                <th className="py-3 px-6 text-center">No</th>
                <th className="py-3 px-6 text-center">Role Name</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Render only the roles for the current page */}
              {currentRoles.map((role: RoleItems, index) => (
                <tr
                  key={role.roleCode}
                  className="border-b odd:bg-[#E6F7F0] even:bg-[#B1E7D1] hover:bg-accent transition-colors"
                >
                  <td className="py-4 px-6 text-center">{index}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium text-center">
                    {role.roleName}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-3 sm:gap-4">
                      <Link
                        to="/role/update"
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handelOpenModal(role)}
                        className="p-1 sm:p-2 text-black-500 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <Link
                        to="/role/view"
                        className="text-gray-500 hover:text-green-500"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- DYNAMIC PAGINATION SECTION --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {/* Left: Row count */}
          <div className="text-sm text-gray-600">
            {startItem}-{endItem} of {totalItems}
          </div>

          {/* Center: Page numbers */}
          <nav className="flex items-center gap-1">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-[rgba(2,177,108,1)] text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-[rgba(2,177,108,1)] text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Render dynamic page numbers */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === page
                  ? "bg-[rgba(2,177,108,1)] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100 border"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-[rgba(2,177,108,1)] text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-[rgba(2,177,108,1)] text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={20} />
            </button>
          </nav>

          {/* Right: Row/Page dropdown */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Row/Page</span>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 pr-8 border rounded-md appearance-none w-24 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL (Unchanged) --- */}
      {isModalOpen && roleToDelete && (
        <div
          className="fixed inset-0 bg-opacity-100 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={handelCloseModal}
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Trash2 size={40} className="text-red-800" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-black-800 mb-4">
              Are you sure you want to delete this record?
            </h1>
            <p className="text-base text-gray-400 mb-4">
              This action cannot be undone
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handelCloseModal}
                className="py-2 px-8 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handelDeleteRole}
                className="py-2 px-8 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;
