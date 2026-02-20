import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateTime = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatTime = (date, formatStr = 'HH:mm') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  const dollars = amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};

export const formatOrderStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  return `#${orderNumber}`;
};


export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return '0.0';
  return Number(rating).toFixed(1);
};