'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
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
import {
  LucideWallet,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideFileText,
  LucideImage
} from 'lucide-react';
import {
  useGetTransactionsQuery,
  useGetFinancialSummaryQuery
} from '@/features/finance/financeApi';
import {
  TRANSACTION_CATEGORY,
} from '@/features/finance/financeConstants';

export default function FinanceHistoryPage() {
  const { data: summaryData } = useGetFinancialSummaryQuery({});
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({});

  const summary = summaryData?.data || { totalIncome: 0, totalExpense: 0, balance: 0, monthlyIncome: 0, monthlyExpense: 0 };
  const transactions = transactionsData?.data || [];

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LucideWallet size={40} />
          Department <span style={{ color: '#16a34a' }}>Finance</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800 }}>
          Transparency is key to our department. Here you can track all income and expenses, including sponsorships, event funding, and maintenance.
        </Typography>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Total Balance', value: summary.balance, icon: <LucideWallet />, color: '#002147' },
          { label: 'Total Income', value: summary.monthlyIncome, icon: <LucideTrendingUp />, color: '#16a34a' },
          { label: 'Total Expense', value: summary.monthlyExpense, icon: <LucideTrendingDown />, color: '#dc2626' },
        ].map((card, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: i === 0 ? '#f8fafc' : 'white' }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
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

      {/* Transaction Table */}
      <Paper elevation={0} sx={{ borderRadius: 5, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight={800}>Financial Transparency Report</Typography>
        </Box>

        <TableContainer>
          {isLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Transaction Details</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Proof</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx: { _id: string; date: string; title: string; description?: string; category: string; type: string; amount: number; proofUrl?: string; proofType?: string }) => (
                  <TableRow key={tx._id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{tx.title}</Typography>
                      {tx.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {tx.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={TRANSACTION_CATEGORY[tx.category] || tx.category}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      {tx.proofUrl ? (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={tx.proofType === 'pdf' ? <LucideFileText size={16} /> : <LucideImage size={16} />}
                          href={tx.proofUrl}
                          target="_blank"
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          View Proof
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.disabled">No attachment</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" fontWeight={900} color={tx.type === 'INCOME' ? 'success.main' : 'error.main'}>
                        {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 12, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" fontWeight={500}>
                        No financial records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Container>
  );
}
