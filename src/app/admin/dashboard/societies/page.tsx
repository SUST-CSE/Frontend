'use client';

import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Stack,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { LucidePlus, LucideUsers, LucideSettings } from 'lucide-react';
import { useGetSocietiesQuery, useCreateSocietyMutation } from '@/features/society/societyApi';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

export default function AdminSocietiesPage() {
  const { data: societyData, isLoading } = useGetSocietiesQuery({});
  const [createSociety, { isLoading: isCreating }] = useCreateSocietyMutation();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const societies = societyData?.data || [];

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      category: 'TECHNICAL',
      description: '',
      foundedDate: '',
      logo: null
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('foundedDate', data.foundedDate);
      if (data.logo) {
         formData.append('logo', data.logo);
      }

      await createSociety(formData).unwrap();
      setOpenCreateDialog(false);
      reset();
    } catch (error) {
      console.error("Failed to create society", error);
      alert("Failed to create society");
    }
  };

  return (
    <Box>
       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={900} color="#0f172a">
            Society <span style={{ color: '#16a34a' }}>Management</span>
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<LucidePlus size={18} />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ bgcolor: '#000000', fontWeight: 700, '&:hover': { bgcolor: '#16a34a' } }}
          >
            Create Society
          </Button>
       </Stack>

      {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box> : (
        <Grid container spacing={4}>
           {societies.map((society: any) => (
              <Grid item xs={12} md={6} lg={4} key={society._id}>
                 <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                       <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                          <Avatar src={society.logo} alt={society.name} sx={{ width: 56, height: 56, bgcolor: '#f1f5f9' }} />
                          <Box>
                             <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>{society.name}</Typography>
                             <Typography variant="caption" color="text.secondary" fontWeight={600}>{society.category}</Typography>
                          </Box>
                       </Stack>
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {society.description.substring(0, 100)}...
                       </Typography>
                       <Stack direction="row" spacing={1}>
                          <Chip size="small" icon={<LucideUsers size={14} />} label="View Members" />
                       </Stack>
                    </CardContent>
                    <CardActions sx={{ p: 2, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                       <Button 
                          fullWidth 
                          variant="outlined" 
                          color="inherit" 
                          size="small"
                          startIcon={<LucideSettings size={16} />}
                          href={`/admin/dashboard/societies/${society._id}`}
                       >
                          Manage Members
                       </Button>
                    </CardActions>
                 </Card>
              </Grid>
           ))}
        </Grid>
      )}

      {/* Create Society Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle fontWeight={800}>Create New Society</DialogTitle>
         <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
               <Stack spacing={3} sx={{ pt: 1 }}>
                  <Controller
                     name="name"
                     control={control}
                     rules={{ required: 'Name is required' }}
                     render={({ field }) => (
                        <TextField {...field} label="Society Name" fullWidth error={!!errors.name} helperText={errors.name?.message as string} />
                     )}
                  />
                  
                  <Controller
                     name="category"
                     control={control}
                     rules={{ required: 'Category is required' }}
                     render={({ field }) => (
                        <TextField {...field} select label="Category" fullWidth error={!!errors.category} helperText={errors.category?.message as string}>
                           <MenuItem value="TECHNICAL">Technical</MenuItem>
                           <MenuItem value="CULTURAL">Cultural</MenuItem>
                           <MenuItem value="SPORTS">Sports</MenuItem>
                           <MenuItem value="SOCIAL">Social</MenuItem>
                           <MenuItem value="RELIGIOUS">Religious</MenuItem>
                           <MenuItem value="ACADEMIC">Academic</MenuItem>
                           <MenuItem value="OTHER">Other</MenuItem>
                        </TextField>
                     )}
                  />

                  <Controller
                     name="foundedDate"
                     control={control}
                     rules={{ required: 'Founded Date is required' }}
                     render={({ field }) => (
                        <TextField {...field} type="date" label="Founded Date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.foundedDate} helperText={errors.foundedDate?.message as string} />
                     )}
                  />

                  <Controller
                     name="logo"
                     control={control}
                     render={({ field: { onChange, value, ...rest } }) => (
                        <TextField 
                           {...rest} 
                           type="file" 
                           label="Logo (Optional)" 
                           fullWidth 
                           InputLabelProps={{ shrink: true }} 
                           inputProps={{ accept: 'image/*' }}
                           onChange={(e: any) => onChange(e.target.files ? e.target.files[0] : null)}
                        />
                     )}
                  />

                  <Controller
                     name="description"
                     control={control}
                     rules={{ required: 'Description is required' }}
                     render={({ field }) => (
                        <TextField {...field} label="Description" multiline rows={4} fullWidth error={!!errors.description} helperText={errors.description?.message as string} />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenCreateDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
               <Button type="submit" variant="contained" disabled={isCreating} sx={{ bgcolor: '#000000' }}>
                  {isCreating ? 'Creating...' : 'Create Society'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>
    </Box>
  );
}
