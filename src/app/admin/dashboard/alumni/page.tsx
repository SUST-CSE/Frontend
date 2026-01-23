'use client';

import { useState } from 'react';
import {
  useGetAllAlumniQuery,
  useCreateAlumniMutation,
  useUpdateAlumniMutation,
  useDeleteAlumniMutation,
  useAddAlumniFromUserMutation,
  useGraduateSessionMutation,
} from '@/features/alumni/alumniApi';
import { useGetAllUsersQuery } from '@/features/user/userApi';
import { LucideGraduationCap, LucideUserPlus } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import { LucidePlus, LucideEdit, LucideTrash2 } from 'lucide-react';

export default function AdminAlumniPage() {
  const [open, setOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    currentCompany: '',
    currentPosition: '',
    previousCompanies: '',
    description: '',
    quotes: '',
    linkedIn: '',
    facebook: '',
    instagram: '',
    email: '',
  });
  const [session, setSession] = useState('');
  const [userId, setUserId] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useGetAllAlumniQuery({});
  const [createAlumni, { isLoading: isCreating }] = useCreateAlumniMutation();
  const [updateAlumni, { isLoading: isUpdating }] = useUpdateAlumniMutation();
  const [deleteAlumni] = useDeleteAlumniMutation();
  const [addAlumniFromUser, { isLoading: isAddingFromUser }] = useAddAlumniFromUserMutation();
  const [graduateSession, { isLoading: isGraduating }] = useGraduateSessionMutation();

  const { data: usersData } = useGetAllUsersQuery({ role: 'STUDENT' });
  const students = usersData?.data || [];

  const alumni = data?.data?.alumni || [];

  const handleOpen = (alumniData?: any) => {
    if (alumniData) {
      setEditingAlumni(alumniData);
      setFormData({
        name: alumniData.name,
        batch: alumniData.batch,
        currentCompany: alumniData.currentCompany,
        currentPosition: alumniData.currentPosition,
        previousCompanies: alumniData.previousCompanies?.join(', ') || '',
        description: alumniData.description,
        quotes: alumniData.quotes,
        linkedIn: alumniData.linkedIn || '',
        facebook: alumniData.facebook || '',
        instagram: alumniData.instagram || '',
        email: alumniData.email || '',
      });
    } else {
      setEditingAlumni(null);
      setFormData({
        name: '',
        batch: '',
        currentCompany: '',
        currentPosition: '',
        previousCompanies: '',
        description: '',
        quotes: '',
        linkedIn: '',
        facebook: '',
        instagram: '',
        email: '',
      });
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAlumni(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('batch', formData.batch);
    submitData.append('currentCompany', formData.currentCompany);
    submitData.append('currentPosition', formData.currentPosition);
    submitData.append('description', formData.description);
    submitData.append('quotes', formData.quotes);

    // Handle previous companies as array
    if (formData.previousCompanies) {
      const companiesArray = formData.previousCompanies.split(',').map((c) => c.trim()).filter(Boolean);
      companiesArray.forEach((company) => {
        submitData.append('previousCompanies[]', company);
      });
    }

    if (formData.linkedIn) submitData.append('linkedIn', formData.linkedIn);
    if (formData.facebook) submitData.append('facebook', formData.facebook);
    if (formData.instagram) submitData.append('instagram', formData.instagram);
    if (formData.email) submitData.append('email', formData.email);
    if (imageFile) submitData.append('profileImage', imageFile);

    try {
      if (editingAlumni) {
        // Send FormData directly for updates to support file uploads
        await updateAlumni({ id: editingAlumni._id, formData: submitData }).unwrap();
      } else {
        await createAlumni(submitData).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save alumni:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this alumni?')) {
      try {
        await deleteAlumni(id).unwrap();
      } catch (error) {
        console.error('Failed to delete alumni:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Alumni Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<LucideUserPlus size={20} />}
            onClick={() => setOpenUserDialog(true)}
            sx={{ borderColor: '#16a34a', color: '#16a34a' }}
          >
            Add from User
          </Button>
          <Button
            variant="outlined"
            startIcon={<LucideGraduationCap size={20} />}
            onClick={() => setOpenSessionDialog(true)}
            sx={{ borderColor: '#2563eb', color: '#2563eb' }}
          >
            Graduate Session
          </Button>
          <Button
            variant="contained"
            startIcon={<LucidePlus size={20} />}
            onClick={() => handleOpen()}
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            Add Alumni
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Batch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Current Position</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumni.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No alumni added yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              alumni.map((person: any) => (
                <TableRow key={person._id} hover>
                  <TableCell>
                    <Avatar src={person.profileImage} alt={person.name} sx={{ width: 50, height: 50 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{person.name}</TableCell>
                  <TableCell>
                    <Chip label={person.batch} size="small" color="success" />
                  </TableCell>
                  <TableCell>{person.currentPosition}</TableCell>
                  <TableCell>{person.currentCompany}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpen(person)} sx={{ color: '#3b82f6' }}>
                      <LucideEdit size={18} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(person._id)} sx={{ color: '#ef4444' }}>
                      <LucideTrash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Full Name"
                required
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Batch"
                  required
                  fullWidth
                  placeholder="e.g., 2019"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Stack>

              <TextField
                label="Current Position"
                required
                fullWidth
                placeholder="e.g., Senior Software Engineer"
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
              />

              <TextField
                label="Current Company"
                required
                fullWidth
                placeholder="e.g., Google"
                value={formData.currentCompany}
                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
              />

              <TextField
                label="Previous Companies"
                fullWidth
                placeholder="Comma-separated, e.g., Microsoft, Amazon"
                value={formData.previousCompanies}
                onChange={(e) => setFormData({ ...formData, previousCompanies: e.target.value })}
                helperText="Enter company names separated by commas"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="LinkedIn URL"
                  fullWidth
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                />
                <TextField
                  label="Facebook URL"
                  fullWidth
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                />
                <TextField
                  label="Instagram URL"
                  fullWidth
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
              </Stack>

              <TextField
                label="Description"
                required
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                helperText="Brief biography and achievements"
              />

              <TextField
                label="Quotes"
                required
                multiline
                rows={3}
                fullWidth
                value={formData.quotes}
                onChange={(e) => setFormData({ ...formData, quotes: e.target.value })}
                helperText="Inspirational quote or advice for current students"
              />

              <Box>
                <Button variant="outlined" component="label" fullWidth>
                  {imageFile ? imageFile.name : 'Upload Profile Photo'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </Button>
                {!editingAlumni && !imageFile && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    Profile photo is required for new alumni
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating || (!editingAlumni && !imageFile)}
              sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
            >
              {isCreating || isUpdating ? 'Saving...' : editingAlumni ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add from User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Alumni from Existing User</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Select a student to convert them to alumni. This will create an alumni record and mark their account as alumni.</Typography>
          <TextField
            select
            fullWidth
            label="Select Student"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {students.map((s: any) => (
              <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!userId || isAddingFromUser}
            onClick={async () => {
              try {
                await addAlumniFromUser({ userId }).unwrap();
                setOpenUserDialog(false);
                setUserId('');
              } catch (err) { console.error(err); }
            }}
          >
            {isAddingFromUser ? 'Adding...' : 'Add as Alumni'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Graduate Session Dialog */}
      <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Graduate Multiple Sessions</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Enter the target session. This will mark all students of <b>this session and all previous sessions</b> as alumni.
          </Typography>
          <TextField
            fullWidth
            label="Session"
            placeholder="e.g., 2021-22"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenSessionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!session || isGraduating}
            onClick={async () => {
              try {
                await graduateSession({ session }).unwrap();
                alert(`All students from session ${session} have been marked as alumni.`);
                setOpenSessionDialog(false);
                setSession('');
              } catch (err) { console.error(err); }
            }}
          >
            {isGraduating ? 'Processing...' : 'Mark as Alumni'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
