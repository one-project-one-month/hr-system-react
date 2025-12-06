// src/pages/UpdateRole.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UpdateRole: React.FC = () => {
  const navigate = useNavigate();

  // State to control the success modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State for the form inputs, now starting empty
  const [fullName, setFullName] = useState("");
  const [adminCode, setAdminCode] = useState("");

  // Handles the form submission
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading
    // ---
    // In a real app, you would put your API call logic here
    // e.g., api.updateRole({ name: fullName, code: adminCode });
    // ---

    console.log("Updating role with:", { fullName, adminCode });

    // Show the success modal
    setIsSuccessModalOpen(true);
  };

  // Closes the success modal and navigates to the /role page
  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/role");
  };

  return (
    <div className="w-full p-6 md:p-8">
      {/* Main content wrapper */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Header Section */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Edit Role
        </h1>

        {/* Form Section */}
        <form onSubmit={handleUpdate}>
          {/* Form fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              to="/role"
              className="bg-gray-200 text-[rgba(2,177,108,1)] py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-[rgba(2,177,108,1)] text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* --- Success Modal --- */}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-0 backdrop-blur-sm"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-xl p-8 pt-10 w-full max-w-sm mx-auto flex flex-col items-center text-center">
            {/* Green Checkmark Icon */}
            <div className="bg-green-100 rounded-full p-4 mb-5">
              <div className="bg-[rgba(2,177,108,1)] rounded-full p-4">
                {/* Simple SVG Checkmark */}
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Modal Text */}
            <h2
              id="modal-title"
              className="text-2xl font-bold text-gray-800 mb-6"
            >
              Update Successful!
            </h2>

            {/* OK Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full bg-[rgba(2,177,108,1)] text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* --- End of Success Modal --- */}
    </div>
  );
};

export default UpdateRole;