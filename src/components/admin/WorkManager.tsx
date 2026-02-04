'use client';

import { useState } from 'react';
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
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Autocomplete,
  Fade,
  Grow
} from '@mui/material';
import {
  LucidePlus,
  LucideBriefcase,
  LucideClock,
  LucideAlertCircle,
  LucideEdit,
  LucideTrash2,
  LucideSearch,
  LucideMoreVertical
} from 'lucide-react';
import {
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} from '@/features/work-assignment/workAssignmentApi';
import { useGetAllUsersQuery } from '@/features/user/userApi';
import { useGetSocietiesQuery } from '@/features/society/societyApi';
import { 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  WORK_PRIORITY, 
  WORK_VISIBILITY 
} from '@/features/work-assignment/workAssignmentConstants';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface IUser {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  profileImage?: string;
}

export default function WorkManager() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    society: '',
    deadline: '',
    priority: WORK_PRIORITY.MEDIUM,
    visibility: WORK_VISIBILITY.PUBLIC_TO_SOCIETY,
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: assignmentsData, isLoading: loadingAssignments } = useGetAssignmentsQuery({});
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({ 
    search: debouncedSearch || undefined,
    role: !debouncedSearch ? 'STUDENT' : undefined, 
    limit: 1000 
  });
  const { data: societiesData } = useGetSocietiesQuery({});
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const assignments = assignmentsData?.data || [];
  const students = usersData?.data?.users || [];
  const societies = societiesData?.data || [];

  const handleCreate = async () => {
    try {
      if (!formData.title || !formData.assignedTo || !formData.society || !formData.deadline) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (editingId) {
        await updateAssignment({ id: editingId, ...formData }).unwrap();
        toast.success('Work updated successfully');
      } else {
        await createAssignment(formData).unwrap();
        toast.success('Work assigned successfully');
      }
      
      setOpenDialog(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        society: '',
        deadline: '',
        priority: WORK_PRIORITY.MEDIUM,
        visibility: WORK_VISIBILITY.PUBLIC_TO_SOCIETY,
      });
    } catch {
      toast.error(editingId ? 'Failed to update work' : 'Failed to assign work');
    }
  };

  const handleEdit = (assignment: any) => {
     setEditingId(assignment._id);
     setFormData({
        title: assignment.title,
        description: assignment.description,
        assignedTo: assignment.assignedTo?._id,
        society: assignment.society?._id,
        deadline: new Date(assignment.deadline).toISOString().split('T')[0],
        priority: assignment.priority,
        visibility: assignment.visibility || WORK_VISIBILITY.PUBLIC_TO_SOCIETY,
     });
     setOpenDialog(true);
  };

  const handleDeleteClick = (id: string) => {
     setDeleteId(id);
     setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
     if (deleteId) {
        try {
           await deleteAssignment(deleteId).unwrap();
           toast.success('Assignment deleted');
        } catch {
           toast.error('Failed to delete assignment');
        } finally {
           setOpenConfirm(false);
           setDeleteId(null);
        }
     }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LucideBriefcase size={24} />
            Work Assignments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign tasks to society members and track their progress
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<LucidePlus size={18} />}
          onClick={() => {
             setEditingId(null);
             setFormData({
                title: '', description: '', assignedTo: '', society: '', deadline: '', 
                priority: WORK_PRIORITY.MEDIUM, visibility: WORK_VISIBILITY.PUBLIC_TO_SOCIETY
             });
             setOpenDialog(true);
          }}
          sx={{ bgcolor: '#002147', px: 3, py: 1.2, fontWeight: 700, borderRadius: 2 }}
        >
          New Assignment
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer sx={{ px: 1 }}>
          {loadingAssignments ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <CircularProgress size={32} thickness={5} />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>TASK DESCRIPTION</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>ASSIGNEE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>ENTITY</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>PRIORITY</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>DEADLINE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#64748b', borderBottom: '2px solid #f1f5f9', textAlign: 'right' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment: any, index: number) => (
                  <Grow in={true} key={assignment._id} style={{ transformOrigin: '0 0 0' }} timeout={(index + 1) * 200}>
                    <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.02) !important' } }}>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="#0f172a">{assignment.title}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {assignment.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            src={assignment.assignedTo?.profileImage} 
                            sx={{ width: 34, height: 34, bgcolor: '#f1f5f9', color: '#3b82f6', fontWeight: 800, fontSize: '0.8rem' }}
                          >
                            {assignment.assignedTo?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="#334155">{assignment.assignedTo?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{assignment.assignedTo?.studentId || 'N/A'}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={assignment.society?.name} 
                          size="small" 
                          sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 700, borderRadius: 1.5 }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 10,
                          bgcolor: `${PRIORITY_COLORS[assignment.priority]}20`,
                          color: PRIORITY_COLORS[assignment.priority] === 'primary' ? '#3b82f6' : 
                                 PRIORITY_COLORS[assignment.priority] === 'warning' ? '#f59e0b' :
                                 PRIORITY_COLORS[assignment.priority] === 'error' ? '#ef4444' : '#64748b'
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                          <Typography variant="caption" fontWeight={800}>{assignment.priority}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={assignment.status} 
                          size="small" 
                          color={STATUS_COLORS[assignment.status]}
                          sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack component="span" direction="row" spacing={1} alignItems="center">
                           <LucideClock size={14} color={new Date(assignment.deadline) < new Date() ? '#ef4444' : '#64748b'} />
                           <Typography variant="body2" fontWeight={600} color={new Date(assignment.deadline) < new Date() ? '#ef4444' : 'inherit'}>
                             {new Date(assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                           <Tooltip title="Edit Task">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEdit(assignment)}
                                sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.08)' } }}
                              >
                                 <LucideEdit size={18} />
                              </IconButton>
                           </Tooltip>
                           <Tooltip title="Delete Task">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteClick(assignment._id)}
                                sx={{ color: '#64748b', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
                              >
                                 <LucideTrash2 size={18} />
                              </IconButton>
                           </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Grow>
                ))}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 12, textAlign: 'center' }}>
                      <Box sx={{ opacity: 0.5 }}>
                        <LucideAlertCircle size={48} />
                        <Typography variant="h6" sx={{ mt: 2 }}>No assignments found</Typography>
                        <Typography variant="body2">Start by assigning a task to a member</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingId ? 'Edit Assignment' : 'Assign New Work'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <Autocomplete
                fullWidth
                filterOptions={(x) => x}
                options={students}
                getOptionLabel={(option: IUser) => `${option.name} (${option.studentId || option.email})`}
                value={students.find((s: IUser) => s._id === formData.assignedTo) || null}
                onChange={(_, newValue: IUser | null) => setFormData({ ...formData, assignedTo: newValue?._id || '' })}
                onInputChange={(_, newInputValue) => {
                  setSearchQuery(newInputValue);
                }}
                loading={loadingUsers}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To User"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option: IUser) => (
                  <li {...props} key={option._id}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={option.profileImage} sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                        {option.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{option.studentId || option.email}</Typography>
                      </Box>
                    </Stack>
                  </li>
                )}
              />
              <FormControl fullWidth required>
                <InputLabel>Society</InputLabel>
                <Select
                  value={formData.society}
                  label="Society"
                  onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                >
                  {societies.map((society: { _id: string; name: string }) => (
                    <MenuItem key={society._id} value={society._id}>
                      {society.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Deadline"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {Object.values(WORK_PRIORITY).map(p => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={formData.visibility}
                label="Visibility"
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              >
                <MenuItem value={WORK_VISIBILITY.PUBLIC_TO_SOCIETY}>Public to all Society Members</MenuItem>
                <MenuItem value={WORK_VISIBILITY.ADMIN_ONLY}>Private (Admin & Assigned User only)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isCreating}
            onClick={handleCreate}
            sx={{ bgcolor: '#002147', px: 4 }}
          >
            {isCreating || isUpdating ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Task' : 'Assign Task')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openConfirm}
        title="Delete Assignment"
        message="Are you sure you want to delete this work assignment? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </Box>
  );
}
