'use client';

import { useState } from 'react';
import {
  Box,
  Container,
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
} from '@mui/material';
import {
  LucideWallet,
  LucideTrendingUp,
  LucideTrendingDown,
  LucidePlus,
  LucideTrash2,
  LucideFilter,
  LucideDownload,
} from 'lucide-react';
import {
  useGetTransactionsQuery,
  useGetFinancialSummaryQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from '@/features/finance/financeApi';
import {
  TRANSACTION_TYPE,
  TRANSACTION_CATEGORY,
  TX_TYPE_COLORS,
} from '@/features/finance/financeConstants';
import toast from 'react-hot-toast';

export default function AdminFinanceDashboard() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: TRANSACTION_TYPE.EXPENSE,
    category: 'SOCIETY_FUND',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { data: summaryData } = useGetFinancialSummaryQuery({});
  const { data: transactionsData, isLoading: isTXLoading } = useGetTransactionsQuery({});
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const summary = summaryData?.data || { totalIncome: 0, totalExpense: 0, balance: 0, monthlyIncome: 0, monthlyExpense: 0 };
  const transactions = transactionsData?.data || [];

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.amount) {
        toast.error('Please fill required fields');
        return;
      }
      await addTransaction({
        ...formData,
        amount: Number(formData.amount),
      }).unwrap();
      toast.success('Transaction recorded');
      setOpenAddDialog(false);
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideWallet size={32} />
            Department Finance
          </Typography>
          <Typography color="text.secondary">
            Manage departmental funds, track budgets, and audit expenses
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<LucidePlus size={20} />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Current Balance', value: summary.balance, icon: <LucideWallet />, color: '#002147' },
          { label: 'Monthly Income', value: summary.monthlyIncome, icon: <LucideTrendingUp />, color: '#16a34a' },
          { label: 'Monthly Expense', value: summary.monthlyExpense, icon: <LucideTrendingDown />, color: '#dc2626' },
        ].map((card, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: i === 0 ? '#f8fafc' : 'white' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} color={card.color}>
                    ৳{card.value.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Transaction History */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight={800}>Transaction History</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small"><LucideFilter size={18} /></IconButton>
            <IconButton size="small"><LucideDownload size={18} /></IconButton>
          </Stack>
        </Box>
        
        <TableContainer>
          {isTXLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx: { _id: string; date: string; title: string; description?: string; category: string; type: string; amount: number }) => (
                  <TableRow key={tx._id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{tx.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{tx.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={TRANSACTION_CATEGORY[tx.category] || tx.category} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={tx.type} 
                        size="small" 
                        color={TX_TYPE_COLORS[tx.type]} 
                        sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={800} color={tx.type === 'INCOME' ? 'success.main' : 'error.main'}>
                        {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleDelete(tx._id)}>
                        <LucideTrash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
                      <Typography color="text.secondary">No transactions found</Typography>
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
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              placeholder="e.g., Sponsorship from Grameenphone"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Amount (৳)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              <TextField
                select
                fullWidth
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
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#002147' }}
            disabled={isAdding}
            onClick={handleAdd}
          >
            {isAdding ? 'Saving...' : 'Save Transaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
