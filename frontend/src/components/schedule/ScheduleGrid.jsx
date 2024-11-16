import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePeriod, addPeriod, deletePeriod } from '../../redux/features/scheduleSlice';
import { DAYS_OF_WEEK, DEFAULT_TIME_SLOTS, PERIOD_COLORS } from '../../constants/schedule';
import { detectTimeConflicts } from '../../utils/scheduleUtils';
import PeriodModal from './PeriodModal';
import ConfirmDialog from '../common/ConfirmDialog';

const ScheduleGrid = ({ scheduleId, readOnly = false }) => {
  const dispatch = useDispatch();
  const { selectedSchedule } = useSelector((state) => state.schedule);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellClick = (day, timeSlot) => {
    if (readOnly) return;

    const existingPeriod = selectedSchedule?.periods.find(
      p => p.day === day && p.startTime === timeSlot.startTime
    );

    if (existingPeriod) {
      setSelectedPeriod(existingPeriod);
    } else {
      setSelectedCell({ day, timeSlot });
    }
    setShowPeriodModal(true);
  };

  const handlePeriodSubmit = async (periodData) => {
    try {
      if (selectedPeriod) {
        await dispatch(updatePeriod({
          scheduleId,
          periodId: selectedPeriod.id,
          periodData
        })).unwrap();
      } else {
        await dispatch(addPeriod({
          scheduleId,
          periodData: {
            ...periodData,
            day: selectedCell.day,
            startTime: selectedCell.timeSlot.startTime,
            endTime: selectedCell.timeSlot.endTime
          }
        })).unwrap();
      }
      setShowPeriodModal(false);
      setSelectedPeriod(null);
      setSelectedCell(null);
    } catch (error) {
      console.error('Failed to save period:', error);
    }
  };

  const handlePeriodDelete = async () => {
    try {
      await dispatch(deletePeriod({
        scheduleId,
        periodId: selectedPeriod.id
      })).unwrap();
      setShowDeleteDialog(false);
      setSelectedPeriod(null);
    } catch (error) {
      console.error('Failed to delete period:', error);
    }
  };

  const getPeriodForCell = (day, timeSlot) => {
    return selectedSchedule?.periods.find(
      p => p.day === day && p.startTime === timeSlot.startTime
    );
  };

  const getCellClassName = (day, timeSlot) => {
    if (timeSlot.isBreak) {
      return PERIOD_COLORS.BREAK;
    }

    const period = getPeriodForCell(day, timeSlot);
    if (!period) return '';

    const hasConflict = detectTimeConflicts(
      selectedSchedule.periods,
      period
    );

    return hasConflict ? PERIOD_COLORS.CONFLICT : PERIOD_COLORS.DEFAULT;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            {DAYS_OF_WEEK.map((day) => (
              <th
                key={day}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {DEFAULT_TIME_SLOTS.map((timeSlot) => (
            <tr key={timeSlot.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {timeSlot.startTime} - {timeSlot.endTime}
                {timeSlot.isBreak && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({timeSlot.breakName})
                  </span>
                )}
              </td>
              {DAYS_OF_WEEK.map((day) => {
                const period = getPeriodForCell(day, timeSlot);
                return (
                  <td
                    key={`${day}-${timeSlot.id}`}
                    className={`px-6 py-4 whitespace-nowrap ${
                      !timeSlot.isBreak && !readOnly ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={() => !timeSlot.isBreak && handleCellClick(day, timeSlot)}
                  >
                    {period ? (
                      <div className={`p-2 rounded ${getCellClassName(day, timeSlot)}`}>
                        <div className="text-sm font-medium">
                          {period.subject.name}
                        </div>
                        <div className="text-xs">
                          {period.teacher.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Room: {period.room}
                        </div>
                      </div>
                    ) : timeSlot.isBreak ? (
                      <div className="text-xs text-gray-400 italic">
                        Break
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Period Modal */}
      {showPeriodModal && (
        <PeriodModal
          isOpen={showPeriodModal}
          onClose={() => {
            setShowPeriodModal(false);
            setSelectedPeriod(null);
            setSelectedCell(null);
          }}
          onSubmit={handlePeriodSubmit}
          onDelete={() => {
            setShowPeriodModal(false);
            setShowDeleteDialog(true);
          }}
          period={selectedPeriod}
          timeSlot={selectedCell?.timeSlot}
          day={selectedCell?.day}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handlePeriodDelete}
        title="Delete Period"
        message="Are you sure you want to delete this period? This action cannot be undone."
      />
    </div>
  );
};

export default ScheduleGrid;
