export const TRANSACTION_TYPE = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

export const TRANSACTION_CATEGORY: Record<string, string> = {
  SOCIETY_FUND: 'Society Fund',
  EVENT_SPONSORSHIP: 'Event Sponsorship',
  EQUIPMENT_PURCHASE: 'Equipment Purchase',
  MAINTENANCE: 'Maintenance',
  REFRESHMENT: 'Refreshment',
  OTHERS: 'Others',
};

export const TX_TYPE_COLORS: Record<string, "success" | "error" | "warning" | "info" | "primary" | "secondary" | "default"> = {
  INCOME: 'success',
  EXPENSE: 'error',
};
