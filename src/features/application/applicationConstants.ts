export const APPLICATION_STATUS = {
  PENDING_L0: 'PENDING_L0',
  PENDING_L1: 'PENDING_L1',
  PENDING_L2: 'PENDING_L2',
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

export const APP_STATUS_COLORS: Record<string, "warning" | "success" | "error" | "default" | "primary" | "secondary" | "info"> = {
  PENDING_L0: 'warning',
  PENDING_L1: 'info',
  PENDING_L2: 'primary',
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
