import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

interface ApprovalActionDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  actionText: string; // e.g., "Approve", "Reject", "Add Check"
  onSubmit: (reason: string) => void;
  isLoading: boolean;
  inputLabel?: string;
  isReject?: boolean;
}

export default function ApprovalActionDialog({ 
  open, 
  onClose, 
  title, 
  actionText, 
  onSubmit, 
  isLoading,
  inputLabel = "Comments (Optional)",
  isReject = false
}: ApprovalActionDialogProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: isReject ? '#ef4444' : '#002147' }}>
        {title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {isReject 
              ? "Please provide a reason for rejecting this request." 
              : "You can add optional comments or details regarding this action."}
          </Typography>
          <TextField
            autoFocus
            label={inputLabel}
            fullWidth
            multiline
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required={isReject}
            error={isReject && !inputValue.trim()}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color={isReject ? 'error' : 'primary'}
            disabled={isLoading || (isReject && !inputValue.trim())}
            sx={{ bgcolor: isReject ? '#ef4444' : '#002147', '&:hover': { bgcolor: isReject ? '#dc2626' : '#001529' } }}
          >
            {isLoading ? 'Processing...' : actionText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
