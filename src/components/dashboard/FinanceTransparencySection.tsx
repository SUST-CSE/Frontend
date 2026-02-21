'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { LucideWallet, LucideTrendingUp, LucideTrendingDown, LucideSettings } from 'lucide-react';
import { useGetTransactionsQuery, useGetFinancialSummaryQuery, useAdjustBalanceMutation } from '@/features/finance/financeApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';
import { TRANSACTION_CATEGORY } from '@/features/finance/financeConstants';
import { useState } from 'react';
import TransactionDetailsDialog from './TransactionDetailsDialog';
import { LucideArrowUpRight, LucideArrowDownRight } from 'lucide-react';

export default function FinanceTransparencySection() {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'ADMIN';

  const { data: summaryResponse, isLoading: summaryLoading } = useGetFinancialSummaryQuery(undefined);
  const { data: transactionsResponse, isLoading: transactionsLoading } = useGetTransactionsQuery({});
  const [adjustBalance, { isLoading: isAdjusting }] = useAdjustBalanceMutation();

  const summary = summaryResponse?.data || { totalIncome: 0, totalExpense: 0, balance: 0, monthlyIncome: 0, monthlyExpense: 0 };
  const transactions = transactionsResponse?.data || [];

  if (summaryLoading || transactionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#002147' }} />
      </Box>
    );
  }

  const handleAdjustBalance = async () => {
    if (!newBalance || !adjustReason || adjustReason.length < 5) {
      toast.error('Please provide a valid new balance and a reason (min 5 chars).');
      return;
    }

    try {
      await adjustBalance({ newBalance: Number(newBalance), reason: adjustReason }).unwrap();
      toast.success('Balance adjusted successfully');
      setIsAdjustBalanceOpen(false);
      setNewBalance('');
      setAdjustReason('');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to adjust balance');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>Department Financial Transparency</Typography>
          <Typography variant="body2" color="text.secondary">A transparent view of department funds, expenses, and transaction history.</Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<LucideSettings size={18} />}
            onClick={() => {
              setNewBalance(summary.balance.toString());
              setIsAdjustBalanceOpen(true);
            }}
            sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            Adjust Balance
          </Button>
        )}
      </Box>

      {/* Transparency Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Current Balance', value: summary.balance, icon: <LucideWallet />, color: '#002147' },
          { label: 'Total Income', value: summary.monthlyIncome, icon: <LucideTrendingUp />, color: '#16a34a' },
          { label: 'Total Expense', value: summary.monthlyExpense, icon: <LucideTrendingDown />, color: '#dc2626' },
        ].map((card, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: i === 0 ? '#f8fafc' : 'white' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color={card.color}>
                    ৳{card.value.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight={800} color="#002147">Financial Audit Log</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fff', borderBottom: '2px solid #f1f5f9' }}>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>DETAILS</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>CATEGORY</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1, textAlign: 'right' }}>AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow
                  key={tx._id}
                  hover
                  onClick={() => setSelectedTx(tx)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&:hover': { bgcolor: '#f8fafc !important' }
                  }}
                >
                  <TableCell sx={{ py: 2.5, width: 120 }}>
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      bgcolor: tx.type === 'INCOME' ? '#22c55e' : '#ef4444',
                      borderRadius: '0 4px 4px 0'
                    }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                      {new Date(tx.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {new Date(tx.date).getFullYear()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        bgcolor: tx.type === 'INCOME' ? '#f0fdf4' : '#fff1f2',
                        color: tx.type === 'INCOME' ? '#16a34a' : '#ef4444',
                        border: '1px solid',
                        borderColor: tx.type === 'INCOME' ? '#dcfce7' : '#fee2e2'
                      }}>
                        {tx.type === 'INCOME' ? <LucideArrowUpRight size={16} /> : <LucideArrowDownRight size={16} />}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>{tx.title}</Typography>
                        {tx.relatedCostRequest && (
                          <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800, fontSize: '0.65rem' }}>
                            AUTHENTICATED COST
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={TRANSACTION_CATEGORY[tx.category] || tx.category}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: '#f1f5f9',
                        color: '#475569',
                        height: 24
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5, textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight={900} color={tx.type === 'INCOME' ? '#15803d' : '#b91c1c'}>
                      {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 10, textAlign: 'center' }}>
                    <Typography color="text.secondary">No transactions recorded yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TransactionDetailsDialog
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        isAdmin={isAdmin}
      />

      {/* Adjust Balance Dialog */}
      <Dialog open={isAdjustBalanceOpen} onClose={() => setIsAdjustBalanceOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Adjust Ledger Balance</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            This action will automatically generate an income or expense transaction to force the overall balance to match your input, while keeping the ledger mathematically valid.
          </Typography>
          <TextField
            fullWidth
            label="Current Ledger Balance"
            value={`৳${summary.balance.toLocaleString()}`}
            disabled
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="New Target Balance (৳)"
            type="number"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Reason for Adjustment"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            multiline
            rows={2}
            required
            helperText="Minimum 5 characters. This will be publicly visible in the audit log."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsAdjustBalanceOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            onClick={handleAdjustBalance}
            variant="contained"
            color="primary"
            disabled={isAdjusting || !newBalance || adjustReason.length < 5 || Number(newBalance) === summary.balance}
            sx={{ fontWeight: 700 }}
          >
            {isAdjusting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Adjustment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
