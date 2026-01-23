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
  IconButton, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import { LucideEye, LucideTrash2, LucideBookOpen, LucideAlertCircle } from 'lucide-react';
import { useGetMyBlogsQuery, useDeleteBlogMutation } from '@/features/blog/blogApi';
import { format } from 'date-fns';
import Link from 'next/link';

const STATUS_COLORS: Record<string, any> = {
  PUBLISHED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
};

export default function MyBlogsList() {
  const { data: blogsData, isLoading, error } = useGetMyBlogsQuery(undefined);
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleCharLimit = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id).unwrap();
      } catch (err) {
        console.error('Failed to delete blog:', err);
      }
    }
  };

  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Failed to load your blogs.</Typography>;

  const blogs = blogsData?.data || [];

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LucideBookOpen size={24} color="#002147" />
        My Authored Blogs
      </Typography>

      {blogs.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <LucideAlertCircle size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary">You haven't written any blogs yet.</Typography>
          <Typography variant="body2" color="text.secondary">Share your stories and research with the department!</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog: any) => (
                <TableRow key={blog._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{handleCharLimit(blog.title, 40)}</TableCell>
                  <TableCell>
                    <Chip label={blog.category} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={blog.status} 
                      size="small" 
                      color={STATUS_COLORS[blog.status] || 'default'} 
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="View Post">
                        <Link href={`/blogs/${blog._id}`} passHref>
                          <IconButton size="small" color="primary">
                            <LucideEye size={18} />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(blog._id)}
                          disabled={isDeleting}
                        >
                          <LucideTrash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
