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
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LucideFileText,
  LucideEye,
  LucideClock,
  LucideCheckCircle,
  LucideXCircle,
  LucidePlus,
} from 'lucide-react';
import { useGetMyApplicationsQuery } from '@/features/application/applicationApi';
import {
  APP_STATUS_COLORS,
  APP_TYPE_LABELS
} from '@/features/application/applicationConstants';
import Link from 'next/link';

export default function MyApplicationsPage() {
  const { data: appsData, isLoading } = useGetMyApplicationsQuery({});
  const applications = appsData?.data || [];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#002147">
            My Applications
          </Typography>
          <Typography color="text.secondary">
            Track the status of your submitted requests
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/applications/submit"
          variant="contained"
          startIcon={<LucidePlus size={18} />}
          sx={{ bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
        >
          New Application
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <TableContainer>
          {isLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Submitted On</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Response</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{app.title}</TableCell>
                    <TableCell>
                      <Chip label={APP_TYPE_LABELS[app.type]} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        size="small"
                        color={APP_STATUS_COLORS[app.status]}
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      {app.feedback ? (
                        <Tooltip title={app.feedback}>
                          <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'primary.main', cursor: 'help' }}>
                            {app.feedback}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">No feedback yet</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" component={Link} href={`/applications/${app._id}`}>
                        <LucideEye size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
                      <Typography color="text.secondary">You haven&apos;t submitted any applications yet.</Typography>
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
