const FileUpload = ({ label, accept, onChange, error }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload; 