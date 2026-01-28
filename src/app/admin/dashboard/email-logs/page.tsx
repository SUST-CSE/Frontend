'use client';

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
  Chip,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LucideMail,
  LucideCheckCircle,
  LucideAlertCircle,
  LucideRefreshCcw,
  LucideInfo,
} from 'lucide-react';
import { apiSlice } from '@/store/apiSlice';

// Using apiSlice.injectEndpoints to define the hook since we haven't made a separate file yet
export const emailLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmailLogs: builder.query({
      query: () => '/email-logs',
      providesTags: ['EmailLog'],
    }),
  }),
});

export const { useGetEmailLogsQuery } = emailLogApi;

export default function AdminEmailLogsPage() {
  const { data, isLoading, refetch, isFetching } = useGetEmailLogsQuery({});
  const logs = data?.data || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideMail size={32} />
            Email Notification Logs
          </Typography>
          <Typography color="text.secondary">
            Monitor all outgoing system emails and delivery status
          </Typography>
        </Box>
        <IconButton onClick={() => refetch()} disabled={isFetching}>
          <LucideRefreshCcw size={20} className={isFetching ? 'animate-spin' : ''} />
        </IconButton>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          {isLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log: any) => (
                  <TableRow key={log._id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(log.sentAt).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.recipient}</TableCell>
                    <TableCell>
                      <Chip label={log.type} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.subject}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {log.status === 'SUCCESS' ? (
                          <LucideCheckCircle size={16} color="#16a34a" />
                        ) : (
                          <LucideAlertCircle size={16} color="#dc2626" />
                        )}
                        <Typography variant="body2" fontWeight={700} color={log.status === 'SUCCESS' ? 'success.main' : 'error.main'}>
                          {log.status}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {log.error && (
                        <Tooltip title={log.error}>
                          <IconButton size="small" color="error">
                            <LucideInfo size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
                       <Typography color="text.secondary">No email logs found</Typography>
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
