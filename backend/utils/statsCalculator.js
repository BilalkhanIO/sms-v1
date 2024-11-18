// Create a new utility file for statistics calculations

const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Exam = require('../models/Exam');
const Activity = require('../models/Activity');

class StatsCalculator {
  static async calculateFeeStats() {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const feeRecords = await Fee.find({
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: currentDate
        }
      });

      const total = feeRecords.reduce((acc, fee) => acc + (fee.paidAmount || 0), 0);
      const pending = feeRecords.reduce((acc, fee) => {
        const pendingAmount = fee.amount - (fee.paidAmount || 0);
        return acc + (pendingAmount > 0 ? pendingAmount : 0);
      }, 0);

      const thisMonth = feeRecords
        .filter(fee => {
          const feeMonth = new Date(fee.paidDate).getMonth() + 1;
          const feeYear = new Date(fee.paidDate).getFullYear();
          return feeMonth === currentMonth && feeYear === currentYear;
        })
        .reduce((acc, fee) => acc + (fee.paidAmount || 0), 0);

      const rate = total > 0 ? ((total / (total + pending)) * 100).toFixed(2) : 0;

      return { total, pending, thisMonth, rate: parseFloat(rate) };
    } catch (error) {
      console.error('Fee stats calculation error:', error);
      return { total: 0, pending: 0, thisMonth: 0, rate: 0 };
    }
  }

  static async calculateAttendanceStats() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const attendance = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      const total = attendance.length;
      const present = attendance.filter(a => a.status === 'PRESENT').length;
      const absent = attendance.filter(a => a.status === 'ABSENT').length;
      const late = attendance.filter(a => a.status === 'LATE').length;

      return {
        total,
        present,
        absent,
        late,
        rate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Attendance stats calculation error:', error);
      return { total: 0, present: 0, absent: 0, late: 0, rate: 0 };
    }
  }

  static async calculatePerformanceStats() {
    try {
      const examResults = await Exam.find({ status: 'COMPLETED' })
        .populate('results');

      let totalScore = 0;
      let totalStudents = 0;

      examResults.forEach(exam => {
        exam.results.forEach(result => {
          totalScore += (result.marksObtained / exam.totalMarks) * 100;
          totalStudents++;
        });
      });

      return {
        averagePerformance: totalStudents > 0 ? parseFloat((totalScore / totalStudents).toFixed(2)) : 0,
        totalExams: examResults.length,
        totalParticipants: totalStudents
      };
    } catch (error) {
      console.error('Performance stats calculation error:', error);
      return { averagePerformance: 0, totalExams: 0, totalParticipants: 0 };
    }
  }

  static async getRecentActivities(limit = 10) {
    try {
      return await Activity.find()
        .sort('-createdAt')
        .limit(limit)
        .populate('user', 'name role');
    } catch (error) {
      console.error('Recent activities fetch error:', error);
      return [];
    }
  }
}

module.exports = StatsCalculator;