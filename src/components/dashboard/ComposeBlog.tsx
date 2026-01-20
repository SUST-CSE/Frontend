'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { LucideSend, LucideType, LucideTag } from 'lucide-react';
import BlogEditor from './BlogEditor';
import { useCreateBlogMutation } from '@/features/blog/blogApi';

const CATEGORIES = [
  'Research',
  'Academic',
  'Life at SUST',
  'Technology',
  'Career',
  'Others'
];

export default function ComposeBlog({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [createBlog, { isLoading, error, isSuccess }] = useCreateBlogMutation();

  const handleSubmit = async () => {
    if (!title || !content || !category) return;
    
    try {
      await createBlog({ 
        title, 
        content, 
        category,
        tags: [] // Can add tag support later
      }).unwrap();
      
      // Clear form on success
      setTitle('');
      setContent('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create blog:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LucideType size={24} color="#002147" />
        Compose New Blog Post
      </Typography>

      {isSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Blog post submitted successfully! It will be visible after admin approval.
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>Failed to submit blog. Please try again.</Alert>}

      <Stack spacing={3}>
        <TextField 
          fullWidth 
          label="Blog Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a catchy title..."
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField 
          select 
          fullWidth 
          label="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          InputProps={{ startAdornment: <LucideTag size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, ml: 0.5 }}>Content</Typography>
          <BlogEditor 
            value={content} 
            onChange={setContent} 
            placeholder="Share your thoughts with the community..." 
          />
        </Box>

        <Button 
          variant="contained" 
          size="large" 
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LucideSend size={20} />}
          onClick={handleSubmit}
          disabled={isLoading || !title || !content}
          sx={{ alignSelf: 'flex-end', py: 1.5, px: 6, bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
        >
          Submit for Approval
        </Button>
      </Stack>
    </Box>
  );
}
