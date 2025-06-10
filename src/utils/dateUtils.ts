export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  return date.toLocaleDateString('zh-TW', options);
};

export const getNextTwoWeeks = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

export const isEditDeleteAllowed = (appointmentDate: string): boolean => {
  const now = new Date();
  const appointment = new Date(appointmentDate);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  // Check if appointment is tomorrow and current time is after 9 PM
  if (
    appointment.toDateString() === tomorrow.toDateString() &&
    now.getHours() >= 21
  ) {
    return false;
  }
  
  return true;
};

export const validateIdNumber = (id: string): boolean => {
  // Taiwan ID number validation
  const regex = /^[A-Z][12][0-9]{8}$/;
  return regex.test(id);
};