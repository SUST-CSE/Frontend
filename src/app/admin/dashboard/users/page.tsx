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
  Alert
} from '@mui/material';
import { 
  LucideUsers, 
  LucideClock, 
  LucideCheckCircle, 
  LucideXCircle, 
  LucideUserCheck, 
  LucideUserX,
  LucideShieldAlert,
  LucideRefreshCcw
} from 'lucide-react';
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '@/features/user/userApi';

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

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({
    status: activeTab === 0 ? 'PENDING' : undefined,
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
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
        <Button 
          startIcon={<LucideRefreshCcw size={18} />} 
          variant="outlined" 
          onClick={() => refetch()}
        >
          Refresh
        </Button>
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
                  <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Status</TableCell>
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
                    <TableCell align="right">
                      {user.status === 'PENDING' && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
                        </Box>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {activeTab === 0 && users.length > 0 && (
        <Alert severity="info" sx={{ mt: 3, borderRadius: 3 }}>
          Review the profiles below and click the green checkmark to authorize their access to the department portal.
        </Alert>
      )}
    </Container>
  );
}
