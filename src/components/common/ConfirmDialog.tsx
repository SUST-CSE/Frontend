'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          disabled={isLoading}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          {isLoading ? 'Processing...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
