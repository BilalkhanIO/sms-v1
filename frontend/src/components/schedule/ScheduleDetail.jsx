import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleById } from '../../redux/features/scheduleSlice';
import { 
  DownloadIcon, 
  PrinterIcon, 
  DocumentIcon 
} from '@heroicons/react/outline';
import ScheduleGrid from './ScheduleGrid';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { exportScheduleToPDF, exportScheduleToExcel, printSchedule } from '../../utils/scheduleExport';

const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const { selectedSchedule, loading, error } = useSelector(state => state.schedule);
  const [view, setView] = useState('grid'); // grid, list

  useEffect(() => {
    if (scheduleId) {
      dispatch(fetchScheduleById(scheduleId));
    }
  }, [dispatch, scheduleId]);

  const handleExportPDF = () => {
    const doc = exportScheduleToPDF(selectedSchedule);
    doc.save(`${selectedSchedule.className}_schedule.pdf`);
  };

  const handleExportExcel = () => {
    const wb = exportScheduleToExcel(selectedSchedule);
    XLSX.writeFile(wb, `${selectedSchedule.className}_schedule.xlsx`);
  };

  const handlePrint = () => {
    printSchedule(selectedSchedule);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedSchedule) return <ErrorMessage message="Schedule not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedSchedule.className} Schedule
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSchedule.academicYear} - {selectedSchedule.term}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentIcon className="h-5 w-5 mr-2 text-gray-500" />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DownloadIcon className="h-5 w-5 mr-2 text-gray-500" />
              Excel
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="h-5 w-5 mr-2 text-gray-500" />
              Print
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('grid')}
              className={`${
                view === 'grid'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Grid View
            </button>
            <button
              onClick={() => setView('list')}
              className={`${
                view === 'list'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              List View
            </button>
          </nav>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {view === 'grid' ? (
          <ScheduleGrid scheduleId={scheduleId} />
        ) : (
          <ScheduleListView schedule={selectedSchedule} />
        )}
      </div>
    </div>
  );
};

export default ScheduleDetail;
