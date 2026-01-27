export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const APPLICATION_TYPE = {
  LEAVE: 'LEAVE',
  EQUIPMENT: 'EQUIPMENT',
  EVENT_PROPOSAL: 'EVENT_PROPOSAL',
  NOC: 'NOC',
  GENERAL: 'GENERAL',
};

export const APP_STATUS_COLORS: Record<string, string> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

export const APP_TYPE_LABELS: Record<string, string> = {
  LEAVE: 'Leave Request',
  EQUIPMENT: 'Equipment Request',
  EVENT_PROPOSAL: 'Event Proposal',
  NOC: 'NOC Request',
  GENERAL: 'General Application',
};
