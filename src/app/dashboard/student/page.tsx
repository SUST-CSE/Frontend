'use client';

import { Box, Typography, Container } from '@mui/material';

export default function StudentDashboard() {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Container>
        <Typography variant="h3" fontWeight={900}>Student Dashboard</Typography>
         <Typography color="text.secondary" sx={{ mt: 2 }}>Welcome to your student portal. Features coming soon.</Typography>
      </Container>
    </Box>
  );
}
