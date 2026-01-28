'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip, 
  Button, 
  Tabs, 
  Tab,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { 
  LucideUsers, 
  LucideClock, 
  LucideCheckCircle, 
  LucideUserCheck, 
  LucideUserX,
  LucideShieldAlert,
  LucideRefreshCcw,
  LucideTrash2,
  LucideShieldCheck
} from 'lucide-react';
import { 
  useGetAllUsersQuery, 
  useUpdateUserStatusMutation, 
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkCreateUsersMutation
} from '@/features/user/userApi';
import { LucideUserPlus, LucideEdit } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, any> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  INACTIVE: 'default',
  SUSPENDED: 'error',
};

const ROLE_COLORS: Record<string, any> = {
  ADMIN: 'primary',
  TEACHER: 'secondary',
  STUDENT: 'info',
};

const PERMISSIONS = [
  'MANAGE_USERS',
  'MANAGE_CONTENT',
  'MANAGE_SOCIETIES',
  'MANAGE_APPLICATIONS',
  'MANAGE_ACCOUNTS',
  'VIEW_EMAIL_LOGS',
  'MANAGE_ACHIEVEMENTS',
  'MANAGE_NOTICES',
  'MANAGE_EVENTS',
  'MANAGE_RESEARCH',
  'MANAGE_BLOGS',
  'MANAGE_WORK',
];

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({
    status: activeTab === 0 ? 'PENDING' : undefined,
    email: usersSearch || undefined
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [bulkCreate, { isLoading: isBulkCreating }] = useBulkCreateUsersMutation();

  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [bulkData, setBulkData] = useState('');
  const [bulkRole, setBulkRole] = useState('STUDENT');

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const users = usersData?.data || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideUsers size={32} />
            User Management
          </Typography>
          <Typography color="text.secondary">
            Manage registrations, permissions, and account statuses
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<LucideUserPlus size={18} />} 
            variant="contained" 
            onClick={() => setOpenBulkDialog(true)}
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            Bulk Create Users
          </Button>
          <Button 
            startIcon={<LucideRefreshCcw size={18} />} 
            variant="outlined" 
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ 
            px: 3, 
            pt: 2, 
            bgcolor: '#f8fafc',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            '& .MuiTab-root': { fontWeight: 700, px: 4 }
          }}
        >
          <Tab 
            icon={<LucideClock size={18} />} 
            iconPosition="start" 
            label="Pending Approvals" 
          />
          <Tab 
            icon={<LucideCheckCircle size={18} />} 
            iconPosition="start" 
            label="All Users" 
          />
        </Tabs>

        <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 2 }}>
           <TextField
              size="small"
              placeholder="Search by Name, Email, or ID..."
              fullWidth
              sx={{ maxWidth: 400 }}
              value={usersSearch}
              onChange={(e) => setUsersSearch(e.target.value)}
           />
        </Box>

        <TableContainer sx={{ maxHeight: '70vh' }}>
          {isLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <CircularProgress color="primary" />
              <Typography sx={{ mt: 2 }} color="text.secondary">Loading users...</Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">No users found</Typography>
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Member</TableCell>
                   <TableCell sx={{ fontWeight: 800, bgcolor: '#f1f5f9' }}>Role</TableCell>
                   <TableCell sx={{ fontWeight: 900, bgcolor: '#e2e8f0', color: '#002147', borderLeft: '2px solid #cbd5e1' }}>Permissions</TableCell>
                   <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Details</TableCell>
                   <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Status</TableCell>
                   <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Verified</TableCell>
                   <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.profileImage} sx={{ width: 45, height: 45 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        color={ROLE_COLORS[user.role] || 'default'} 
                        sx={{ fontWeight: 700, height: 24 }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderLeft: '2px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                        {user.permissions?.map((p: string) => (
                          <Chip 
                            key={p} 
                            label={p.replace('MANAGE_', '')} 
                            size="small" 
                            color="primary"
                            variant="filled" 
                            sx={{ fontSize: '0.6rem', height: 20, fontWeight: 700 }} 
                          />
                        ))}
                        {(!user.permissions || user.permissions.length === 0) && (
                          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                            {user.role === 'ADMIN' ? 'Full Access' : 'No extra permissions'}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {user.role === 'TEACHER' ? user.designation : user.studentId}
                      </Typography>
                      {user.phone && <Typography variant="caption" color="primary">{user.phone}</Typography>}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        size="small" 
                        variant="outlined"
                        color={STATUS_COLORS[user.status] || 'default'} 
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.isEmailVerified ? (
                        <Chip 
                          icon={<LucideShieldCheck size={14} />}
                          label="Verified" 
                          size="small" 
                          color="success"
                          sx={{ fontWeight: 700 }}
                        />
                      ) : (
                        <Chip 
                          label="Unverified" 
                          size="small" 
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {user.status === 'PENDING' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton 
                                color="success" 
                                onClick={() => handleStatusUpdate(user._id, 'ACTIVE')}
                                disabled={isUpdating}
                              >
                                <LucideUserCheck size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton 
                                color="error"
                                onClick={() => handleStatusUpdate(user._id, 'INACTIVE')}
                                disabled={isUpdating}
                              >
                                <LucideUserX size={20} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {user.status === 'ACTIVE' && (
                          <Button 
                            size="small" 
                            color="error" 
                            startIcon={<LucideShieldAlert size={16} />}
                            onClick={() => handleStatusUpdate(user._id, 'SUSPENDED')}
                            disabled={isUpdating}
                          >
                            Suspend
                          </Button>
                        )}
                        {user.status === 'SUSPENDED' && (
                          <Button 
                            size="small" 
                            color="success" 
                            startIcon={<LucideUserCheck size={16} />}
                            onClick={() => handleStatusUpdate(user._id, 'ACTIVE')}
                            disabled={isUpdating}
                          >
                            Reactivate
                          </Button>
                        )}
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user._id)}
                          >
                            <LucideTrash2 size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Rights">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEditDialog(true);
                            }}
                          >
                            <LucideShieldCheck size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Profile">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEditDialog(true);
                            }}
                          >
                            <LucideEdit size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Edit User Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField 
              fullWidth 
              label="Name" 
              value={selectedUser?.name || ''} 
              onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
            />
            {selectedUser?.role === 'TEACHER' && (
              <TextField 
                fullWidth 
                label="Designation" 
                value={selectedUser?.designation || ''} 
                onChange={(e) => setSelectedUser({...selectedUser, designation: e.target.value})}
              />
            )}
            {selectedUser?.role === 'STUDENT' && (
              <>
                <TextField 
                  fullWidth 
                  label="Student ID" 
                  value={selectedUser?.studentId || ''} 
                  onChange={(e) => setSelectedUser({...selectedUser, studentId: e.target.value})}
                />
                <Stack direction="row" spacing={2}>
                  <TextField 
                    fullWidth 
                    label="Batch" 
                    value={selectedUser?.batch || ''} 
                    onChange={(e) => setSelectedUser({...selectedUser, batch: e.target.value})}
                  />
                  <TextField 
                    fullWidth 
                    label="Session" 
                    value={selectedUser?.session || ''} 
                    onChange={(e) => setSelectedUser({...selectedUser, session: e.target.value})}
                  />
                </Stack>
              </>
            )}
            <TextField 
              fullWidth 
              label="Phone" 
              value={selectedUser?.phone || ''} 
              onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
            />

            <FormControl fullWidth>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                label="Permissions"
                value={selectedUser?.permissions || []}
                onChange={(e) => setSelectedUser({ ...selectedUser, permissions: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {PERMISSIONS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#002147' }}
            disabled={isUpdatingUser}
            onClick={async () => {
              try {
                await updateUser({ id: selectedUser._id, data: selectedUser }).unwrap();
                toast.success('User updated successfully');
                setOpenEditDialog(false);
                refetch();
              } catch (err) {
                toast.error('Failed to update user');
              }
            }}
          >
            {isUpdatingUser ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {activeTab === 0 && users.length > 0 && (
        <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
          Review the profiles below and click the green checkmark to authorize their access to the department portal.
        </Alert>
      )}

      {/* Bulk Create Dialog */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Bulk Create Users</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Paste a list of <b>student emails</b> (one per line).
            The system will automatically extract Student ID, Session, and Batch from the email (e.g., 2021331002@student.sust.edu).
            Passwords will be generated and emailed to them.
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Role for these users</InputLabel>
            <Select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)} label="Role for these users">
              <MenuItem value="STUDENT">Students</MenuItem>
              <MenuItem value="TEACHER">Teachers</MenuItem>
            </Select>
          </FormControl>
          <TextField
            multiline
            rows={10}
            fullWidth
            placeholder="2021331001@student.sust.edu&#10;2021331002@student.sust.edu"
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#16a34a' }}
            disabled={!bulkData || isBulkCreating}
            onClick={async () => {
              const emails = bulkData.trim().split(/[\n,]+/).map(e => e.trim()).filter(Boolean);

              try {
                const response = await bulkCreate({ users: emails, role: bulkRole }).unwrap();
                const results = response.data || [];
                const successCount = (results as any[]).filter(r => r.success).length;
                toast.success(`Successfully created ${successCount} users.`);
                setOpenBulkDialog(false);
                setBulkData('');
                refetch();
              } catch (err) {
                console.error(err);
                toast.error('Bulk creation failed. Check console for details.');
              }
            }}
          >
            {isBulkCreating ? 'Creating...' : 'Create Users'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
