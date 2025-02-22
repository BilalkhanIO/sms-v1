import * as Yup from 'yup';

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// User validation schemas
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const userSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], 'Invalid role')
    .required('Role is required'),
  password: Yup.string()
    .when('$isCreating', {
      is: true,
      then: Yup.string()
        .matches(
          passwordRegExp,
          'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
        )
        .required('Password is required'),
    }),
  profilePicture: Yup.mixed()
    .test('fileSize', 'File too large', value => 
      !value || value.size <= 5000000
    )
    .test('fileFormat', 'Unsupported format', value =>
      !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    ),
});

// Teacher validation schemas
export const teacherSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  subject: Yup.string()
    .required('Subject is required'),
  qualifications: Yup.array()
    .of(
      Yup.object().shape({
        degree: Yup.string().required('Degree is required'),
        institution: Yup.string().required('Institution is required'),
        year: Yup.number()
          .min(1950, 'Year must be after 1950')
          .max(new Date().getFullYear(), 'Year cannot be in the future')
          .required('Year is required'),
      })
    ),
  documents: Yup.array()
    .of(
      Yup.mixed()
        .test('fileSize', 'File too large', value => 
          !value || value.size <= 5000000
        )
        .test('fileFormat', 'Unsupported format', value =>
          !value || ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type)
        )
    ),
});

// Student validation schemas
export const studentSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  rollNumber: Yup.string()
    .matches(/^[A-Z0-9]+$/, 'Roll number must contain only uppercase letters and numbers')
    .required('Roll number is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 25)), 'Student must be under 25 years old')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender')
    .required('Gender is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  contactNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
  }),
  parentName: Yup.string()
    .min(2, 'Parent name must be at least 2 characters')
    .max(100, 'Parent name must be less than 100 characters')
    .required('Parent name is required'),
  parentContact: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Parent contact is required'),
  parentEmail: Yup.string()
    .email('Invalid email address'),
  parentRelationship: Yup.string()
    .oneOf(['FATHER', 'MOTHER', 'GUARDIAN'], 'Invalid relationship')
    .required('Relationship is required'),
  documents: Yup.array()
    .of(
      Yup.mixed()
        .test('fileSize', 'File too large', value => 
          !value || value.size <= 5000000
        )
        .test('fileFormat', 'Unsupported format', value =>
          !value || ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type)
        )
    ),
});

// Class validation schemas
export const classSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Class name must be at least 2 characters')
    .max(50, 'Class name must be less than 50 characters')
    .required('Class name is required'),
  section: Yup.string()
    .matches(/^[A-Z]$/, 'Section must be a single uppercase letter')
    .required('Section is required'),
  academicYear: Yup.string()
    .matches(/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY')
    .test('valid-year-range', 'Invalid year range', value => {
      if (!value) return true;
      const [start, end] = value.split('-').map(Number);
      return end === start + 1;
    })
    .required('Academic year is required'),
  classTeacher: Yup.object()
    .shape({
      value: Yup.string().required('Class teacher is required'),
      label: Yup.string().required('Class teacher is required'),
    })
    .nullable()
    .required('Class teacher is required'),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        subject: Yup.object().shape({
          value: Yup.string().required('Subject is required'),
          label: Yup.string().required('Subject is required'),
        }),
        teacher: Yup.object().shape({
          value: Yup.string().required('Teacher is required'),
          label: Yup.string().required('Teacher is required'),
        }),
      })
    )
    .min(1, 'At least one subject is required'),
  schedule: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string()
          .oneOf(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 'Invalid day')
          .required('Day is required'),
        periods: Yup.array()
          .of(
            Yup.object().shape({
              subject: Yup.object().shape({
                value: Yup.string().required('Subject is required'),
                label: Yup.string().required('Subject is required'),
              }),
              teacher: Yup.object().shape({
                value: Yup.string().required('Teacher is required'),
                label: Yup.string().required('Teacher is required'),
              }),
              startTime: Yup.string()
                .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
                .required('Start time is required'),
              endTime: Yup.string()
                .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
                .required('End time is required')
                .test('is-after-start', 'End time must be after start time', function(value) {
                  const { startTime } = this.parent;
                  if (!startTime || !value) return true;
                  return value > startTime;
                }),
            })
          )
          .test('no-overlap', 'Periods cannot overlap', function(periods) {
            if (!periods) return true;
            const sortedPeriods = [...periods].sort((a, b) => a.startTime.localeCompare(b.startTime));
            for (let i = 1; i < sortedPeriods.length; i++) {
              if (sortedPeriods[i].startTime <= sortedPeriods[i-1].endTime) {
                return false;
              }
            }
            return true;
          }),
      })
    ),
});

// Calendar Event validation schema
export const calendarEventSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  startDate: Yup.date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  endDate: Yup.date()
    .min(
      Yup.ref('startDate'),
      'End date must be after start date'
    )
    .required('End date is required'),
  type: Yup.string()
    .oneOf(['EXAM', 'HOLIDAY', 'EVENT', 'MEETING'], 'Invalid event type')
    .required('Event type is required'),
  participants: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required('Participant ID is required'),
        label: Yup.string().required('Participant name is required'),
      })
    ),
  location: Yup.string()
    .max(100, 'Location must be less than 100 characters'),
  isAllDay: Yup.boolean(),
  recurrence: Yup.object().shape({
    frequency: Yup.string().oneOf(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']),
    interval: Yup.number().min(1),
    endDate: Yup.date().min(Yup.ref('startDate')),
  }),
});

// Fee validation schema
export const feeSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .required('Due date is required'),
  type: Yup.string()
    .oneOf(['TUITION', 'EXAM', 'TRANSPORT', 'LIBRARY', 'OTHER'], 'Invalid fee type')
    .required('Fee type is required'),
  class: Yup.object()
    .shape({
      value: Yup.string().required('Class is required'),
      label: Yup.string().required('Class is required'),
    })
    .nullable()
    .required('Class is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  isRecurring: Yup.boolean(),
  frequency: Yup.string()
    .when('isRecurring', {
      is: true,
      then: Yup.string()
        .oneOf(['MONTHLY', 'QUARTERLY', 'YEARLY'], 'Invalid frequency')
        .required('Frequency is required'),
    }),
  latePaymentFee: Yup.number()
    .min(0, 'Late payment fee cannot be negative'),
});

// Payment validation schema
export const paymentSchema = Yup.object().shape({
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  paymentDate: Yup.date()
    .max(new Date(), 'Payment date cannot be in the future')
    .required('Payment date is required'),
  paymentMethod: Yup.string()
    .oneOf(['CASH', 'CARD', 'BANK_TRANSFER', 'CHEQUE'], 'Invalid payment method')
    .required('Payment method is required'),
  transactionId: Yup.string()
    .when('paymentMethod', {
      is: (method) => method !== 'CASH',
      then: Yup.string().required('Transaction ID is required'),
    }),
  remarks: Yup.string()
    .max(200, 'Remarks must be less than 200 characters'),
});

// Exam validation schema
export const examSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  type: Yup.string()
    .oneOf(['UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL'], 'Invalid exam type')
    .required('Exam type is required'),
  subject: Yup.object()
    .shape({
      value: Yup.string().required('Subject is required'),
      label: Yup.string().required('Subject is required'),
    })
    .nullable()
    .required('Subject is required'),
  class: Yup.object()
    .shape({
      value: Yup.string().required('Class is required'),
      label: Yup.string().required('Class is required'),
    })
    .nullable()
    .required('Class is required'),
  date: Yup.date()
    .min(new Date(), 'Exam date cannot be in the past')
    .required('Exam date is required'),
  startTime: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .required('Start time is required'),
  duration: Yup.number()
    .positive('Duration must be positive')
    .required('Duration is required'),
  totalMarks: Yup.number()
    .positive('Total marks must be positive')
    .required('Total marks is required'),
  passingMarks: Yup.number()
    .positive('Passing marks must be positive')
    .max(Yup.ref('totalMarks'), 'Passing marks cannot be greater than total marks')
    .required('Passing marks is required'),
  instructions: Yup.string()
    .max(1000, 'Instructions must be less than 1000 characters'),
  syllabus: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one syllabus topic is required'),
});

// Exam Result validation schema
export const examResultSchema = Yup.object().shape({
  student: Yup.object()
    .shape({
      value: Yup.string().required('Student is required'),
      label: Yup.string().required('Student is required'),
    })
    .nullable()
    .required('Student is required'),
  marksObtained: Yup.number()
    .min(0, 'Marks cannot be negative')
    .max(Yup.ref('totalMarks'), 'Marks cannot exceed total marks')
    .required('Marks obtained is required'),
  remarks: Yup.string()
    .max(200, 'Remarks must be less than 200 characters'),
  isAbsent: Yup.boolean(),
  grade: Yup.string()
    .matches(/^[A-F][+-]?$/, 'Invalid grade format'),
  practicalMarks: Yup.number()
    .min(0, 'Practical marks cannot be negative')
    .when('hasPractical', {
      is: true,
      then: Yup.number().required('Practical marks are required'),
    }),
});

export const subjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name must be less than 100 characters')
    .required('Subject name is required'),
  code: Yup.string()
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must be less than 20 characters')
    .required('Subject code is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  grade: Yup.string()
    .required('Grade is required'),
  credits: Yup.number()
    .min(0, 'Credits must be a positive number')
    .max(20, 'Credits cannot exceed 20')
    .required('Credits is required'),
  teacherIds: Yup.array()
    .of(Yup.string())
    .min(0, 'At least one teacher must be assigned'),
}); 