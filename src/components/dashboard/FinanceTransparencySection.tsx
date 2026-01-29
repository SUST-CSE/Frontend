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
  Button, 
  CircularProgress 
} from '@mui/material';
import { LucideWallet, LucideTrendingUp, LucideTrendingDown, LucideFileText, LucideImage } from 'lucide-react';
import { useGetTransactionsQuery, useGetFinancialSummaryQuery } from '@/features/finance/financeApi';
import { TRANSACTION_CATEGORY, TX_TYPE_COLORS } from '@/features/finance/financeConstants';

export default function FinanceTransparencySection() {
  const { data: summaryResponse, isLoading: summaryLoading } = useGetFinancialSummaryQuery(undefined);
  const { data: transactionsResponse, isLoading: transactionsLoading } = useGetTransactionsQuery({});

  const summary = summaryResponse?.data || { totalIncome: 0, totalExpense: 0, balance: 0, monthlyIncome: 0, monthlyExpense: 0 };
  const transactions = transactionsResponse?.data || [];

  if (summaryLoading || transactionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#002147' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>Department Financial Transparency</Typography>
        <Typography variant="body2" color="text.secondary">A transparent view of department funds, expenses, and transaction history.</Typography>
      </Box>

      {/* Transparency Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Current Balance', value: summary.balance, icon: <LucideWallet />, color: '#002147' },
          { label: 'Monthly Income', value: summary.monthlyIncome, icon: <LucideTrendingUp />, color: '#16a34a' },
          { label: 'Monthly Expense', value: summary.monthlyExpense, icon: <LucideTrendingDown />, color: '#dc2626' },
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

      {/* Detailed Transactions */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>Recent Transactions</Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Proof</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx: { 
                _id: string; 
                date: string; 
                title: string; 
                description: string; 
                category: string; 
                type: 'INCOME' | 'EXPENSE'; 
                proofUrl?: string; 
                proofType?: string; 
                amount: number 
              }) => (
                <TableRow key={tx._id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.875rem' }}>{tx.title}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                      {tx.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={TRANSACTION_CATEGORY[tx.category] || tx.category} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tx.type} 
                      size="small" 
                      color={TX_TYPE_COLORS[tx.type]} 
                      sx={{ fontWeight: 800, fontSize: '0.65rem' }} 
                    />
                  </TableCell>
                  <TableCell>
                    {tx.proofUrl ? (
                      <Button 
                        size="small" 
                        startIcon={tx.proofType === 'pdf' ? <LucideFileText size={14} /> : <LucideImage size={14} />}
                        href={tx.proofUrl}
                        target="_blank"
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', p: 0.5 }}
                      >
                        View
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.disabled">None</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={800} color={tx.type === 'INCOME' ? 'success.main' : 'error.main'}>
                      {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
                    <Typography color="text.secondary">No transactions recorded yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
