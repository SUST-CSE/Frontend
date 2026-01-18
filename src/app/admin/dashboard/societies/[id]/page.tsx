'use client';

import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  CircularProgress,
  Autocomplete,
  Switch,
  FormControlLabel
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideUser, LucideArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetSocietyMembersQuery, useGetFormerSocietyMembersQuery, useAddMemberMutation, useRemoveMemberMutation, useGetSocietyByIdQuery } from '@/features/society/societyApi';
import { useGetAllUsersQuery } from '@/features/user/userApi';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberDesignation } from '@/types'; // Assuming types are available, or I'll define locally

// Placeholder for Designation Enum if not imported
const Designations = [
  'PRESIDENT',
  'VICE_PRESIDENT',
  'GENERAL_SECRETARY',
  'SPORTS_SECRETARY',
  'ORGANIZING_SECRETARY',
  'PUBLICATION_SECRETARY',
  'ASSISTANT_GENERAL_SECRETARY',
  'EXECUTIVE_MEMBER'
];

interface MemberFormData {
  user: string; // User ID
  designation: string;
  tenureStart: string;
  tenureEnd?: string;
  isCurrent: boolean;
  image?: File;
  session: string; // Add session
}

export default function AdminSocietyMembersPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: societyId } = params;
  const [activeTab, setActiveTab] = useState<'current' | 'former'>('current');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: societyData } = useGetSocietyByIdQuery(societyId);
  const { data: currentMembersData, isLoading: loadingCurrent } = useGetSocietyMembersQuery(societyId);
  const { data: formerMembersData, isLoading: loadingFormer } = useGetFormerSocietyMembersQuery(societyId);
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({ email: searchTerm, limit: 10 }, { skip: !searchTerm });
  
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const members = activeTab === 'current' ? currentMembersData?.data : formerMembersData?.data;
  const isLoading = activeTab === 'current' ? loadingCurrent : loadingFormer;

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MemberFormData>({
    defaultValues: {
      user: '',
      designation: 'EXECUTIVE_MEMBER',
      tenureStart: new Date().toISOString().split('T')[0],
      isCurrent: true,
      session: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('user', data.user);
      formData.append('designation', data.designation);
      formData.append('tenureStart', data.tenureStart);
      if (data.tenureEnd) formData.append('tenureEnd', data.tenureEnd);
      formData.append('isCurrent', String(data.isCurrent));
      formData.append('session', data.session);
      if (data.image) formData.append('image', data.image);

      await addMember({ societyId, data: formData }).unwrap();
      setOpenAddDialog(false);
      reset();
    } catch (error) {
      console.error("Failed to add member", error);
      alert("Failed to add member. Please try again.");
    }
  };

  const handleRemove = async (memberId: string) => {
    if(confirm("Are you sure you want to remove this member?")) {
      await removeMember({ societyId, memberId });
    }
  };

  const selectedUser = watch('user'); // Just to triger re-renders if needed, or manage state logic

  return (
    <Box>
      <Button 
        startIcon={<LucideArrowLeft size={18} />} 
        onClick={() => router.back()} 
        sx={{ mb: 4, color: '#64748b' }}
      >
        Back to Societies
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#0f172a">
            {societyData?.data?.name || "Society"} <span style={{ color: '#16a34a' }}>Members</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">Manage current and former executive members</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ bgcolor: '#000000', fontWeight: 700, '&:hover': { bgcolor: '#16a34a' } }}
        >
          Add Member
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
         <Chip 
            label="Current Committee" 
            onClick={() => setActiveTab('current')} 
            sx={{ 
               bgcolor: activeTab === 'current' ? '#000000' : '#f1f5f9', 
               color: activeTab === 'current' ? '#ffffff' : '#64748b',
               fontWeight: 700,
               cursor: 'pointer'
            }} 
         />
         <Chip 
            label="Former Members" 
            onClick={() => setActiveTab('former')} 
            sx={{ 
               bgcolor: activeTab === 'former' ? '#000000' : '#f1f5f9', 
               color: activeTab === 'former' ? '#ffffff' : '#64748b',
               fontWeight: 700,
               cursor: 'pointer'
            }} 
         />
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {isLoading ? <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Tenure</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members?.length === 0 && (
                   <TableRow><TableCell colSpan={4} align="center">No members found.</TableCell></TableRow>
                )}
                {members?.map((member: any) => (
                  <TableRow key={member._id} hover>
                    <TableCell>
                       <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                             {/* Prefer member.image, fall back to user profile image, then placeholder */}
                             <img src={member.image || member.user?.profileImage || "/placeholder-avatar.png"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                          <Box>
                             <Typography fontWeight={700}>{member.user?.name}</Typography>
                             <Typography variant="caption" color="text.secondary">{member.user?.email}</Typography>
                          </Box>
                       </Stack>
                    </TableCell>
                    <TableCell>
                       <Chip label={member.designation} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                       {new Date(member.tenureStart).getFullYear()} - {member.tenureEnd ? new Date(member.tenureEnd).getFullYear() : 'Present'}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="error" onClick={() => handleRemove(member._id)}><LucideTrash2 size={16} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Member Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle fontWeight={800}>Add Society Member</DialogTitle>
         <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
               <Stack spacing={3} sx={{ pt: 1 }}>
                  {/* User Search Autocomplete */}
                  <Controller 
                     name="user"
                     control={control}
                     rules={{ required: 'User is required' }}
                     render={({ field: { onChange, value } }) => (
                        <Autocomplete
                           options={usersData?.data || []}
                           getOptionLabel={(option: any) => `${option.name} (${option.email})`}
                           isOptionEqualToValue={(option, value) => option._id === value}
                           loading={loadingUsers}
                           onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
                           onChange={(_, newValue: any) => onChange(newValue?._id)}
                           renderInput={(params) => (
                              <TextField 
                                 {...params} 
                                 label="Search User by Email" 
                                 fullWidth 
                                 error={!!errors.user}
                                 helperText={errors.user?.message}
                               />
                           )}
                        />
                     )}
                  />

                  <Controller
                     name="designation"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} select label="Designation" fullWidth>
                           {Designations.map((option) => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                           ))}
                        </TextField>
                     )}
                  />

                  <Controller
                     name="session"
                     control={control}
                     rules={{ required: 'Session is required ex: 2020-21' }}
                     render={({ field }) => (
                        <TextField 
                           {...field} 
                           label="Session (e.g. 2020-21)" 
                           fullWidth 
                           error={!!errors.session}
                           helperText={errors.session?.message}
                        />
                     )}
                  />

                  <Stack direction="row" spacing={2}>
                     <Controller
                        name="tenureStart"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="Tenure Start" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                        )}
                     />
                     <Controller
                        name="tenureEnd"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="Tenure End" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                        )}
                     />
                  </Stack>

                  <Controller
                     name="image"
                     control={control}
                     render={({ field: { onChange, value, ...field } }) => (
                       <TextField
                         {...field}
                         type="file"
                         label="Member Photo (Optional)"
                         fullWidth
                         InputLabelProps={{ shrink: true }}
                         inputProps={{ accept: 'image/*' }}
                         onChange={(e: any) => {
                           onChange(e.target.files ? e.target.files[0] : null);
                         }}
                         error={!!errors.image as boolean}
                         helperText={errors.image?.message as string}
                       />
                     )}
                   />

                  <Controller
                     name="isCurrent"
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                           control={<Switch checked={value} onChange={onChange} />}
                           label="Current Execuitve Member"
                        />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
               <Button type="submit" variant="contained" disabled={isAdding} sx={{ bgcolor: '#000000' }}>
                  {isAdding ? 'Adding...' : 'Add Member'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>
    </Box>
  );
}
