'use client';

import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip, 
  Button, 
  Stack,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import { LucideBoxes, LucidePlus, LucideTrash2, LucideEdit, LucideExternalLink } from 'lucide-react';
import { useGetSocietiesQuery } from '@/features/society/societyApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SocietyManager() {
  const { data: societiesData, isLoading } = useGetSocietiesQuery({});
  const router = useRouter();
  const societies = societiesData?.data || [];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideBoxes size={32} />
            Society Management
          </Typography>
          <Typography color="text.secondary">
            Manage department societies and their chapters
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => router.push('/admin/dashboard/societies/create')}
          sx={{ bgcolor: '#002147', fontWeight: 700 }}
        >
          Add Society
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         {isLoading ? <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box> : (
           <TableContainer>
             <Table>
               <TableHead sx={{ bgcolor: '#f8fafc' }}>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 800 }}>Society</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {societies.map((society: { _id: string; name: string; description: string; logo?: string; membersCount?: number }) => (
                   <TableRow key={society._id} hover>
                     <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={society.logo} sx={{ width: 40, height: 40, border: '1px solid #e2e8f0' }}>
                            {society.name.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={800}>{society.name}</Typography>
                        </Box>
                     </TableCell>
                     <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {society.description}
                        </Typography>
                     </TableCell>
                     <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" color="primary" onClick={() => router.push(`/admin/dashboard/societies/${society._id}`)}>
                            <LucideEdit size={18} />
                          </IconButton>
                          <IconButton size="small" component="a" href={`/societies/${society._id}`} target="_blank">
                            <LucideExternalLink size={18} />
                          </IconButton>
                        </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         )}
      </Paper>
    </Box>
  );
}
