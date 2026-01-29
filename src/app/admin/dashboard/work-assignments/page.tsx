import { Container } from '@mui/material';
import WorkManager from '@/components/admin/WorkManager';

export default function AdminWorkAssignmentsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <WorkManager />
    </Container>
  );
}
