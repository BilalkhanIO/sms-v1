import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteStudent } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FaEdit, FaTrash, FaIdCard, FaFileAlt } from 'react-icons/fa';
import ConfirmDialog from '../common/ConfirmDialog';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, loading, error, total } = useSelector((state) => state.student);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    dispatch(fetchStudents(filters));
  }, [dispatch, filters]);

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search students..."
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          {/* Add more filters */}
        </div>
        <Link
          to="/students/register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Student
        </Link>
      </div>

      {/* Student List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li key={student._id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <Link
                      to={`/students/${student._id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {student.firstName} {student.lastName}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      Roll No: {student.rollNumber} | Class: {student.currentClass?.name} {student.section}
                    </p>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0">
                    <div className="flex space-x-4">
                      <Link
                        to={`/students/${student._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/students/${student._id}/id-card`}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaIdCard className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/students/${student._id}/transfer-certificate`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaFileAlt className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing {students.length} of {total} results
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={students.length < filters.limit}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
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