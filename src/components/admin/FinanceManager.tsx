'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Avatar,
} from '@mui/material';
import {
  LucideWallet,
  LucideTrendingUp,
  LucideTrendingDown,
  LucidePlus,
  LucideTrash2,
  LucideFilter,
  LucideFileText,
  LucideCreditCard,
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucideCoffee,
  LucideHardDrive,
  LucideSettings,
  LucideUsers,
  LucideLayers
} from 'lucide-react';
import {
  useGetTransactionsQuery,
  useGetFinancialSummaryQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useSyncApprovedCostsMutation,
} from '@/features/finance/financeApi';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
  TX_TYPE_COLORS,
} from '@/features/finance/financeConstants';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CostManager from '../dashboard/CostManager';

export default function FinanceManager() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: TRANSACTION_TYPE.EXPENSE,
    category: 'SOCIETY_FUND',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const { data: summaryData, error: summaryError } = useGetFinancialSummaryQuery({});
  const { data: transactionsData, isLoading: isTXLoading, error: txError } = useGetTransactionsQuery({});
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [syncFinance, { isLoading: isSyncing }] = useSyncApprovedCostsMutation();

  const summary = summaryData?.data || { totalIncome: 0, totalExpense: 0, balance: 0, monthlyIncome: 0, monthlyExpense: 0 };
  const transactions = transactionsData?.data || [];

  const handleSync = async () => {
    try {
      const res = await syncFinance({}).unwrap();
      // @ts-ignore
      toast.success(res.message || 'Finances synced successfully');
    } catch (err) {
      toast.error('Failed to sync finances');
    }
  };

  const isAuthError = (summaryError as any)?.status === 401 || (txError as any)?.status === 401;

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.amount) {
        toast.error('Please fill required fields');
        return;
      }

      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, value.toString());
      });
      if (proofFile) {
        body.append('proof', proofFile);
      }

      await addTransaction(body).unwrap();
      toast.success('Transaction recorded');
      setOpenAddDialog(false);
      setProofFile(null);
      setFormData({
        title: '',
        amount: '',
        type: TRANSACTION_TYPE.EXPENSE,
        category: 'SOCIETY_FUND',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction record?')) {
      try {
        await deleteTransaction(id).unwrap();
        toast.success('Transaction deleted');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LucideWallet size={28} />
                Department Finance Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delegated access to manage departmental funds, audit expenses, and approve costs
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleSync} 
                disabled={isSyncing}
                startIcon={isSyncing ? <CircularProgress size={16} /> : <LucideTrendingUp size={16} />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                {isSyncing ? 'Syncing...' : 'Master Sync'}
              </Button>
              {activeTab === 0 && (
                <Button
                  variant="contained"
                  startIcon={<LucidePlus size={20} />}
                  onClick={() => setOpenAddDialog(true)}
                  sx={{ bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
                >
                  Add Transaction
                </Button>
              )}
            </Stack>
          </Box>

          {isAuthError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, border: '1px solid #fecaca' }}>
              <AlertTitle sx={{ fontWeight: 800 }}>Session Expired (401)</AlertTitle>
              Your login session has expired. To see the updated financial overview, please sign out and sign in again.
            </Alert>
          )}
         
         <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'transparent', mb: 3 }}>
           <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
             <Tab label="Financial Overview" icon={<LucideWallet size={20} />} iconPosition="start" />
             <Tab label="Cost Requests & Approvals" icon={<LucideCreditCard size={20} />} iconPosition="start" />
           </Tabs>
         </Paper>
      </Box>

      {/* Tab 0: Financial Overview */}
      {activeTab === 0 && (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* Overview Cards with Gradients */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Current Balance', value: summary.balance, icon: <LucideWallet size={24} />, grad: 'linear-gradient(135deg, #002147 0%, #003366 100%)', color: '#fff' },
              { label: 'Total Income', value: summary.totalIncome, icon: <LucideTrendingUp size={24} />, grad: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', color: '#fff' },
              { label: 'Total Expense', value: summary.totalExpense, icon: <LucideTrendingDown size={24} />, grad: 'linear-gradient(135deg, #9f1239 0%, #f43f5e 100%)', color: '#fff' },
            ].map((card, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    background: card.grad, 
                    color: card.color,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'scale(1.5)' }}>
                    {card.icon}
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight={700} sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={900}>
                        ৳{card.value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Detailed Breakdown with Progress Bars */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LucideTrendingUp size={24} color="#10b981" />
                  Budget Distribution Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visual breakdown of departmental spending and income sources
                </Typography>
              </Box>
              <Chip label="All Time Data" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>

            {!summary.categoryBreakdown || Object.keys(summary.categoryBreakdown).length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', border: '2px dashed #f1f5f9', borderRadius: 3 }}>
                 <Typography color="text.disabled">No categorized transactions found to display breakdown</Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {Object.entries(summary.categoryBreakdown).map(([cat, values]: [string, any]) => {
                  const expensePercent = summary.totalExpense > 0 ? (values.expense / summary.totalExpense) * 100 : 0;
                  const isCostManagement = cat === 'COST_MANAGEMENT';

                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={cat}>
                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color={isCostManagement ? 'primary' : 'inherit'}>
                            {TRANSACTION_CATEGORY[cat] || cat}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ৳{values.expense.toLocaleString()} spent • {expensePercent.toFixed(1)}% of total budget
                          </Typography>
                        </Box>
                        {values.income > 0 && (
                          <Typography variant="caption" fontWeight={700} color="success.main">
                            +৳{values.income.toLocaleString()} inflow
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ height: 10, bgcolor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${expensePercent}%`, 
                            background: isCostManagement ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : '#64748b',
                            borderRadius: 5,
                            transition: 'width 1s ease-in-out'
                          }} 
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>

          {/* Transaction History */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#002147">Financial Overview</Typography>
                <Typography variant="caption" color="text.secondary">Real-time departmental financial health</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="primary" 
                  onClick={handleSync} 
                  startIcon={isSyncing ? <CircularProgress size={16} /> : <LucideTrendingUp size={16} />}
                  disabled={isSyncing}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  {isSyncing ? 'Syncing...' : 'Administrative Sync'}
                </Button>
                <Button size="small" startIcon={<LucideFilter size={16} />} sx={{ fontWeight: 700 }}>Filter</Button>
              </Stack>
            </Box>
            
            <TableContainer>
              {isTXLoading ? (
                <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress size={24} /></Box>
              ) : (
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>Details</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', textAlign: 'right' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', textAlign: 'right' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx: any) => {
                      const getCategoryIcon = (cat: string) => {
                        switch (cat) {
                          case 'SOCIETY_FUND': return <LucideUsers size={16} />;
                          case 'EVENT_SPONSORSHIP': return <LucideTrendingUp size={16} />;
                          case 'EQUIPMENT_PURCHASE': return <LucideHardDrive size={16} />;
                          case 'MAINTENANCE': return <LucideSettings size={16} />;
                          case 'REFRESHMENT': return <LucideCoffee size={16} />;
                          case 'COST_MANAGEMENT': return <LucideLayers size={16} />;
                          default: return <LucideFileText size={16} />;
                        }
                      };

                      return (
                        <TableRow key={tx._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                {new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                {new Date(tx.date).getFullYear()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{ 
                                p: 1, 
                                borderRadius: 2, 
                                bgcolor: tx.type === 'INCOME' ? '#f0fdf4' : '#fff1f2',
                                color: tx.type === 'INCOME' ? '#166534' : '#9f1239'
                              }}>
                                {tx.type === 'INCOME' ? <LucideArrowUpRight size={18} /> : <LucideArrowDownRight size={18} />}
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: '0.85rem', color: '#1e293b' }}>{tx.title}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 250 }}>{tx.description}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={getCategoryIcon(tx.category)}
                              label={TRANSACTION_CATEGORY[tx.category] || tx.category} 
                              size="small" 
                              variant="outlined" 
                              sx={{ 
                                fontWeight: 700, 
                                fontSize: '0.65rem', 
                                height: 24, 
                                borderRadius: 1.5, 
                                px: 0.5,
                                bgcolor: tx.category === 'COST_MANAGEMENT' ? '#eff6ff' : '#f8fafc', 
                                color: tx.category === 'COST_MANAGEMENT' ? '#1d4ed8' : '#475569', 
                                borderColor: tx.category === 'COST_MANAGEMENT' ? '#bfdbfe' : '#e2e8f0',
                                '& .MuiChip-icon': { color: 'inherit' }
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={tx.type} 
                              size="small" 
                              sx={{ 
                                fontWeight: 900, 
                                fontSize: '0.6rem', 
                                height: 20, 
                                borderRadius: 1,
                                bgcolor: tx.type === 'INCOME' ? '#dcfce7' : '#fee2e2',
                                color: tx.type === 'INCOME' ? '#15803d' : '#b91c1c'
                              }} 
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight={900} color={tx.type === 'INCOME' ? '#10b981' : '#f43f5e'} sx={{ fontSize: '0.95rem' }}>
                              {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {tx.proofUrl && (
                                <IconButton 
                                  size="small" 
                                  component="a" 
                                  href={tx.proofUrl} 
                                  target="_blank" 
                                  sx={{ bgcolor: '#f1f5f9', color: '#475569', '&:hover': { bgcolor: '#e2e8f0' } }}
                                >
                                  <LucideFileText size={16} />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDelete(tx._id)} 
                                sx={{ bgcolor: '#fff1f2', color: '#e11d48', '&:hover': { bgcolor: '#ffe4e6' } }}
                              >
                                <LucideTrash2 size={16} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 5, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">No transactions found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>

          {/* Add Transaction Dialog */}
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Record Transaction</DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  placeholder="e.g., Sponsorship from Grameenphone"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Amount (৳)"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {Object.values(TRANSACTION_TYPE).map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {Object.entries(TRANSACTION_CATEGORY).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" gutterBottom display="block">
                    Proof of Transaction (Optional)
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<LucidePlus size={16} />}
                    sx={{ borderStyle: 'dashed', py: 1 }}
                  >
                    {proofFile ? proofFile.name : 'Choose File (PDF or Image)'}
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
              <Button onClick={() => setOpenAddDialog(false)} size="small">Cancel</Button>
              <Button 
                variant="contained" 
                size="small"
                sx={{ bgcolor: '#002147' }}
                disabled={isAdding}
                onClick={handleAdd}
              >
                {isAdding ? 'Saving...' : 'Save Transaction'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Tab 1: Cost Manager */}
      {activeTab === 1 && (
        <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <CostManager 
            permissions={user?.permissions || []} 
            isAdmin={user?.role === 'ADMIN'} 
          />
        </Box>
      )}
    </Box>
  );
}
