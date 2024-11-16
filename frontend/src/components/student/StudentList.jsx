import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteStudent } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FaEdit, FaTrash, FaIdCard, FaFileAlt } from 'react-icons/fa';
import ConfirmDialog from '../common/ConfirmDialog';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, loading, error, total } = useSelector((state) => state.student);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
    sortBy: 'name'
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(fetchStudents({ ...filters, page, limit }));
  }, [dispatch, filters, page, limit]);

  const handleDelete = async (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteStudent(selectedStudent._id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPage(1); // Reset to first page when searching
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center flex-1 space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search students..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
          
          <select
            value={filters.class}
            onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Classes</option>
            {/* Add class options */}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guardian
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={student.avatar || '/default-avatar.png'}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.rollNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.class}</div>
                  <div className="text-sm text-gray-500">{student.section}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.guardianName}</div>
                  <div className="text-sm text-gray-500">{student.guardianPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <Link
                      to={`/students/${student._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaIdCard className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/students/${student._id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(student)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={students.length < limit}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}?`}
      />
    </div>
  );
};

export default StudentList; 