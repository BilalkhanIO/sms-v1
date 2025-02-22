// src/pages/teachers/TeacherDetails.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetTeacherByIdQuery } from '../../api/teacherApi'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import PageHeader from '../../components/common/PageHeader'

const TeacherDetails = () => {
  const { id } = useParams()
  const { data: teacher, isLoading, error } = useGetTeacherByIdQuery(id)

  if (isLoading) {
    return <Spinner size="large" />
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Teacher Details" backUrl="/teachers">
        <Link to={`/teachers/${id}/edit`}>
          <Button>Edit Teacher</Button>
        </Link>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Name</h3>
            <p className="text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Email</h3>
            <p className="text-gray-900">{teacher.email}</p>
          </div>

          <div>
            <h3 className="text-gray-600 text-sm font-medium">Phone</h3>
            <p className="text-gray-900">{teacher.phone || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 text-sm font-medium">Subject</h3>
            <p className="text-gray-900">{teacher.subject || 'N/A'}</p>
          </div>
        </div>

        {teacher.classes && teacher.classes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Classes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {teacher.classes.map((cls) => (
                  <li key={cls.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{cls.name}</span>
                    <Link
                      to={`/classes/${cls.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Class
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDetails