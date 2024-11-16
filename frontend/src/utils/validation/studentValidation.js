import { BLOOD_GROUPS, GENDER_OPTIONS } from '../constants/student';

export const validateStudentForm = (data) => {
  const errors = {};

  // Personal Information
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 4 || age > 20) {
      errors.dateOfBirth = 'Student age must be between 4 and 20 years';
    }
  }

  if (!data.gender) {
    errors.gender = 'Gender is required';
  } else if (!GENDER_OPTIONS.map(g => g.value).includes(data.gender)) {
    errors.gender = 'Invalid gender selection';
  }

  if (data.bloodGroup && !BLOOD_GROUPS.includes(data.bloodGroup)) {
    errors.bloodGroup = 'Invalid blood group';
  }

  // Contact Information
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number';
  }

  // Address Validation
  if (data.address) {
    if (!data.address.street?.trim()) {
      errors.street = 'Street address is required';
    }
    if (!data.address.city?.trim()) {
      errors.city = 'City is required';
    }
    if (!data.address.state?.trim()) {
      errors.state = 'State is required';
    }
    if (!data.address.country?.trim()) {
      errors.country = 'Country is required';
    }
    if (!data.address.postalCode?.trim()) {
      errors.postalCode = 'Postal code is required';
    }
  }

  // Guardian Information
  if (!data.guardianInfo?.name?.trim()) {
    errors.guardianName = 'Guardian name is required';
  }

  if (!data.guardianInfo?.relationship?.trim()) {
    errors.guardianRelationship = 'Guardian relationship is required';
  }

  if (!data.guardianInfo?.phone?.trim()) {
    errors.guardianPhone = 'Guardian phone is required';
  } else if (!/^\+?[\d\s-]{10,}$/.test(data.guardianInfo.phone)) {
    errors.guardianPhone = 'Invalid guardian phone number';
  }

  if (data.guardianInfo?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guardianInfo.email)) {
    errors.guardianEmail = 'Invalid guardian email address';
  }

  // Academic Information
  if (!data.academicInfo?.class?.trim()) {
    errors.class = 'Class is required';
  }

  if (!data.academicInfo?.section?.trim()) {
    errors.section = 'Section is required';
  }

  if (!data.academicInfo?.rollNumber?.trim()) {
    errors.rollNumber = 'Roll number is required';
  }

  // Document Validation
  if (!data.documents?.photo) {
    errors.photo = 'Student photo is required';
  }

  if (!data.documents?.birthCertificate) {
    errors.birthCertificate = 'Birth certificate is required';
  }

  return errors;
};

export const validateStudentDocuments = (files) => {
  const errors = {};
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedDocTypes = ['application/pdf', ...allowedImageTypes];

  Object.entries(files).forEach(([key, file]) => {
    if (file) {
      if (key === 'photo' && !allowedImageTypes.includes(file.type)) {
        errors[key] = 'Only JPG, JPEG, and PNG images are allowed';
      } else if (key !== 'photo' && !allowedDocTypes.includes(file.type)) {
        errors[key] = 'Only PDF, JPG, JPEG, and PNG files are allowed';
      }

      if (file.size > maxSize) {
        errors[key] = 'File size should not exceed 5MB';
      }
    }
  });

  return errors;
};
