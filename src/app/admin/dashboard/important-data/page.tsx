'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import { 
  LucidePlus, 
  LucideTrash2, 
  LucideFileText, 
  LucideImage, 
  LucideDownload,
  LucideX
} from 'lucide-react';
import { 
  useGetImportantDataQuery, 
  useCreateImportantDataMutation, 
  useDeleteImportantDataMutation 
} from '@/features/content/contentApi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function ImportantDataPage() {
  const { data, isLoading } = useGetImportantDataQuery({});
  const [createData, { isLoading: isCreating }] = useCreateImportantDataMutation();
  const [deleteData] = useDeleteImportantDataMutation();
  
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const importantData = data?.data || [];

  const handleCreate = async (formData: any) => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('file', selectedFile);

    try {
      await createData(data).unwrap();
      toast.success('Data uploaded successfully');
      setOpen(false);
      reset();
      setSelectedFile(null);
    } catch (error) {
      toast.error('Failed to upload data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteData(id).unwrap();
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Important Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage repository of important documents and images.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => setOpen(true)}
          sx={{ 
            bgcolor: '#0f172a', 
            '&:hover': { bgcolor: '#334155' },
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Add New Data
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {importantData.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'relative', height: 200, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.type === 'IMAGE' ? (
                     // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.file} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <LucideFileText size={64} color="#94a3b8" />
                  )}
                  <Chip 
                    label={item.type} 
                    size="small" 
                    color={item.type === 'IMAGE' ? 'primary' : 'error'}
                    sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Uploaded by: {item.createdBy?.name || 'Unknown'} <br/>
                    Date: {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    startIcon={<LucideDownload size={16} />}
                    href={item.file}
                    target="_blank"
                    sx={{ textTransform: 'none' }}
                  >
                    Download
                  </Button>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(item._id)}
                    sx={{ bgcolor: '#fee2e2', '&:hover': { bgcolor: '#fecaca' } }}
                  >
                    <LucideTrash2 size={18} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Upload Important Data</DialogTitle>
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                label="Title"
                fullWidth
                required
                {...register('title', { required: true })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                {...register('description')}
              />
              <Box 
                sx={{ 
                  border: '2px dashed #e2e8f0', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  accept="image/*,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                  {selectedFile ? (
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <LucideFileText size={20} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedFile.name}</Typography>
                    </Stack>
                  ) : (
                    <Box>
                      <LucideDownload size={24} color="#94a3b8" style={{ marginBottom: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload PDF or Image
                      </Typography>
                    </Box>
                  )}
                </label>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isCreating}
              sx={{ bgcolor: '#0f172a' }}
            >
              {isCreating ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
