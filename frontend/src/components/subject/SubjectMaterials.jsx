import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadMaterial } from '../../redux/features/subjectSlice';
import { 
  DocumentIcon, 
  VideoCameraIcon, 
  LinkIcon, 
  UploadIcon,
  TrashIcon,
  DownloadIcon 
} from '@heroicons/react/outline';
import ConfirmDialog from '../common/ConfirmDialog';

const SubjectMaterials = ({ subjectId }) => {
  const dispatch = useDispatch();
  const { selectedSubject } = useSelector((state) => state.subject);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    type: 'DOCUMENT',
    file: null,
    url: ''
  });

  const getIcon = (type) => {
    switch (type) {
      case 'DOCUMENT':
        return <DocumentIcon className="h-6 w-6" />;
      case 'VIDEO':
        return <VideoCameraIcon className="h-6 w-6" />;
      case 'LINK':
        return <LinkIcon className="h-6 w-6" />;
      default:
        return <DocumentIcon className="h-6 w-6" />;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('type', uploadData.type);
      if (uploadData.file) {
        formData.append('file', uploadData.file);
      }
      if (uploadData.url) {
        formData.append('url', uploadData.url);
      }

      await dispatch(uploadMaterial({ 
        subjectId, 
        materialData: formData 
      })).unwrap();
      
      setShowUploadModal(false);
      setUploadData({
        title: '',
        type: 'DOCUMENT',
        file: null,
        url: ''
      });
    } catch (error) {
      console.error('Failed to upload material:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Implement delete functionality
      setShowDeleteDialog(false);
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Learning Materials
        </h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UploadIcon className="h-5 w-5 mr-2" />
          Upload Material
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedSubject?.materials?.map((material) => (
          <div
            key={material.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-500">
                  {getIcon(material.type)}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {material.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Uploaded {new Date(material.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(material.url, '_blank')}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMaterial(material);
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload Material
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="DOCUMENT">Document</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">Link</option>
                </select>
              </div>

              {uploadData.type === 'LINK' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL
                  </label>
                  <input
                    type="url"
                    value={uploadData.url}
                    onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedMaterial(null);
        }}
        onConfirm={handleDelete}
        title="Delete Material"
        message={`Are you sure you want to delete "${selectedMaterial?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default SubjectMaterials;
