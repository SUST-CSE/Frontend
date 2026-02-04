import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { LucideUpload, LucideX } from 'lucide-react';
import { useCreateCostRequestMutation } from '@/features/finance/financeApi';
import { toast } from 'sonner';

interface CreateCostDialogProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInput {
  title: string;
  description: string;
  amount: number;
}

export default function CreateCostDialog({ open, onClose }: CreateCostDialogProps) {
  const [createCostRequest, { isLoading }] = useCreateCostRequestMutation();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: IFormInput) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('amount', data.amount.toString());
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await createCostRequest(formData).unwrap();
      toast.success('Cost request submitted successfully');
      reset();
      setFiles([]);
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to submit cost request');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#002147' }}>Submit Cost Request</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Expense Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            
            <Controller
              name="amount"
              control={control}
              rules={{ 
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estimated Amount (BDT)"
                  type="number"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Detailed Description"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Explain why this cost is necessary..."
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Attachments (Images / PDFs)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<LucideUpload size={18} />}
                fullWidth
                sx={{ mb: 2, borderStyle: 'dashed' }}
              >
                Upload Files
                <input type="file" hidden multiple onChange={handleFileChange} accept="image/*,application/pdf" />
              </Button>
              
              <Stack spacing={1}>
                {files.map((file, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid #e2e8f0',
                      borderRadius: 1,
                      bgcolor: '#f8fafc'
                    }}
                  >
                    <Typography variant="caption" noWrap sx={{ maxWidth: '80%' }}>
                      {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </Typography>
                    <IconButton size="small" onClick={() => removeFile(index)} color="error">
                      <LucideX size={14} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{ bgcolor: '#002147' }}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
