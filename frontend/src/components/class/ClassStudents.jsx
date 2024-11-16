import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, removeStudent } from '../../redux/features/classSlice';
import { fetchStudents } from '../../redux/features/studentSlice';
import { PlusIcon, UserRemoveIcon } from '@heroicons/react/outline';
import ConfirmDialog from '../common/ConfirmDialog';

const ClassStudents = ({ classId }) => {
  const dispatch = useDispatch();
  const { selectedClass } = useSelector((state) => state.class);
  const { students } = useSelector((state) => state.student);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStudents({ status: 'ACTIVE' }));
  }, [dispatch]);

  const handleAddStudent = async (studentId) => {
    try {
      await dispatch(addStudent({ classId, studentId })).unwrap();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleRemoveStudent = async () => {
    try {
      await dispatch(removeStudent({ 
        classId, 
        studentId: selectedStudent.id 
      })).unwrap();
      setShowRemoveDialog(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to remove student:', error);
    }
  };

  const filteredStudents = students.filter(student => 
    !selectedClass.students.find(s => s.id === student.id) &&
    (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Current Students */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Current Students ({selectedClass.students.length})
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Student
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {selectedClass.students.map((student) => (
              <li key={student.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
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
                        Roll Number: {student.rollNumber}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowRemoveDialog(true);
                    }}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-50"
                  >
                    <UserRemoveIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student</h3>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <li
                    key={student.id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddStudent(student.id)}
                  >
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={student.avatar || '/default-avatar.png'}
                        alt=""
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Roll Number: {student.rollNumber}
                        </p>
                      </div>
                    </div>
                    <PlusIcon className="h-5 w-5 text-gray-400" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Student Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleRemoveStudent}
        title="Remove Student"
        message={`Are you sure you want to remove ${selectedStudent?.firstName} ${selectedStudent?.lastName} from this class?`}
      />
    </div>
  );
};

export default ClassStudents;
