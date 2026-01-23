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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Card,
  CardMedia
} from '@mui/material';
import { LucideSend, LucideLightbulb, LucideChevronDown, LucideImage, LucideX } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useCreateBlogMutation } from '@/features/blog/blogApi';
import { RootState } from '@/store';
import BlogEditor from '@/components/dashboard/BlogEditor';

const CATEGORIES = ['Research', 'Academic', 'Life at SUST', 'Technology', 'Career', 'Others'];

export default function CreateBlogPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    // Check guest fields if not authenticated
    if (!isAuthenticated && (!guestName || !guestEmail)) {
      setErrorMsg('Please provide your name and email');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }
      
      // Add guest info if not authenticated
      if (!isAuthenticated) {
        formData.append('guestName', guestName);
        formData.append('guestEmail', guestEmail);
      }

      await createBlog(formData).unwrap();
      setSuccessMsg('Blog submitted successfully! Needs admin approval to be published.');
      setErrorMsg('');
      
      // Clear form
      setTitle('');
      setContent('');
      setCategory(CATEGORIES[0]);
      setImage(null);
      setImagePreview(null);
      setGuestName('');
      setGuestEmail('');
      
      setTimeout(() => router.push('/blogs'), 3000);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrorMsg(error.data?.message || 'Failed to submit blog');
      setSuccessMsg('');
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} color="#000000" gutterBottom>
          Write a <span style={{ color: '#16a34a' }}>Story</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Share your knowledge with the community. All posts are moderated.
        </Typography>

        {/* Writing Tips Section */}
        <Accordion sx={{ mb: 4, borderRadius: 2, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
          <AccordionSummary 
            expandIcon={<LucideChevronDown size={20} />}
            sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LucideLightbulb size={20} color="#16a34a" />
              <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
                Writing Tips & Best Practices
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>📝 Writing Tips:</Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  • Start with a captivating title that summarizes your main idea<br/>
                  • Choose the most relevant category for your content<br/>
                  • Break content into paragraphs for better readability<br/>
                  • Use clear and concise language<br/>
                  • Proofread before submitting
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>⌨️ Formatting Shortcuts:</Typography>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  <strong>Bold</strong>: Select text → Click <strong>B</strong> or Ctrl+B<br/>
                  <em>Italic</em>: Select text → Click <em>I</em> or Ctrl+I<br/>
                  <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>Code</code>: Select text → Click code block icon<br/>
                  Lists: Click bullet/number icon<br/>
                  Blockquote: Click quote icon for emphasis
                </Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {successMsg && <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>}

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            InputProps={{ sx: { borderRadius: 2 } }}
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Guest User Fields */}
          {!isAuthenticated && (
            <>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                👤 You&apos;re posting as a guest. Your blog will be reviewed before publishing.
              </Alert>
              <TextField
                label="Your Name"
                fullWidth
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                placeholder="Enter your full name"
                InputProps={{ sx: { borderRadius: 2 } }}
              />
              <TextField
                label="Your Email"
                type="email"
                fullWidth
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                placeholder="example@email.com"
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText="Your email will not be publicly displayed"
              />
            </>
          )}

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
