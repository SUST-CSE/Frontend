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
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideTrophy, LucideUpload, LucideX } from 'lucide-react';
import { useGetAchievementsQuery, useCreateAchievementMutation, useDeleteAchievementMutation } from '@/features/content/contentApi';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  teamName: z.string().optional(),
  competitionName: z.string().min(1, 'Competition name is required'),
  position: z.string().min(1, 'Position is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['CP', 'HACKATHON', 'CTF', 'DL', 'ACADEMIC', 'OTHER']),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

export default function AchievementManager() {
  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [achievementFiles, setAchievementFiles] = useState<File[]>([]);
  const { data: achievementData, isLoading: achievementsLoading } = useGetAchievementsQuery({});
  const [createAchievement, { isLoading: isCreatingAchievement }] = useCreateAchievementMutation();
  const [deleteAchievement] = useDeleteAchievementMutation();

  const achievementForm = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      teamName: '',
      competitionName: '',
      position: '',
      date: '',
      category: 'CP',
    }
  });

  const achievements = achievementData?.data || [];

  const onAchievementSubmit = async (data: AchievementFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      if (achievementFiles[0]) {
        formData.append('images', achievementFiles[0]);
      } else {
        toast.error("Please upload an image for the achievement");
        return;
      }

      await createAchievement(formData).unwrap();
      toast.success("Achievement created successfully!");
      setOpenAchievementDialog(false);
      achievementForm.reset();
      setAchievementFiles([]);
    } catch (error) {
       console.error("Failed to create achievement", error);
       toast.error("Failed to create achievement");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideTrophy size={32} />
            Achievement Management
          </Typography>
          <Typography color="text.secondary">
            Showcase and manage department achievements
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => setOpenAchievementDialog(true)}
          sx={{ bgcolor: '#002147', fontWeight: 700 }}
        >
          Add Achievement
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         {achievementsLoading ? <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box> : (
           <TableContainer>
             <Table>
               <TableHead sx={{ bgcolor: '#f8fafc' }}>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Competition</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
                   <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {achievements.map((achievement: { _id: string; title: string; competitionName: string; position: string }) => (
                   <TableRow key={achievement._id} hover>
                     <TableCell sx={{ fontWeight: 700 }}>{achievement.title}</TableCell>
                     <TableCell>{achievement.competitionName}</TableCell>
                     <TableCell><Chip label={achievement.position} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                     <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => { if(confirm("Delete achievement?")) deleteAchievement(achievement._id) }}>
                          <LucideTrash2 size={18} />
                        </IconButton>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         )}
      </Paper>

      {/* Achievement Dialog */}
      <Dialog open={openAchievementDialog} onClose={() => setOpenAchievementDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={achievementForm.handleSubmit(onAchievementSubmit)}>
          <DialogTitle fontWeight={800}>Add New Achievement</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="title"
                  control={achievementForm.control}
                  render={({ field }) => <TextField {...field} fullWidth label="Achievement Title" />}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                   name="description"
                   control={achievementForm.control}
                   render={({ field }) => <TextField {...field} fullWidth multiline rows={3} label="Description" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="competitionName"
                  control={achievementForm.control}
                  render={({ field }) => <TextField {...field} fullWidth label="Competition Name" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                   name="position"
                   control={achievementForm.control}
                   render={({ field }) => <TextField {...field} fullWidth label="Position (e.g., 1st Runner Up)" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                   name="date"
                   control={achievementForm.control}
                   render={({ field }) => <TextField {...field} fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                   name="category"
                   control={achievementForm.control}
                   render={({ field }) => (
                     <FormControl fullWidth>
                       <InputLabel>Category</InputLabel>
                       <Select {...field} label="Category">
                        <MenuItem value="CP">Competitive Programming</MenuItem>
                        <MenuItem value="HACKATHON">Hackathon</MenuItem>
                        <MenuItem value="CTF">CTF</MenuItem>
                        <MenuItem value="DL">Digital Literacy</MenuItem>
                        <MenuItem value="ACADEMIC">Academic</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                       </Select>
                     </FormControl>
                   )}
                />
              </Grid>

              {/* Image Upload Field */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#475569' }}>
                  Achievement Image (Required)
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderStyle: 'dashed',
                    borderColor: achievementFiles.length > 0 ? '#10b981' : '#cbd5e1',
                    bgcolor: achievementFiles.length > 0 ? '#f0fdf4' : '#f8fafc',
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAchievementFiles([e.target.files[0]]);
                      }
                    }}
                  />
                  {achievementFiles.length > 0 ? (
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Box 
                        component="img" 
                        src={URL.createObjectURL(achievementFiles[0])} 
                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }} 
                      />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight={700}>{achievementFiles[0].name}</Typography>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<LucideX size={14} />} 
                          onClick={(e) => {
                            e.preventDefault();
                            setAchievementFiles([]);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Stack>
                  ) : (
                    <Box>
                      <LucideUpload size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload an image of the event or award
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAchievementDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#002147' }} disabled={isCreatingAchievement}>
              Add Achievement
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
