import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, removeSubject } from '../../redux/features/classSlice';
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/outline';
import ConfirmDialog from '../common/ConfirmDialog';

const ClassSubjects = ({ classId }) => {
  const dispatch = useDispatch();
  const { selectedClass } = useSelector((state) => state.class);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    teacherId: '',
    description: '',
  });

  const handleAddSubject = async () => {
    try {
      await dispatch(addSubject({ 
        classId, 
        subjectData: newSubject 
      })).unwrap();
      setShowAddModal(false);
      setNewSubject({
        name: '',
        code: '',
        teacherId: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to add subject:', error);
    }
  };

  const handleRemoveSubject = async () => {
    try {
      await dispatch(removeSubject({ 
        classId, 
        subjectId: selectedSubject.id 
      })).unwrap();
      setShowRemoveDialog(false);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Failed to remove subject:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subjects List */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Subjects ({selectedClass.subjects.length})
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selectedClass.subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {subject.code}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {subject.name}
                    </dd>
                  </dl>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => {
                      setSelectedSubject(subject);
                      setShowRemoveDialog(true);
                    }}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{subject.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Teacher: {subject.teacher.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Subject</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, code: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teacher
                </label>
                <select
                  value={newSubject.teacherId}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, teacherId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Teacher</option>
                  {/* Add teacher options */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Subject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setSelectedSubject(null);
        }}
        onConfirm={handleRemoveSubject}
        title="Remove Subject"
        message={`Are you sure you want to remove ${selectedSubject?.name} from this class?`}
      />
    </div>
  );
};

export default ClassSubjects;
