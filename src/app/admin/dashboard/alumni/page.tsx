'use client';

import { useState } from 'react';
import {
  useGetAllAlumniQuery,
  useCreateAlumniMutation,
  useUpdateAlumniMutation,
  useDeleteAlumniMutation,
} from '@/features/alumni/alumniApi';
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
  Alert,
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
    email: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useGetAllAlumniQuery({});
  const [createAlumni, { isLoading: isCreating }] = useCreateAlumniMutation();
  const [updateAlumni, { isLoading: isUpdating }] = useUpdateAlumniMutation();
  const [deleteAlumni] = useDeleteAlumniMutation();

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
        <Button
          variant="contained"
          startIcon={<LucidePlus size={20} />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
        >
          Add Alumni
        </Button>
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

              <TextField
                label="LinkedIn Profile URL"
                fullWidth
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              />

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
    </Container>
  );
}
