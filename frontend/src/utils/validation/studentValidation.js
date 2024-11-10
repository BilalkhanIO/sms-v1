export const validateStudentForm = (values) => {
  const errors = {};

  if (!values.firstName) errors.firstName = 'First name is required';
  if (!values.lastName) errors.lastName = 'Last name is required';
  if (!values.rollNumber) errors.rollNumber = 'Roll number is required';
  if (!values.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!values.gender) errors.gender = 'Gender is required';
  if (!values.bloodGroup) errors.bloodGroup = 'Blood group is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  // Add more validations...

  return errors;
}; 