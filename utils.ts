
import { Language } from './types';

export const calculateAge = (hatchDate: string, lang: Language) => {
  const birthDate = new Date(hatchDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} ${lang === 'en' ? 'days' : 'दिवस'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${lang === 'en' ? 'months' : 'महिने'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${lang === 'en' ? 'years' : 'वर्षे'}`;
  }
};

export const formatCurrency = (amount: number, lang: Language) => {
  return `${lang === 'en' ? '₹' : '₹'}${amount.toLocaleString()}`;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getMonthName = (date: Date, lang: Language) => {
  return date.toLocaleString(lang === 'en' ? 'en-US' : 'mr-IN', { month: 'long' });
};
