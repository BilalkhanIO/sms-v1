import { PASSWORD_REQUIREMENTS } from '../../constants/user';

export const validateUser = (data) => {
  const errors = {};

  // Basic validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.role) {
    errors.role = 'Role is required';
  }

  // Phone number validation (if provided)
  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  // Password validation (for new users)
  if (data.password) {
    const passwordErrors = validatePassword(data.password);
    if (Object.keys(passwordErrors).length > 0) {
      errors.password = passwordErrors;
    }
  }

  return errors;
};

export const validateUserProfile = (data) => {
  const errors = {};

  // Basic validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  // Address validation (if provided)
  if (data.address) {
    const addressErrors = validateAddress(data.address);
    if (Object.keys(addressErrors).length > 0) {
      errors.address = addressErrors;
    }
  }

  // Emergency contact validation (if provided)
  if (data.emergencyContact) {
    const contactErrors = validateEmergencyContact(data.emergencyContact);
    if (Object.keys(contactErrors).length > 0) {
      errors.emergencyContact = contactErrors;
    }
  }

  return errors;
};

export const validatePassword = (password) => {
  const errors = {};

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.length = `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.uppercase = 'Password must contain at least one uppercase letter';
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.lowercase = 'Password must contain at least one lowercase letter';
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.numbers = 'Password must contain at least one number';
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    errors.special = 'Password must contain at least one special character';
  }

  return errors;
};

const validateAddress = (address) => {
  const errors = {};

  if (address.street && address.street.length < 5) {
    errors.street = 'Street address is too short';
  }

  if (address.city && address.city.length < 2) {
    errors.city = 'City name is too short';
  }

  if (address.state && address.state.length < 2) {
    errors.state = 'State name is too short';
  }

  if (address.postalCode && !isValidPostalCode(address.postalCode)) {
    errors.postalCode = 'Invalid postal code format';
  }

  return errors;
};

const validateEmergencyContact = (contact) => {
  const errors = {};

  if (!contact.name?.trim()) {
    errors.name = 'Contact name is required';
  }

  if (!contact.relationship?.trim()) {
    errors.relationship = 'Relationship is required';
  }

  if (!contact.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhoneNumber(contact.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  return errors;
};

// Helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone) => {
  return /^\+?[\d\s-]{10,}$/.test(phone);
};

const isValidPostalCode = (postalCode) => {
  // This is a basic validation - adjust based on your needs
  return /^[\d\w\s-]{3,10}$/.test(postalCode);
};
