import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSubjects, deleteSubject } from '../../redux/features/subjectSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import { 
  PencilIcon, 
  TrashIcon, 
  AcademicCapIcon,
  SearchIcon 
} from '@heroicons/react/outline';

const SubjectList = () => {
  const dispatch = useDispatch();
  const { subjects, loading, error } = useSelector((state) => state.subject);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchSubjects(filters));
  }, [dispatch, filters]);

  const handleDelete = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSubject(selectedSubject.id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
          
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Grades</option>
            {/* Add grade options */}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <Link
          to="/subjects/create"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Create Subject
        </Link>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {subject.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Code: {subject.code}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    subject.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {subject.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">{subject.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Teacher: {subject.teacher.name}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Credits: {subject.credits}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  to={`/subjects/${subject.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <AcademicCapIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/subjects/${subject.id}/edit`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(subject)}
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
        title="Delete Subject"
        message={`Are you sure you want to delete ${selectedSubject?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SubjectList;
