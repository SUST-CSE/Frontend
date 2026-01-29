'use client';

import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button, 
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideBell } from 'lucide-react';
import { useGetNoticesQuery, useCreateNoticeMutation, useDeleteNoticeMutation } from '@/features/content/contentApi';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['ACADEMIC', 'ADMINISTRATIVE', 'EVENT', 'GENERAL']),
  isPinned: z.boolean(),
  isImportant: z.boolean(),
  targetAudience: z.enum(['STUDENT', 'TEACHER', 'BOTH']),
  shouldSendEmail: z.boolean(),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

export default function NoticeManager() {
  const [openNoticeDialog, setOpenNoticeDialog] = useState(false);
  const [noticeFiles, setNoticeFiles] = useState<File[]>([]);
  const { data: noticeData, isLoading: noticesLoading } = useGetNoticesQuery({});
  const [createNotice, { isLoading: isCreatingNotice }] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

  const noticeForm = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'GENERAL',
      isPinned: false,
      isImportant: false,
      targetAudience: 'BOTH',
      shouldSendEmail: true,
    }
  });

  const notices = noticeData?.data || [];

  const onNoticeSubmit = async (data: NoticeFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('isPinned', String(data.isPinned));
      formData.append('isImportant', String(data.isImportant));
      formData.append('targetAudience', data.targetAudience);
      formData.append('shouldSendEmail', String(data.shouldSendEmail));
      
      noticeFiles.forEach(file => {
        formData.append('attachments', file);
      });

      await createNotice(formData).unwrap();
      toast.success("Notice created successfully!");
      setOpenNoticeDialog(false);
      noticeForm.reset();
      setNoticeFiles([]);
    } catch (error) {
       console.error("Failed to create notice", error);
       toast.error("Failed to create notice");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNoticeFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideBell size={32} />
            Notice Management
          </Typography>
          <Typography color="text.secondary">
            Publish and manage department notices
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => setOpenNoticeDialog(true)}
          sx={{ bgcolor: '#002147', fontWeight: 700 }}
        >
          Create Notice
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         {noticesLoading ? <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box> : (
           <TableContainer>
             <Table>
               <TableHead sx={{ bgcolor: '#f8fafc' }}>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Audience</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                   <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {notices.map((notice: { _id: string; title: string; isImportant: boolean; category: string; targetAudience: string; createdAt: string }) => (
                   <TableRow key={notice._id} hover>
                     <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>{notice.title}</Typography>
                        {notice.isImportant && <Chip label="Important" size="small" color="error" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800 }} />}
                     </TableCell>
                     <TableCell>
                        <Chip label={notice.category} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                     </TableCell>
                     <TableCell>
                        <Chip label={notice.targetAudience} size="small" sx={{ fontWeight: 700 }} />
                     </TableCell>
                     <TableCell>{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
                     <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => { if(confirm("Delete notice?")) deleteNotice(notice._id) }}>
                          <LucideTrash2 size={18} />
                        </IconButton>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         )}
      </Paper>

      {/* Create Notice Dialog */}
      <Dialog open={openNoticeDialog} onClose={() => setOpenNoticeDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={noticeForm.handleSubmit(onNoticeSubmit)}>
          <DialogTitle fontWeight={800}>Create New Notice</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Controller
                name="title"
                control={noticeForm.control}
                render={({ field, fieldState }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    label="Notice Title" 
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={noticeForm.control}
                render={({ field, fieldState }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    multiline 
                    rows={4} 
                    label="Description" 
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Controller
                  name="category"
                  control={noticeForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="ACADEMIC">Academic</MenuItem>
                        <MenuItem value="ADMINISTRATIVE">Administrative</MenuItem>
                        <MenuItem value="EVENT">Event</MenuItem>
                        <MenuItem value="GENERAL">General</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="targetAudience"
                  control={noticeForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Target Audience</InputLabel>
                      <Select {...field} label="Target Audience">
                        <MenuItem value="STUDENT">Students</MenuItem>
                        <MenuItem value="TEACHER">Teachers</MenuItem>
                        <MenuItem value="BOTH">Both</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Controller
                  name="isPinned"
                  control={noticeForm.control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Pin to top" />
                  )}
                />
                <Controller
                  name="isImportant"
                  control={noticeForm.control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Mark Important" />
                  )}
                />
              </Stack>
              <Controller
                name="shouldSendEmail"
                control={noticeForm.control}
                render={({ field }) => (
                  <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Send email notification" />
                )}
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700}>Attachments</Typography>
                <Button variant="outlined" component="label" startIcon={<LucidePlus size={18} />}>
                  Upload Files
                  <input type="file" multiple hidden onChange={handleFileChange} />
                </Button>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {noticeFiles.map((f, i) => (
                    <Chip key={i} label={f.name} size="small" onDelete={() => setNoticeFiles(prev => prev.filter((_, idx) => idx !== i))} />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenNoticeDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#002147' }} disabled={isCreatingNotice}>
              {isCreatingNotice ? <CircularProgress size={24} /> : 'Publish Notice'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
