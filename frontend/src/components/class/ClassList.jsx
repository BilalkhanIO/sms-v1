import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchClasses, deleteClass } from '../../redux/features/classSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import { PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/outline';

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.class);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchClasses(filters));
  }, [dispatch, filters]);

  const handleDelete = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteClass(selectedClass.id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search classes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Grades</option>
            {/* Add grade options */}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <Link
          to="/classes/create"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Create Class
        </Link>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {classItem.name} - {classItem.section}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Grade: {classItem.grade}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    classItem.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {classItem.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {classItem.currentStrength} / {classItem.capacity} Students
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Teacher: {classItem.teacher.name}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  to={`/classes/${classItem.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(classItem)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedClass?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ClassList;
