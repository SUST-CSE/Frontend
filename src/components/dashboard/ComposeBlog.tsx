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
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { LucideSend, LucideType, LucideTag, LucideImage, LucideX, LucideLightbulb, LucideChevronDown } from 'lucide-react';
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createBlog, { isLoading, error, isSuccess }] = useCreateBlogMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!title || !content || !category) return;
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      await createBlog(formData).unwrap();
      
      // Clear form on success
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
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

      {/* Writing Tips Section */}
      <Accordion sx={{ mb: 3, borderRadius: 2, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
        <AccordionSummary 
          expandIcon={<LucideChevronDown size={20} />}
          sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LucideLightbulb size={20} color="#16a34a" />
            <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
              Writing Tips & Formatting Shortcuts
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>📝 Writing Tips:</Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                • Start with a captivating title that summarizes your main idea<br/>
                • Use the cover image to make your post visually appealing<br/>
                • Break content into paragraphs for better readability<br/>
                • Use headers to organize your thoughts into sections<br/>
                • Add code blocks when sharing technical content
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>⌨️ Formatting Shortcuts:</Typography>
              <Typography variant="body2" color="text.secondary" component="div" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <strong>Bold</strong>: Select text → Click <strong>B</strong> or Ctrl+B<br/>
                <em>Italic</em>: Select text → Click <em>I</em> or Ctrl+I<br/>
                <code style={{ bgcolor: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>Code</code>: Select text → Click code block icon<br/>
                Lists: Click bullet/number icon or start with • or 1.<br/>
                Blockquote: Click quote icon for emphasis
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

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

        {/* Image Upload Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, ml: 0.5 }}>Blog Cover Image (Optional)</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="blog-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="blog-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<LucideImage size={20} />}
              sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#e2e8f0' }}
            >
              {image ? 'Change Image' : 'Upload Image'}
            </Button>
          </label>
          
          {imagePreview && (
            <Card sx={{ mt: 2, position: 'relative', maxWidth: 400, borderRadius: 2 }}>
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <LucideX size={18} />
              </IconButton>
              <CardMedia
                component="img"
                height="200"
                image={imagePreview}
                alt="Blog cover preview"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          )}
        </Box>

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
