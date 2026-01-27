export const WORK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
};

export const WORK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const WORK_VISIBILITY = {
  PUBLIC_TO_SOCIETY: 'PUBLIC_TO_SOCIETY',
  ADMIN_ONLY: 'ADMIN_ONLY',
};

export const STATUS_COLORS: Record<string, any> = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'default',
  OVERDUE: 'error',
};

export const PRIORITY_COLORS: Record<string, any> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'error',
};
