// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Usage in components:
  {status === 'loading' && <LoadingSpinner />}