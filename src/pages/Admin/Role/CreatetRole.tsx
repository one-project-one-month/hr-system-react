// src/pages/CreateRole.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const CreateRole: React.FC = () => {
  return (
    <div className="w-full p-8">
      {/* Main content wrapper */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Header Section */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Create Role
        </h1>

        {/* Form Section */}
        <form>
          {/* Form fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Code
              </label>
              <input
                type="text"
                id="adminCode"
                placeholder="Admin Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;