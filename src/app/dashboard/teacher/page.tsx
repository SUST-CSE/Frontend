'use client';

import { Box, Typography, Container } from '@mui/material';

export default function TeacherDashboard() {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Container>
        <Typography variant="h3" fontWeight={900}>Teacher Dashboard</Typography>
         <Typography color="text.secondary" sx={{ mt: 2 }}>Welcome to the faculty portal. Features coming soon.</Typography>
      </Container>
    </Box>
  );
}
