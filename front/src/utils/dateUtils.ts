/**
 * Formate une date en format relatif (il y a X h/j) ou absolu
 */
export const formatRelativeDate = (date: Date | string | null): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'À l\'instant';
  } else if (diffInHours < 24) {
    return `il y a ${diffInHours}h`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `il y a ${days}j`;
  } else if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7));
    return `il y a ${weeks} sem.`;
  } else {
    return dateObj.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};