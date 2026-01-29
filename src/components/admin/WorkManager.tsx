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
  Autocomplete
} from '@mui/material';
import {
  LucidePlus,
  LucideBriefcase,
  LucideClock,
  LucideAlertCircle,
  LucideExternalLink
} from 'lucide-react';
import {
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    society: '',
    deadline: '',
    priority: WORK_PRIORITY.MEDIUM,
    visibility: WORK_VISIBILITY.PUBLIC_TO_SOCIETY,
  });

  const { data: assignmentsData, isLoading: loadingAssignments } = useGetAssignmentsQuery({});
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({ 
    search: debouncedSearch || undefined,
    role: !debouncedSearch ? 'STUDENT' : undefined, 
    limit: 1000 
  });
  const { data: societiesData } = useGetSocietiesQuery({});
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();

  const assignments = assignmentsData?.data || [];
  const students = usersData?.data?.users || [];
  const societies = societiesData?.data || [];

  const handleCreate = async () => {
    try {
      if (!formData.title || !formData.assignedTo || !formData.society || !formData.deadline) {
        toast.error('Please fill in all required fields');
        return;
      }
      await createAssignment(formData).unwrap();
      toast.success('Work assigned successfully');
      setOpenDialog(false);
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
      toast.error('Failed to assign work');
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
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#002147', px: 3, py: 1.2, fontWeight: 700, borderRadius: 2 }}
        >
          New Assignment
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          {loadingAssignments ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Society</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Deadline</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment: {
                  _id: string;
                  title: string;
                  description: string;
                  assignedTo: {
                    name: string;
                    profileImage?: string;
                    studentId?: string;
                  };
                  society: {
                    name: string;
                  };
                  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
                  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
                  deadline: string;
                }) => (
                  <TableRow key={assignment._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{assignment.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {assignment.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={assignment.assignedTo?.profileImage} sx={{ width: 32, height: 32 }}>
                          {assignment.assignedTo?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{assignment.assignedTo?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{assignment.assignedTo?.studentId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{assignment.society?.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={assignment.priority} 
                        size="small" 
                        color={PRIORITY_COLORS[assignment.priority]} 
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={assignment.status} 
                        size="small" 
                        color={STATUS_COLORS[assignment.status]}
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LucideClock size={14} color="#64748b" />
                        <Typography variant="body2">{new Date(assignment.deadline).toLocaleDateString()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton size="small"><LucideExternalLink size={18} /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center' }}>
                      <LucideAlertCircle size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
                      <Typography color="text.secondary">No work assignments found</Typography>
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
        <DialogTitle sx={{ fontWeight: 800 }}>Assign New Work</DialogTitle>
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
            {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Assign Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
