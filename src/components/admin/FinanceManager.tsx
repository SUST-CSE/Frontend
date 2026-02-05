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
  Divider,
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
  const [selectedTx, setSelectedTx] = useState<any>(null);

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
              { 
                label: 'Departmental Balance', 
                value: summary.balance, 
                icon: <LucideWallet size={24} />, 
                grad: 'linear-gradient(135deg, #002147 0%, #004080 100%)', 
                color: '#fff',
                sub: 'Available Funds'
              },
              { 
                label: 'Cumulative Income', 
                value: summary.totalIncome, 
                icon: <LucideTrendingUp size={24} />, 
                grad: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', 
                color: '#fff',
                sub: 'Total Inflow'
              },
              { 
                label: 'Cumulative Expense', 
                value: summary.totalExpense, 
                icon: <LucideTrendingDown size={24} />, 
                grad: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', 
                color: '#fff',
                sub: 'Total Outgo'
              },
            ].map((card, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 5, 
                    background: card.grad, 
                    color: card.color,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140
                  }}
                >
                  <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.15, transform: 'scale(1.8)' }}>
                    {card.icon}
                  </Box>
                  
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="caption" fontWeight={800} sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.65rem' }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1, letterSpacing: -1 }}>
                      ৳{card.value.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.5)' }} />
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>
                      {card.sub}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <LucideTrendingUp size={20} color="#002147" />
                  Budget Utilization Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Detailed analysis of departmental expenditure across various functional categories
                </Typography>
              </Box>
              <Chip label="Real-time Analytics" size="small" variant="filled" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', color: '#475569' }} />
            </Box>

            {!summary.categoryBreakdown || Object.keys(summary.categoryBreakdown).length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center', border: '2px dashed #f1f5f9', borderRadius: 4 }}>
                 <Typography color="text.disabled" fontWeight={600}>No transaction metadata available for visualization</Typography>
              </Box>
            ) : (
              <Grid container spacing={5}>
                {Object.entries(summary.categoryBreakdown).map(([cat, values]: [string, any]) => {
                  const expensePercent = summary.totalExpense > 0 ? (values.expense / summary.totalExpense) * 100 : 0;
                  const incomePercent = summary.totalIncome > 0 ? (values.income / summary.totalIncome) * 100 : 0;
                  const isCostManagement = cat === 'COST_MANAGEMENT';

                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={cat}>
                      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: 1, 
                            bgcolor: isCostManagement ? '#eff6ff' : '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCostManagement ? '#2563eb' : '#64748b',
                            border: '1px solid',
                            borderColor: isCostManagement ? '#dbeafe' : '#f1f5f9'
                          }}>
                            {isCostManagement ? <LucideLayers size={16} /> : <LucideFileText size={16} />}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800} color="#1e293b" sx={{ lineHeight: 1 }}>
                              {TRANSACTION_CATEGORY[cat] || cat}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Spending Impact: {expensePercent.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" fontWeight={900} color={values.expense > 0 ? '#1e293b' : 'text.disabled'}>
                            ৳{values.expense.toLocaleString()}
                          </Typography>
                          {values.income > 0 && (
                            <Typography variant="caption" fontWeight={800} color="#10b981">
                              IN: ৳{values.income.toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${expensePercent}%`, 
                            background: isCostManagement ? 'linear-gradient(90deg, #002147, #3b82f6)' : '#94a3b8',
                            borderRadius: 4,
                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 2
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
                          case 'SOCIETY_FUND': return <LucideUsers size={14} />;
                          case 'EVENT_SPONSORSHIP': return <LucideTrendingUp size={14} />;
                          case 'EQUIPMENT_PURCHASE': return <LucideHardDrive size={14} />;
                          case 'MAINTENANCE': return <LucideSettings size={14} />;
                          case 'REFRESHMENT': return <LucideCoffee size={14} />;
                          case 'COST_MANAGEMENT': return <LucideLayers size={14} />;
                          default: return <LucideFileText size={14} />;
                        }
                      };

                      return (
                        <TableRow 
                          key={tx._id} 
                          hover 
                          onClick={() => setSelectedTx(tx)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { bgcolor: '#f8fafc !important' }
                          }}
                        >
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', display: 'block' }}>
                              {new Date(tx.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ 
                                width: 36,
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2, 
                                bgcolor: tx.type === 'INCOME' ? '#f0fdf4' : '#fff1f2',
                                color: tx.type === 'INCOME' ? '#16a34a' : '#ef4444',
                                border: '1px solid',
                                borderColor: tx.type === 'INCOME' ? '#dcfce7' : '#fee2e2'
                              }}>
                                {tx.type === 'INCOME' ? <LucideArrowUpRight size={18} /> : <LucideArrowDownRight size={18} />}
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.2 }}>{tx.title}</Typography>
                                <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                                  Ref: #{tx._id.slice(-6).toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Chip 
                              icon={getCategoryIcon(tx.category)}
                              label={TRANSACTION_CATEGORY[tx.category] || tx.category} 
                              size="small" 
                              variant="filled" 
                              sx={{ 
                                fontWeight: 800, 
                                fontSize: '0.65rem', 
                                height: 24, 
                                borderRadius: 1.5,
                                bgcolor: tx.category === 'COST_MANAGEMENT' ? '#002147' : '#f1f5f9', 
                                color: tx.category === 'COST_MANAGEMENT' ? '#fff' : '#475569',
                                '& .MuiChip-icon': { color: 'inherit', ml: '4px !important' }
                              }} 
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tx.type === 'INCOME' ? '#10b981' : '#f43f5e' }} />
                              <Typography variant="caption" fontWeight={900} color={tx.type === 'INCOME' ? '#059669' : '#dc2626'}>
                                {tx.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2.5 }}>
                            <Typography variant="subtitle1" fontWeight={900} color={tx.type === 'INCOME' ? '#059669' : '#1e293b'} sx={{ letterSpacing: -0.5 }}>
                              {tx.type === 'INCOME' ? '+' : ''}৳{tx.amount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2.5 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                              {tx.proofUrls && tx.proofUrls.length > 0 && (
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#fff', 
                                    color: '#002147', 
                                    border: '1px solid #e2e8f0',
                                    '&:hover': { bgcolor: '#f8fafc', borderColor: '#002147' } 
                                  }}
                                >
                                  <LucideFileText size={16} />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(tx._id)} 
                                sx={{ 
                                  bgcolor: '#fff', 
                                  color: '#dc2626', 
                                  border: '1px solid #fee2e2',
                                  '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' } 
                                }}
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

      {/* Transaction Details Dialog */}
      <Dialog 
        open={!!selectedTx} 
        onClose={() => setSelectedTx(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {selectedTx && (
          <>
            <DialogTitle sx={{ 
              bgcolor: selectedTx.type === 'INCOME' ? '#f0fdf4' : '#fff1f2', 
              color: selectedTx.type === 'INCOME' ? '#166534' : '#9f1239',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 3,
              pb: 2
            }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>{selectedTx.title}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>
                  REF ID: {selectedTx._id}
                </Typography>
              </Box>
              <Chip 
                label={selectedTx.type} 
                size="small" 
                sx={{ 
                  fontWeight: 900, 
                  bgcolor: selectedTx.type === 'INCOME' ? '#166534' : '#9f1239', 
                  color: '#fff' 
                }} 
              />
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block">DESCRIPTION</Typography>
                  <Typography variant="body1" sx={{ color: '#1e293b', lineHeight: 1.6 }}>{selectedTx.description || 'No description provided.'}</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" display="block">AMOUNT</Typography>
                    <Typography variant="h6" fontWeight={900}>৳{selectedTx.amount.toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" display="block">CATEGORY</Typography>
                    <Chip 
                      label={TRANSACTION_CATEGORY[selectedTx.category] || selectedTx.category} 
                      size="small"
                      sx={{ fontWeight: 800, mt: 0.5 }}
                    />
                  </Grid>
                </Grid>

                <Divider />

                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block">AUDIT METADATA</Typography>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" display="block" color="text.secondary">Recorded On</Typography>
                        <Typography variant="body2" fontWeight={700}>{new Date(selectedTx.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {selectedTx.proofUrls && selectedTx.proofUrls.length > 0 && (
                  <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block">DOCUMENTATION / PROOF ({selectedTx.proofUrls.length})</Typography>
                    <Stack spacing={1}>
                      {selectedTx.proofUrls.map((url: string, idx: number) => (
                        <Button 
                          key={idx}
                          fullWidth 
                          variant="outlined" 
                          startIcon={<LucideFileText size={18} />}
                          component="a"
                          href={url}
                          target="_blank"
                          sx={{ 
                            borderRadius: 3, 
                            py: 1, 
                            borderColor: '#e2e8f0', 
                            color: '#002147',
                            fontWeight: 700,
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#f8fafc', borderColor: '#002147' }
                          }}
                        >
                          Document {idx + 1}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
              <Button onClick={() => setSelectedTx(null)} sx={{ color: '#64748b', fontWeight: 800 }}>Close Archive</Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<LucideTrash2 size={16} />}
                onClick={() => {
                  handleDelete(selectedTx._id);
                  setSelectedTx(null);
                }}
                sx={{ borderRadius: 2, fontWeight: 800 }}
              >
                Delete Record
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
