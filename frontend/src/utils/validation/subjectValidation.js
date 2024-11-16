export const validateSubjectData = (data) => {
  const errors = {};

  // Basic validation
  if (!data.name?.trim()) {
    errors.name = 'Subject name is required';
  }

  if (!data.code?.trim()) {
    errors.code = 'Subject code is required';
  } else if (!/^[A-Z0-9]{2,8}$/.test(data.code)) {
    errors.code = 'Subject code must be 2-8 uppercase letters/numbers';
  }

  if (!data.credits || data.credits < 0) {
    errors.credits = 'Credits must be a positive number';
  }

  if (!data.grade?.trim()) {
    errors.grade = 'Grade is required';
  }

  if (!data.teacherId) {
    errors.teacherId = 'Teacher assignment is required';
  }

  // Syllabus validation
  if (data.syllabus && data.syllabus.length < 50) {
    errors.syllabus = 'Syllabus should be at least 50 characters';
  }

  return errors;
};

export const validateMaterial = (data) => {
  const errors = {};
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  if (!data.title?.trim()) {
    errors.title = 'Material title is required';
  }

  if (data.type === 'LINK') {
    if (!data.url) {
      errors.url = 'URL is required for link materials';
    } else {
      try {
        new URL(data.url);
      } catch {
        errors.url = 'Invalid URL format';
      }
    }
  } else {
    if (!data.file) {
      errors.file = 'File is required';
    } else if (data.file.size > MAX_FILE_SIZE) {
      errors.file = 'File size should not exceed 10MB';
    }

    // Validate file types
    if (data.type === 'DOCUMENT') {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(data.file.type)) {
        errors.file = 'Only PDF and Word documents are allowed';
      }
    } else if (data.type === 'VIDEO') {
      const allowedTypes = ['video/mp4', 'video/webm'];
      if (!allowedTypes.includes(data.file.type)) {
        errors.file = 'Only MP4 and WebM videos are allowed';
      }
    }
  }

  return errors;
};
