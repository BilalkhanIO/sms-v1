import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStudents } from '../../redux/features/studentSlice';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';

const StudentSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
    sortBy: 'name'
  });

  const dispatch = useDispatch();

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    dispatch(fetchStudents({ ...filters, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search students..."
            value={filters.search}
            onChange={handleSearch}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <select
          name="class"
          value={filters.class}
          onChange={handleSearch}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Classes</option>
          {/* Add class options dynamically */}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleSearch}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="TRANSFERRED">Transferred</option>
          <option value="GRADUATED">Graduated</option>
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleSearch}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="name">Name</option>
          <option value="rollNumber">Roll Number</option>
          <option value="class">Class</option>
          <option value="dateCreated">Date Created</option>
        </select>
      </div>
    </div>
  );
};

export default StudentSearch;
