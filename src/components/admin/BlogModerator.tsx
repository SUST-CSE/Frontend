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
  Chip, 
  Button, 
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { LucideCheck, LucideX, LucideEye, LucideTrash2, LucideBookOpen } from 'lucide-react';
import { 
  useGetPendingBlogsQuery, 
  useVerifyBlogMutation, 
  useGetBlogsQuery, 
  useDeleteBlogMutation 
} from '@/features/blog/blogApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BlogModerator() {
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingBlogsQuery({});
  const { data: publishedData, isLoading: publishedLoading } = useGetBlogsQuery({});
  const [verifyBlog, { isLoading: isVerifying }] = useVerifyBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const pendingBlogs = pendingData?.data || [];
  const publishedBlogs = publishedData?.data || [];

  const handleVerify = async (id: string, status: 'PUBLISHED' | 'REJECTED') => {
    if (confirm(`Are you sure you want to ${status} this blog?`)) {
      try {
        await verifyBlog({ id, status }).unwrap();
        toast.success(`Blog ${status.toLowerCase()} successfully`);
      } catch (err) {
        toast.error('Failed to update blog status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully');
      } catch (err) {
        toast.error('Failed to delete blog');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LucideBookOpen size={32} />
          Blog Management
        </Typography>
        <Typography color="text.secondary">
          Moderate and manage blog submissions
        </Typography>
      </Box>

      {/* Pending Requests */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', mb: 6 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          Pending Requests 
          <Chip label={pendingBlogs.length} color="warning" size="small" sx={{ fontWeight: 700 }} />
        </Typography>

        {pendingLoading ? <CircularProgress /> : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingBlogs.length > 0 ? pendingBlogs.map((blog: any) => (
                  <TableRow key={blog._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{blog.title}</TableCell>
                    <TableCell>{blog.author?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip label={blog.category} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button 
                          size="small" 
                          startIcon={<LucideEye size={16} />}
                          onClick={() => setSelectedBlog(blog)}
                          sx={{ color: '#64748b' }}
                        >
                          View
                        </Button>
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          startIcon={<LucideCheck size={16} />}
                          onClick={() => handleVerify(blog._id, 'PUBLISHED')}
                          disabled={isVerifying}
                          sx={{ fontWeight: 700 }}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<LucideX size={16} />}
                          onClick={() => handleVerify(blog._id, 'REJECTED')}
                          disabled={isVerifying}
                          sx={{ fontWeight: 700 }}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>No pending blogs</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Published Blogs */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
          Published / Managed Blogs
        </Typography>

        {publishedLoading ? <CircularProgress /> : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {publishedBlogs.map((blog: any) => (
                  <TableRow key={blog._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{blog.title}</TableCell>
                    <TableCell>{blog.author?.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={blog.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: blog.status === 'PUBLISHED' ? '#dcfce7' : '#fee2e2', 
                          color: blog.status === 'PUBLISHED' ? '#166534' : '#991b1b',
                          fontWeight: 700, 
                          fontSize: '0.7rem' 
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<LucideTrash2 size={16} />}
                        onClick={() => handleDelete(blog._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* View Details Dialog */}
      <Dialog open={!!selectedBlog} onClose={() => setSelectedBlog(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedBlog?.title}</DialogTitle>
        <DialogContent dividers>
           <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              By {selectedBlog?.author?.name} | {selectedBlog?.category}
           </Typography>
           <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>{selectedBlog?.content}</Typography>
        </DialogContent>
        <DialogActions>
           <Button onClick={() => setSelectedBlog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
