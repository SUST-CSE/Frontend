import { Container } from '@mui/material';
import BlogModerator from '@/components/admin/BlogModerator';

export default function BlogModerationPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BlogModerator />
    </Container>
  );
}
