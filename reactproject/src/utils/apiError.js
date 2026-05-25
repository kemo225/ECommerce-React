const STATUS_MESSAGES = {
  400: 'Bad request. Please verify your input and try again.',
  401: 'Unauthorized request. Please login again.',
  404: 'Requested resource was not found.',
};

const collectValidationErrors = (errors) => {
  if (!errors) {
    return '';
  }

  if (Array.isArray(errors)) {
    return errors.filter(Boolean).join(', ');
  }

  if (typeof errors === 'object') {
    const entries = Object.values(errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean);

    return entries.join(', ');
  }

  return '';
};

export const extractApiErrorMessage = (
  error,
  fallbackMessage = 'Something went wrong. Please try again.'
) => {
  const responseData = error?.response?.data;
  const status = error?.response?.status;

  const directMessage = responseData?.message || responseData?.error || responseData?.title;
  if (typeof directMessage === 'string' && directMessage.trim()) {
    return directMessage.trim();
  }

  const validationMessage = collectValidationErrors(responseData?.errors);
  if (validationMessage) {
    return validationMessage;
  }

  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};

