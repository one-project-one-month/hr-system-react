// src/pages/Role.tsx

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Define a type for a single role object
type RoleType = {
  no: number;
  name: string;
};

// Use the RoleType to define the shape of our data array
const rolesData: RoleType[] = [
  { no: 1, name: "Manager" },
  { no: 2, name: "Executive" },
  { no: 3, name: "HR" },
  { no: 4, name: "Designer" },
  { no: 5, name: "Developer" },
  { no: 6, name: "Software Engineer" },
  { no: 7, name: "Sales Person" },
  { no: 8, name: "Receptionist" },
];

// Define the component using React.FC (Functional Component)
const Role: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleType | null>(null);

  const handelOpenModal = (role: RoleType) => {
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
    }
    handelCloseModal();
  };

  return (
    <div className="p-6 md:p-8 w-full">
      {/* Main content wrapper */}
      <div className="p-6 md:p-8 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-Black-800">
            Role
          </h1>
          <Link
            to="/role/create"
            className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={20} />
            Create
          </Link>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full justify-between">
            <thead>
              <tr className="font-bold text-m">
                <th className="py-3 pr-4 text-center">No</th>
                <th className="py-3 pr-4 text-center">Role Name</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rolesData.map((role: RoleType) => (
                <tr
                  key={role.no}
                  className="border-b odd:bg-accent even:bg-white hover:bg-accent transition-colors"
                >
                  <td className="py-4 pr-4 text-center">{role.no}</td>
                  <td className="py-4 pr-4 text-gray-800 font-medium text-center">
                    {role.name}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex justify-end items-center gap-4">
                      <Link
                        to="/role/update"
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handelOpenModal(role)}
                        className="text-gray-500 hover:text-red-500"
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

        {/* Pagination Section */}
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-gray-200 disabled:text-gray-300">
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-md bg-gray-800 text-white text-sm">
              1
            </button>
            <button className="p-2 rounded-md hover:bg-gray-200">
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      </div>
      {isModalOpen && roleToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={handelCloseModal} // Close modal if overlay is clicked
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Trash2 size={40} className="text-gray-800" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to delete the role?
            </h2>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handelCloseModal}
                className="py-2 px-8 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handelDeleteRole}
                className="py-2 px-8 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
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
