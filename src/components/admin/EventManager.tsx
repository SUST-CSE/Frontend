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
  FormControlLabel,
  Checkbox,
  IconButton,
  Grid
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideEdit, LucideCalendar } from 'lucide-react';
import { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '@/features/event/eventApi';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

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
  registrationLink: z.string().optional(),
  isFeatured: z.boolean(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventManager() {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [eventFiles, setEventFiles] = useState<File[]>([]);
  const [eventAttachments, setEventAttachments] = useState<File[]>([]);
  const { data: eventData, isLoading: eventsLoading } = useGetEventsQuery({});
  const [createEvent, { isLoading: isCreatingEvent }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const eventForm = useForm<EventFormData>({
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
      isFeatured: false,
    }
  });

  const events = eventData?.data || [];

  const onEventSubmit = async (data: EventFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('startDate', new Date(`${data.startDate}T${data.startTime}`).toISOString());
      formData.append('endDate', new Date(`${data.endDate}T${data.endTime}`).toISOString());
      formData.append('location', data.location);
      formData.append('organizer', data.organizer);
      formData.append('category', data.category);
      if (data.registrationLink) formData.append('registrationLink', data.registrationLink);
      formData.append('isFeatured', String(data.isFeatured || false));
      
      eventFiles.forEach(file => {
        formData.append('images', file);
      });
      
      eventAttachments.forEach(file => {
        formData.append('attachments', file);
      });

      if (editEventId) {
        await updateEvent({ id: editEventId, data: formData }).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent(formData).unwrap();
        toast.success("Event created successfully!");
      }
      
      setOpenEventDialog(false);
      setEditEventId(null);
      eventForm.reset();
      setEventFiles([]);
      setEventAttachments([]);
    } catch (error) {
       console.error("Failed to save event", error);
       toast.error("Failed to save event");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideCalendar size={32} />
            Event Management
          </Typography>
          <Typography color="text.secondary">
            Organize and manage department events
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => {
            setEditEventId(null);
            eventForm.reset();
            setOpenEventDialog(true);
          }}
          sx={{ bgcolor: '#002147', fontWeight: 700 }}
        >
          Create Event
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         {eventsLoading ? <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box> : (
           <TableContainer>
             <Table>
               <TableHead sx={{ bgcolor: '#f8fafc' }}>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Organizer</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                   <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {events.map((event: { _id: string; title: string; startDate: string; endDate: string; category: string; organizer: string; status: string; description?: string; location: string; registrationLink?: string; isFeatured?: boolean }) => (
                   <TableRow key={event._id} hover>
                     <TableCell sx={{ fontWeight: 700 }}>{event.title}</TableCell>
                     <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                     <TableCell><Chip label={event.category} size="small" variant="outlined" /></TableCell>
                     <TableCell>{event.organizer}</TableCell>
                     <TableCell>
                        <Chip 
                          label={event.status} 
                          size="small" 
                          color={event.status === 'UPCOMING' ? 'primary' : 'success'}
                          sx={{ fontWeight: 800 }}
                        />
                     </TableCell>
                     <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => {
                            setEditEventId(event._id);
                            const start = new Date(event.startDate);
                            const end = new Date(event.endDate);
                            eventForm.reset({
                              title: event.title,
                              description: event.description || '',
                              startDate: start.toISOString().split('T')[0],
                              startTime: start.toTimeString().split(' ')[0].substring(0, 5),
                              endDate: end.toISOString().split('T')[0],
                              endTime: end.toTimeString().split(' ')[0].substring(0, 5),
                              location: event.location,
                              organizer: event.organizer,
                              category: event.category as any,
                              registrationLink: event.registrationLink || '',
                              isFeatured: event.isFeatured || false
                            });
                            setOpenEventDialog(true);
                          }}>
                            <LucideEdit size={18} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete event?")) deleteEvent(event._id) }}>
                            <LucideTrash2 size={18} />
                          </IconButton>
                        </Stack>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         )}
      </Paper>

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={eventForm.handleSubmit(onEventSubmit)}>
          <DialogTitle fontWeight={800}>{editEventId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="title"
                  control={eventForm.control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth label="Event Title" error={!!fieldState.error} helperText={fieldState.error?.message} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={eventForm.control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} fullWidth multiline rows={4} label="Description" error={!!fieldState.error} helperText={fieldState.error?.message} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="startDate"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="startTime"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth type="time" label="Start Time" InputLabelProps={{ shrink: true }} />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="endDate"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="endTime"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth type="time" label="End Time" InputLabelProps={{ shrink: true }} />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="location"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth label="Location" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="organizer"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth label="Organizer" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="category"
                  control={eventForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="WORKSHOP">Workshop</MenuItem>
                        <MenuItem value="SEMINAR">Seminar</MenuItem>
                        <MenuItem value="COMPETITION">Competition</MenuItem>
                        <MenuItem value="SOCIAL">Social</MenuItem>
                        <MenuItem value="TECHNICAL">Technical</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="registrationLink"
                  control={eventForm.control}
                  render={({ field }) => <TextField {...field} fullWidth label="Registration Link (Optional)" />}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="isFeatured"
                  control={eventForm.control}
                  render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Feature this event on homepage" />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#002147' }} disabled={isCreatingEvent || isUpdatingEvent}>
              {editEventId ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
