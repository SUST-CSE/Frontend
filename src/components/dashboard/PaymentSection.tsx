'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  TextField, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { LucideHistory, LucideWallet, LucideLock } from 'lucide-react';
import { useGetPaymentHistoryQuery, useInitiatePaymentMutation } from '@/features/payment/paymentApi';

const PAYMENT_PURPOSES = [
  'ADMISSION_FEE',
  'SEMESTER_FEE',
  'EVENT_REGISTRATION',
  'SOCIETY_MEMBERSHIP',
  'OTHER'
];

export default function PaymentSection() {
  const { data: historyData, isLoading: historyLoading } = useGetPaymentHistoryQuery({});
  const [initiatePayment, { isLoading: initLoading, error: initError }] = useInitiatePaymentMutation();
  
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('SEMESTER_FEE');

  const handlePayment = async () => {
    try {
      const result = await initiatePayment({ amount: Number(amount), category: purpose, method: 'BKASH' }).unwrap();
      window.alert('Payment initiated! Transaction ID: ' + result.data.transactionId);
    } catch (err) {}
  };

  const history = historyData?.data || [];

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -0.5 }}>
          Payments & <span style={{ color: '#16a34a' }}>Finances</span>
        </Typography>
        <Typography color="text.secondary">
          Securely manage your semester fees and event payments.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Payment Initiation */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Stack spacing={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.5, bgcolor: '#000000', borderRadius: 2, color: '#ffffff' }}>
                  <LucideWallet size={24} />
                </Box>
                <Typography variant="h6" fontWeight={800}>Make Payment</Typography>
              </Stack>

              {initError && <Alert severity="error" variant="filled">Failed to initiate payment.</Alert>}

              <TextField
                fullWidth
                label="Amount (BDT)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                InputProps={{ sx: { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                select
                label="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                {PAYMENT_PURPOSES.map((option) => (
                  <MenuItem key={option} value={option}>{option.replace(/_/g, ' ')}</MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={initLoading || !amount}
                onClick={handlePayment}
                sx={{ 
                  py: 2, 
                  bgcolor: '#000000', 
                  fontWeight: 700, 
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#16a34a' }
                }}
              >
                {initLoading ? <CircularProgress size={24} color="inherit" /> : 'Pay via bKash / SSL'}
              </Button>

              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ color: '#64748b' }}>
                <LucideLock size={16} />
                <Typography variant="caption" sx={{ textAlign: 'center' }}>
                  Secure SSL 128-bit Encrypted Transaction
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* History */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={800}>Transaction History</Typography>
              <Button startIcon={<LucideHistory size={18} />} sx={{ color: '#000000', fontWeight: 600 }}>Download Statement</Button>
            </Stack>

            {historyLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress sx={{ color: '#16a34a' }} />
              </Box>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.length > 0 ? history.map((pay: any) => (
                      <TableRow key={pay._id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{pay.transactionId}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{pay.category}</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>৳ {pay.amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={pay.status} 
                            size="small" 
                            sx={{ 
                              fontWeight: 800, 
                              fontSize: '0.7rem',
                              bgcolor: pay.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                              color: pay.status === 'COMPLETED' ? '#166534' : '#92400e',
                              borderRadius: 1
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(pay.paidAt || pay.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#94a3b8' }}>No transaction history found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
