import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Stack,
  Grid,
  Divider,
  Button,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import { 
  LucideFileText, 
  LucideTrash2, 
  LucideCheckCircle, 
  LucideX,
  LucideClock
} from 'lucide-react';
import { TRANSACTION_CATEGORY } from '@/features/finance/financeConstants';

interface TransactionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: any;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function TransactionDetailsDialog({ 
  open, 
  onClose, 
  transaction, 
  onDelete,
  isAdmin = false 
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const cost = transaction.relatedCostRequest;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 5, 
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        } 
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: transaction.type === 'INCOME' ? '#f0fdf4' : '#fff1f2', 
        color: transaction.type === 'INCOME' ? '#166534' : '#9f1239',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pt: 3,
        pb: 2
      }}>
        <Box>
          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>{transaction.title}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, letterSpacing: 0.5 }}>
            REF ID: {transaction._id.toUpperCase()}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip 
            label={transaction.type} 
            size="small" 
            sx={{ 
              fontWeight: 900, 
              bgcolor: transaction.type === 'INCOME' ? '#166534' : '#9f1239', 
              color: '#fff',
              height: 24,
              fontSize: '0.65rem'
            }} 
          />
          <IconButton onClick={onClose} size="small" sx={{ color: 'inherit', opacity: 0.5 }}>
            <LucideX size={18} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block" sx={{ letterSpacing: 1 }}>DESCRIPTION</Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', lineHeight: 1.6, fontWeight: 500 }}>
              {transaction.description || 'No detailed description provided for this record.'}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" display="block" sx={{ letterSpacing: 1 }}>AMOUNT</Typography>
              <Typography variant="h5" fontWeight={900} color="#1e293b">৳{transaction.amount.toLocaleString()}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" display="block" sx={{ letterSpacing: 1 }}>CATEGORY</Typography>
              <Chip 
                label={TRANSACTION_CATEGORY[transaction.category] || transaction.category} 
                size="small"
                sx={{ 
                  fontWeight: 800, 
                  mt: 0.5, 
                  bgcolor: '#f1f5f9', 
                  color: '#475569',
                  border: '1px solid #e2e8f0'
                }}
              />
            </Grid>
          </Grid>

          <Divider />

          {/* Detailed Audit Trail (If linked to a cost request) */}
          {cost ? (
            <Box>
              <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block" sx={{ letterSpacing: 1 }}>ORIGINAL COST AUDIT</Typography>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar src={cost.createdBy?.avatar} sx={{ width: 40, height: 40, bgcolor: '#002147' }}>
                      {cost.createdBy?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" fontWeight={700}>Requested By</Typography>
                      <Typography variant="subtitle2" fontWeight={800}>{cost.createdBy?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{cost.createdBy?.designation}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ mb: 1 }}>Approval History</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {[
                        { label: 'L1', data: cost.approvedByL1 },
                        { label: 'L2', data: cost.approvedByL2 },
                        { label: 'Final', data: cost.approvedByFinal }
                      ].map((step, idx) => (
                        <Chip 
                          key={idx}
                          icon={<LucideCheckCircle size={12} />}
                          label={`${step.label}: ${step.data?.approvedBy?.name || 'Approved'}`}
                          size="small"
                          sx={{ 
                            height: 24, 
                            fontSize: '0.65rem', 
                            fontWeight: 700,
                            bgcolor: '#dcfce7',
                            color: '#166534',
                            border: '1px solid #bbf7d0'
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          ) : (
            <Box>
              <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block" sx={{ letterSpacing: 1 }}>AUDIT METADATA</Typography>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  <LucideClock size={16} />
                </Box>
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Recorded On</Typography>
                  <Typography variant="body2" fontWeight={700}>{new Date(transaction.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {transaction.proofUrls && transaction.proofUrls.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={800} color="text.secondary" gutterBottom display="block" sx={{ letterSpacing: 1 }}>DOCUMENTATION / PROOF ({transaction.proofUrls.length})</Typography>
              <Stack spacing={1}>
                {transaction.proofUrls.map((url: string, idx: number) => (
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
                      py: 1.2, 
                      borderColor: '#e2e8f0', 
                      color: '#002147',
                      fontWeight: 700,
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { bgcolor: '#f8fafc', borderColor: '#002147', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
                    }}
                  >
                    View Document {idx + 1}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 800, textTransform: 'none' }}>Close Record</Button>
        {isAdmin && onDelete && (
          <Button 
            variant="contained" 
            color="error"
            startIcon={<LucideTrash2 size={16} />}
            onClick={() => {
              onDelete(transaction._id);
              onClose();
            }}
            sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: 'none', px: 3 }}
          >
            Delete Archive
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
