import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById } from '../../redux/features/studentSlice';
import { generateIDCard } from '../../utils/documentGenerators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import QRCode from 'qrcode.react';

const StudentIDCardPage = () => {
  const { studentId } = useParams();
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardDesign, setCardDesign] = useState('default'); // default, modern, minimal

  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector((state) => state.student);
  const schoolInfo = useSelector((state) => state.settings.schoolInfo);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId]);

  const handleGenerateCard = async () => {
    try {
      setIsGenerating(true);
      await generateIDCard(cardRef.current, selectedStudent, schoolInfo);
    } catch (error) {
      console.error('Error generating ID card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Student ID Card
          </h1>
          <div className="flex space-x-4">
            <select
              value={cardDesign}
              onChange={(e) => setCardDesign(e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="default">Default Design</option>
              <option value="modern">Modern Design</option>
              <option value="minimal">Minimal Design</option>
            </select>
            <button
              onClick={handleGenerateCard}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isGenerating ? 'Generating...' : 'Download ID Card'}
            </button>
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div
              ref={cardRef}
              className={`w-[600px] h-[375px] mx-auto relative ${
                cardDesign === 'modern'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  : cardDesign === 'minimal'
                  ? 'bg-gray-50'
                  : 'bg-white'
              } rounded-lg shadow-lg overflow-hidden`}
            >
              {/* School Header */}
              <div className="px-6 py-4 text-center">
                <img
                  src={schoolInfo.logo}
                  alt="School Logo"
                  className="h-16 mx-auto mb-2"
                />
                <h2 className={`text-xl font-bold ${
                  cardDesign === 'modern' ? 'text-white' : 'text-gray-900'
                }`}>
                  {schoolInfo.name}
                </h2>
                <p className={`text-sm ${
                  cardDesign === 'modern' ? 'text-white' : 'text-gray-600'
                }`}>
                  {schoolInfo.address}
                </p>
              </div>

              {/* Student Information */}
              <div className="px-6 py-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <img
                    src={selectedStudent.photo}
                    alt="Student"
                    className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className={`space-y-2 ${
                  cardDesign === 'modern' ? 'text-white' : 'text-gray-900'
                }`}>
                  <p className="font-bold text-lg">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p>Roll No: {selectedStudent.rollNumber}</p>
                  <p>Class: {selectedStudent.class}</p>
                  <p>Section: {selectedStudent.section}</p>
                  <p>Blood Group: {selectedStudent.bloodGroup}</p>
                </div>
              </div>

              {/* QR Code and Validity */}
              <div className="absolute bottom-4 right-4">
                <QRCode
                  value={`${window.location.origin}/student/${selectedStudent.id}`}
                  size={64}
                  level="H"
                  includeMargin={true}
                  renderAs="svg"
                />
              </div>
              <div className={`absolute bottom-4 left-4 text-sm ${
                cardDesign === 'modern' ? 'text-white' : 'text-gray-600'
              }`}>
                <p>Valid until: {new Date(selectedStudent.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                ID Card Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This ID card serves as the official identification for the student within the school premises.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                {/* Add any additional fields or settings */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIDCardPage; 