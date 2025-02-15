// src/components/StudentList.jsx
import React from 'react';

export default function StudentList({ students, onRemove }) {
    return (
        <ul>
            {students?.map((student) => ( // Optional Chaining
                <li key={student._id} className="flex items-center justify-between py-2 border-b">
                    <span>{student?.user?.firstName} {student?.user?.lastName}</span> {/* Optional Chaining */}
                    <button
                        onClick={() => onRemove(student._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}


