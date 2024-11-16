import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/outline';

const StudentListItem = ({ student, onDelete }) => {
  return (
    <tr>
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
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/students/${student._id}/edit`}
            className="text-blue-600 hover:text-blue-900"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentListItem; 