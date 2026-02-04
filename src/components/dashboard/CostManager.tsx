import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  Chip,
  Stack,
  Avatar,
  TextField,
} from '@mui/material';
import { 
  LucidePlus, 
  LucideFileText, 
  LucideCheckCircle, 
  LucideXCircle, 
  LucideClock, 
  LucideDollarSign
} from 'lucide-react';
import { 
  useGetMyCostRequestsQuery, 
  useGetPendingApprovalsQuery, 
  useGetAllCostsQuery,
  useApproveCostRequestMutation,
  useRejectCostRequestMutation,
  useAddCheckNumberMutation
} from '@/features/finance/financeApi';
import CreateCostDialog from './CreateCostDialog';
import ApprovalActionDialog from './ApprovalActionDialog';
import { toast } from 'sonner';

interface ICostRequest {
  _id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    designation: string;
    avatar?: string;
  };
  approvedByL1?: { approvedBy: { name: string }; approvedAt: string };
  approvedByL2?: { approvedBy: { name: string }; approvedAt: string };
  approvedByFinal?: { approvedBy: { name: string }; approvedAt: string };
  checkNumber?: string;
  checkDate?: string;
  attachments?: string[];
}

interface CostManagerProps {
  permissions: string[];
  isAdmin: boolean;
}

const CostStatusChip = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { color: '#fbbf24', label: 'Pending L1' };
      case 'APPROVED_L1': return { color: '#3b82f6', label: 'Pending L2' };
      case 'APPROVED_L2': return { color: '#8b5cf6', label: 'Pending Final' };
      case 'APPROVED_FINAL': return { color: '#16a34a', label: 'Approved (Check Pending)' };
      case 'REJECTED': return { color: '#ef4444', label: 'Rejected' };
      default: return { color: '#64748b', label: status };
    }
  };
  
  const config = getStatusConfig(status);
  
  if (status === 'APPROVED_FINAL') {
      return <Chip label="Approved" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} />;
  }

  return (
    <Chip 
      label={config.label} 
      size="small" 
      sx={{ 
        bgcolor: `${config.color}20`, 
        color: config.color, 
        fontWeight: 700,
        border: `1px solid ${config.color}40`
      }} 
    />
  );
};

export default function CostManager({ permissions, isAdmin }: CostManagerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'APPROVE' | 'REJECT' | 'CHECK' | null;
    id: string | null;
  }>({ open: false, type: null, id: null });

  // API Hooks
  const { data: myRequests, isLoading: myLoading } = useGetMyCostRequestsQuery({});
  const { data: pendingApprovals, isLoading: pendingLoading } = useGetPendingApprovalsQuery({}, {
    skip: !isAdmin && !permissions.some(p => p.startsWith('APPROVE_COST'))
  });
  const { data: allCosts, isLoading: allLoading } = useGetAllCostsQuery({}, {
    skip: !isAdmin
  });

  const [approveRequest, { isLoading: isApproving }] = useApproveCostRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectCostRequestMutation();
  const [addCheck, { isLoading: isAddingCheck }] = useAddCheckNumberMutation();

  const handleAction = async (inputValue: string) => {
    const { type, id } = actionDialog;
    if (!id || !type) return;

    try {
      if (type === 'APPROVE') {
        await approveRequest({ id, comment: inputValue }).unwrap();
        toast.success('Request approved successfully');
      } else if (type === 'REJECT') {
        await rejectRequest({ id, reason: inputValue }).unwrap();
        toast.success('Request rejected');
      } else if (type === 'CHECK') {
        await addCheck({ id, checkNumber: inputValue }).unwrap();
        toast.success('Check number added');
      }
      setActionDialog({ open: false, type: null, id: null });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Action failed');
    }
  };

  const filterByDate = (items: ICostRequest[]) => {
    if (!startDate && !endDate) return items;
    return items.filter(item => {
      const date = new Date(item.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && date < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (date > endOfDay) return false;
      }
      return true;
    });
  };

  const getFilteredData = () => {
    if (activeTab === 0) return filterByDate(myRequests?.data || []);
    if (activeTab === 1) return filterByDate(pendingApprovals?.data || []);
    if (activeTab === 2) return filterByDate(allCosts?.data || []);
    return [];
  };

  const filteredData = getFilteredData();
  const totalSum = filteredData.reduce((sum, item) => sum + item.amount, 0);

  const hasApprovalAccess = isAdmin || permissions.some(p => p.startsWith('APPROVE_COST'));

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#002147">Cost Management</Typography>
          <Typography variant="body2" color="text.secondary">Track expenses and manage approvals</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {(permissions.includes('SUBMIT_COST') || isAdmin) && (
            <Button 
              variant="contained" 
              startIcon={<LucidePlus size={18} />}
              onClick={() => setCreateOpen(true)}
              sx={{ bgcolor: '#002147', borderRadius: 2 }}
            >
              New Request
            </Button>
          )}
        </Stack>
      </Box>

      {/* Date Filters & Summary */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#f8fafc' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              size="small"
              onClick={() => { setStartDate(''); setEndDate(''); }}
            >
              Reset
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'right', px: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Cost for Period:</Typography>
              <Typography variant="h6" fontWeight={900} color="#0369a1">৳ {totalSum.toLocaleString()}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}
        >
          <Tab label="My Requests" icon={<LucideFileText size={16} />} iconPosition="start" />
          {hasApprovalAccess && <Tab label={`Pending Approvals (${pendingApprovals?.data?.length || 0})`} icon={<LucideClock size={16} />} iconPosition="start" />}
          {isAdmin && <Tab label="All Records" icon={<LucideDollarSign size={16} />} iconPosition="start" />}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <CostList 
            data={filteredData} 
            isLoading={activeTab === 0 ? myLoading : activeTab === 1 ? pendingLoading : allLoading} 
            onAction={setActionDialog}
            viewOnly={activeTab === 0}
            isAdminView={activeTab === 2}
          />
        </Box>
      </Paper>

      <CreateCostDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      
      {actionDialog.open && (
        <ApprovalActionDialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, type: null, id: null })}
          title={
            actionDialog.type === 'APPROVE' ? 'Approve Request' : 
            actionDialog.type === 'REJECT' ? 'Reject Request' : 'Add Check Number'
          }
          actionText={
            actionDialog.type === 'APPROVE' ? 'Approve' : 
            actionDialog.type === 'REJECT' ? 'Reject' : 'Save Check Number'
          }
          isLoading={isApproving || isRejecting || isAddingCheck}
          onSubmit={handleAction}
          isReject={actionDialog.type === 'REJECT'}
          inputLabel={actionDialog.type === 'CHECK' ? 'Check Number' : undefined}
        />
      )}
    </Box>
  );
}

// Sub-component for rendering lists
const CostList = ({ data, isLoading, onAction, viewOnly = false, isAdminView = false }: { 
  data: ICostRequest[], 
  isLoading: boolean, 
  onAction: (val: { open: boolean; type: 'APPROVE' | 'REJECT' | 'CHECK' | null; id: string | null; }) => void, 
  viewOnly?: boolean, 
  isAdminView?: boolean 
}) => {
  if (isLoading) return <Typography sx={{ py: 4, textAlign: 'center' }}>Loading...</Typography>;
  if (!data || data.length === 0) return <Typography color="text.secondary" align="center" sx={{ py: 6 }}>No records found</Typography>;

  return (
    <Grid container spacing={3}>
      {data.map((item) => (
        <Grid size={{ xs: 12 }} key={item._id}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid #e5e7eb', 
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                borderColor: '#cbd5e1'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar 
                  src={item.createdBy?.avatar} 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: '#002147',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}
                >
                  {item.createdBy?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Requested by <span style={{ fontWeight: 700, color: '#002147' }}>{item.createdBy?.name}</span> • {item.createdBy?.designation || 'Faculty/Student'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={900} color="#0369a1" sx={{ fontSize: '1.1rem' }}>
                      ৳{item.amount.toLocaleString()}
                    </Typography>
                    <CostStatusChip status={item.status} />
                  </Stack>
                </Box>
              </Box>
              
              <Stack direction="row" spacing={1}>
                {!viewOnly && !isAdminView && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<LucideCheckCircle size={16} />}
                      onClick={() => onAction({ open: true, type: 'APPROVE', id: item._id })}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<LucideXCircle size={16} />}
                      onClick={() => onAction({ open: true, type: 'REJECT', id: item._id })}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
                
                {isAdminView && item.status === 'APPROVED_FINAL' && !item.checkNumber && (
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => onAction({ open: true, type: 'CHECK', id: item._id })}
                    sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#002147' }}
                  >
                    Add Check Number
                  </Button>
                )}
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, borderLeft: '3px solid #cbd5e1' }}>
              {item.description}
            </Typography>
            
            {/* Approval Trail with "Stamps" */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" fontWeight={800} color="#64748b" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1.5 }}>
                Approval Workflow Status
              </Typography>
              <Grid container spacing={2}>
                 {[
                   { label: 'L1 (GenSec)', data: item.approvedByL1 },
                   { label: 'L2 (Treasurer)', data: item.approvedByL2 },
                   { label: 'Final (Admin)', data: item.approvedByFinal }
                 ].map((step, idx) => (
                   <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                     <Box 
                       sx={{ 
                         p: 1.5, 
                         borderRadius: 3, 
                         border: '1px solid',
                         borderColor: step.data ? '#dcfce7' : '#f1f5f9',
                         bgcolor: step.data ? '#f0fdf4' : '#f8fafc',
                         textAlign: 'center',
                         position: 'relative'
                       }}
                     >
                       <Typography variant="caption" display="block" fontWeight={700} color="text.disabled" sx={{ mb: 0.5 }}>
                         {step.label}
                       </Typography>
                       {step.data ? (
                         <Box>
                           <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', display: 'block' }}>
                             {step.data.approvedBy?.name}
                           </Typography>
                           <Typography variant="caption" sx={{ color: '#166534', opacity: 0.7, fontSize: '0.65rem' }}>
                             {new Date(step.data.approvedAt).toLocaleDateString()}
                           </Typography>
                           <Box sx={{ 
                             position: 'absolute', 
                             top: 5, 
                             right: 5, 
                             color: '#22c55e',
                             opacity: 0.5
                           }}>
                             <LucideCheckCircle size={14} />
                           </Box>
                         </Box>
                       ) : (
                         <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                           Pending...
                         </Typography>
                       )}
                     </Box>
                   </Grid>
                 ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
               <Typography variant="caption" color="text.disabled">
                 Submitted on {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </Typography>
               {item.checkNumber && (
                 <Chip 
                   icon={<LucideCheckCircle size={14} />} 
                   label={`CHECK ISSUED: ${item.checkNumber}`} 
                   size="small" 
                   sx={{ fontWeight: 900, bgcolor: '#002147', color: '#fff', '& .MuiChip-icon': { color: '#fff' } }} 
                 />
               )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
