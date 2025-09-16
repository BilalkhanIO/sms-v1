// src/pages/classes/ClassList.jsx
import { Link } from 'react-router-dom';
import { useGetClassesQuery } from '../../api/classesApi';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ClassList() {
  const { data: classes, isLoading, error } = useGetClassesQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Classes</h2>
          <Link to="/classes/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Class
          </Link>
        </div>

        {classes?.length === 0 ? (
            <p>No classes found.</p> // Display message if no classes
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes?.map((cls) => (
                  <Link
                      key={cls._id}
                      to={`/classes/${cls._id}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col" // Added flex flex-col
                  >
                    <div className="flex justify-between items-start flex-grow"> {/* Added flex-grow */}
                      <div>
                        <h3 className="text-lg font-semibold">{cls?.name}</h3>
                        <p className="text-gray-600">{cls.section}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {cls.academicYear}
                </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Class Teacher: {cls.classTeacher?.user?.firstName || 'Not assigned'} {cls.classTeacher?.user?.lastName || ''}</p>
                      <p>Subjects: {cls.subjects?.map(s => s.subject?.name).join(', ') || 'Not assigned'}</p> {/* Display subjects */}
                      <p>Students: {cls.students?.length || 0}</p>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}