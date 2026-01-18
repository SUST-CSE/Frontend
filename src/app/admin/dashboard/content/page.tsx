'use client';

import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stack,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideEdit, LucideCalendar, LucideFileText } from 'lucide-react';
import { useState } from 'react';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '@/features/event/eventApi';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod'; // Assuming zod is installed
import { zodResolver } from '@hookform/resolvers/zod';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required'),
  organizer: z.string().min(1, 'Organizer is required'),
  category: z.enum(['WORKSHOP', 'SEMINAR', 'COMPETITION', 'SOCIAL', 'TECHNICAL']),
  image: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function AdminContentPage() {
  const [tabFor, setTabFor] = useState(0);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const { data: eventData, isLoading: eventsLoading } = useGetEventsQuery({});
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  
  const events = eventData?.data || [];

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      organizer: '',
      category: 'WORKSHOP',
      image: ''
    }
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      // Combine date and time to ISO string if needed by backend, or send separate fields
      // Assuming backend accepts these fields directly per earlier viewed schemas or typical implementation
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

      const payload = {
        title: data.title,
        description: data.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: data.location,
        organizer: data.organizer,
        category: data.category,
        image: data.image
      };

      await createEvent(payload).unwrap();
      setOpenEventDialog(false);
      reset();
    } catch (error) {
       console.error("Failed to create event", error);
       alert("Failed to create event. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
     if(confirm("Are you sure you want to delete this event?")) {
        await deleteEvent(id);
     }
  }

  return (
    <Box>
       <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ mb: 6 }}>
        Content <span style={{ color: '#16a34a' }}>Management</span>
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabFor} onChange={(_, v) => setTabFor(v)}>
          <Tab label="Events" icon={<LucideCalendar size={18} />} iconPosition="start" />
          <Tab label="Notices (Coming Soon)" icon={<LucideFileText size={18} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Events Tab */}
      <CustomTabPanel value={tabFor} index={0}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
           <Button 
              variant="contained" 
              startIcon={<LucidePlus size={18} />}
              onClick={() => setOpenEventDialog(true)}
              sx={{ bgcolor: '#000000', fontWeight: 700, '&:hover': { bgcolor: '#16a34a' } }}
           >
              Create Event
           </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
           {eventsLoading ? <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
             <TableContainer>
               <Table>
                 <TableHead sx={{ bgcolor: '#f8fafc' }}>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Organizer</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                     <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {events.map((event: any) => (
                     <TableRow key={event._id} hover>
                       <TableCell fontWeight={600}>{event.title}</TableCell>
                       <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                       <TableCell>{event.organizer}</TableCell>
                       <TableCell>
                          <Chip 
                            label={event.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: event.status === 'UPCOMING' ? '#eff6ff' : '#f0fdf4',
                              color: event.status === 'UPCOMING' ? '#1d4ed8' : '#15803d',
                              fontWeight: 700 
                            }} 
                          />
                       </TableCell>
                       <TableCell align="right">
                          <Button size="small" color="inherit"><LucideEdit size={16} /></Button>
                          <Button size="small" color="error" onClick={() => handleDelete(event._id)}><LucideTrash2 size={16} /></Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
        </Paper>
      </CustomTabPanel>

      {/* Notices Tab */}
      <CustomTabPanel value={tabFor} index={1}>
         <Box sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
            <Typography>Notice management module is under construction.</Typography>
         </Box>
      </CustomTabPanel>

      {/* Create Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle fontWeight={800}>Create New Event</DialogTitle>
         <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
               <Stack spacing={3} sx={{ pt: 1 }}>
                  <Controller
                     name="title"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} label="Event Title" fullWidth error={!!errors.title} helperText={errors.title?.message} />
                     )}
                  />
                  <Stack direction="row" spacing={2}>
                     <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate?.message} />
                        )}
                     />
                     <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="Start Time" type="time" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.startTime} helperText={errors.startTime?.message} />
                        )}
                     />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                     <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.endDate} helperText={errors.endDate?.message} />
                        )}
                     />
                     <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} label="End Time" type="time" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.endTime} helperText={errors.endTime?.message} />
                        )}
                     />
                  </Stack>
                  <Controller
                     name="location"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} label="Location" fullWidth error={!!errors.location} helperText={errors.location?.message} />
                     )}
                  />
                  <Controller
                     name="organizer"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} label="Organizer" fullWidth error={!!errors.organizer} helperText={errors.organizer?.message} />
                     )}
                  />
                   <Controller
                     name="category"
                     control={control}
                     render={({ field }) => (
                        <FormControl fullWidth error={!!errors.category}>
                           <InputLabel>Category</InputLabel>
                           <Select {...field} label="Category">
                              <MenuItem value="WORKSHOP">Workshop</MenuItem>
                              <MenuItem value="SEMINAR">Seminar</MenuItem>
                              <MenuItem value="COMPETITION">Competition</MenuItem>
                              <MenuItem value="SOCIAL">Social</MenuItem>
                              <MenuItem value="TECHNICAL">Technical</MenuItem>
                           </Select>
                           <FormHelperText>{errors.category?.message}</FormHelperText>
                        </FormControl>
                     )}
                  />
                   <Controller
                     name="image"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} label="Image URL (Optional)" fullWidth error={!!errors.image} helperText={errors.image?.message} />
                     )}
                  />
                  <Controller
                     name="description"
                     control={control}
                     render={({ field }) => (
                        <TextField {...field} label="Description" multiline rows={4} fullWidth error={!!errors.description} helperText={errors.description?.message} />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenEventDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
               <Button type="submit" variant="contained" disabled={isCreating} sx={{ bgcolor: '#000000' }}>
                  {isCreating ? 'Creating...' : 'Create Event'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>
    </Box>
  );
}
