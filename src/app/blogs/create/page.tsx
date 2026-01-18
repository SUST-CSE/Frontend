'use client';

import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { LucideSend } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useCreateBlogMutation } from '@/features/blog/blogApi';
import { RootState } from '@/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const CATEGORIES = ['TECHNOLOGY', 'RESEARCH', 'CAMPUS LIFE', 'ALUMNI', 'CAREER'];

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    try {
      await createBlog(data).unwrap();
      setSuccessMsg('Blog submitted successfully! Needs admin approval to be published.');
      setErrorMsg('');
      setTimeout(() => router.push('/blogs'), 3000);
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to submit blog');
      setSuccessMsg('');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} color="#000000" gutterBottom>
          Write a <span style={{ color: '#16a34a' }}>Story</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Share your knowledge with the community. All posts are moderated.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {successMsg && <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>}

          <TextField
            label="Title"
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            defaultValue=""
            inputProps={register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Content"
            multiline
            rows={12}
            fullWidth
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LucideSend size={20} />}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              bgcolor: '#000000',
              color: '#ffffff',
              borderRadius: 2,
              '&:hover': { bgcolor: '#16a34a' }
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
