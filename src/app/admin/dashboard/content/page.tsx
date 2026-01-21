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
  IconButton,
  Grid
} from '@mui/material';
import { LucidePlus, LucideTrash2, LucideEdit, LucideCalendar, LucideFileText, LucideUpload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '@/features/event/eventApi';
import { 
  useGetNoticesQuery, 
  useCreateNoticeMutation, 
  useDeleteNoticeMutation,
  useGetHomepageQuery,
  useUpdateHomepageMutation 
} from '@/features/content/contentApi';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
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
  registrationLink: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['ACADEMIC', 'ADMINISTRATIVE', 'EVENT', 'GENERAL']),
  isPinned: z.boolean().default(false),
});

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  ctaText: z.string().min(1, 'CTA Text is required'),
  ctaLink: z.string().min(1, 'CTA Link is required'),
});

type EventFormData = z.infer<typeof eventSchema>;
type NoticeFormData = z.infer<typeof noticeSchema>;
type HeroFormData = z.infer<typeof heroSchema>;

export default function AdminContentPage() {
  const [tabIndex, setTabIndex] = useState(0);
  
  // Event State
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [eventFiles, setEventFiles] = useState<File[]>([]);
  const [eventAttachments, setEventAttachments] = useState<File[]>([]);
  const { data: eventData, isLoading: eventsLoading } = useGetEventsQuery({});
  const [createEvent, { isLoading: isCreatingEvent }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  
  // Notice State
  const [openNoticeDialog, setOpenNoticeDialog] = useState(false);
  const [noticeFiles, setNoticeFiles] = useState<File[]>([]);
  const { data: noticeData, isLoading: noticesLoading } = useGetNoticesQuery({});
  const [createNotice, { isLoading: isCreatingNotice }] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

  // Hero State
  const { data: heroData } = useGetHomepageQuery({});
  const [updateHomepage, { isLoading: isUpdatingHero }] = useUpdateHomepageMutation();
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [heroPreviews, setHeroPreviews] = useState<string[]>([]);

  const events = eventData?.data || [];
  const notices = noticeData?.data || [];
  const hero = heroData?.data;

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
    }
  });

  const noticeForm = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'GENERAL',
      isPinned: false
    }
  });

  const heroForm = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      ctaText: '',
      ctaLink: '',
    }
  });

  useEffect(() => {
    if (hero) {
      heroForm.reset({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        ctaText: hero.ctaText || '',
        ctaLink: hero.ctaLink || '',
      });
    }
  }, [hero, heroForm]);

  useEffect(() => {
    const urls: string[] = [];
    if (heroFiles.length > 0) {
      const newPreviews = heroFiles.map(file => {
        const url = URL.createObjectURL(file);
        urls.push(url);
        return url;
      });
      setHeroPreviews(newPreviews);
    } else {
      setHeroPreviews(hero?.heroImages || []);
    }
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [heroFiles, hero?.heroImages]);

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

      await createEvent(formData).unwrap();
      setOpenEventDialog(false);
      eventForm.reset();
      setEventFiles([]);
      setEventAttachments([]);
    } catch (error) {
       console.error("Failed to create event", error);
       alert("Failed to create event. Please try again.");
    }
  };

  const onNoticeSubmit = async (data: NoticeFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('isPinned', String(data.isPinned));
      
      noticeFiles.forEach(file => {
        formData.append('attachments', file);
      });

      await createNotice(formData).unwrap();
      setOpenNoticeDialog(false);
      noticeForm.reset();
      setNoticeFiles([]);
    } catch (error) {
       console.error("Failed to create notice", error);
       alert("Failed to create notice. Please try again.");
    }
  };

  const onHeroSubmit = async (data: HeroFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      heroFiles.forEach(file => {
        formData.append('heroImages', file);
      });

      await updateHomepage(formData).unwrap();
      alert("Homepage slider updated successfully!");
      setHeroFiles([]);
    } catch (error) {
      console.error("Failed to update homepage", error);
      alert("Failed to update homepage banner. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'notice' | 'event-attachment' | 'hero') => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (type === 'hero') {
        const newFiles = Array.from(e.target.files);
        setHeroFiles(prev => [...prev, ...newFiles]);
        return;
      }
      if (type === 'event') {
        setEventFiles(prev => [...prev, ...newFiles]);
      } else if (type === 'event-attachment') {
        setEventAttachments(prev => [...prev, ...newFiles]);
      } else {
        setNoticeFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number, type: 'event' | 'notice' | 'event-attachment' | 'hero') => {
    if (type === 'event') {
      setEventFiles(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'event-attachment') {
      setEventAttachments(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'hero') {
      setHeroFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setNoticeFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Box>
       <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ mb: 6 }}>
        Homepage & <span style={{ color: '#16a34a' }}>Content</span>
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
          <Tab label="Homepage Banner" icon={<LucideFileText size={18} />} iconPosition="start" />
          <Tab label="Events" icon={<LucideCalendar size={18} />} iconPosition="start" />
          <Tab label="Notices" icon={<LucideFileText size={18} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Hero Banner Tab */}
      <CustomTabPanel value={tabIndex} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <form onSubmit={heroForm.handleSubmit(onHeroSubmit)}>
                <Stack spacing={3}>
                  <Controller
                    name="subtitle"
                    control={heroForm.control}
                    render={({ field }) => (
                      <TextField {...field} label="Subtitle (Accent Text)" fullWidth error={!!heroForm.formState.errors.subtitle} helperText={heroForm.formState.errors.subtitle?.message} />
                    )}
                  />
                  <Controller
                    name="title"
                    control={heroForm.control}
                    render={({ field }) => (
                      <TextField {...field} label="Main Title" fullWidth multiline rows={2} error={!!heroForm.formState.errors.title} helperText={heroForm.formState.errors.title?.message} />
                    )}
                  />
                  <Controller
                    name="description"
                    control={heroForm.control}
                    render={({ field }) => (
                      <TextField {...field} label="Hero Description" fullWidth multiline rows={4} error={!!heroForm.formState.errors.description} helperText={heroForm.formState.errors.description?.message} />
                    )}
                  />
                  <Stack direction="row" spacing={2}>
                    <Controller
                      name="ctaText"
                      control={heroForm.control}
                      render={({ field }) => (
                        <TextField {...field} label="Button Text" fullWidth error={!!heroForm.formState.errors.ctaText} helperText={heroForm.formState.errors.ctaText?.message} />
                      )}
                    />
                    <Controller
                      name="ctaLink"
                      control={heroForm.control}
                      render={({ field }) => (
                        <TextField {...field} label="Button Link" fullWidth error={!!heroForm.formState.errors.ctaLink} helperText={heroForm.formState.errors.ctaLink?.message} />
                      )}
                    />
                  </Stack>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isUpdatingHero}
                      sx={{ bgcolor: '#000000', px: 4, py: 1.5, fontWeight: 700 }}
                    >
                      {isUpdatingHero ? <CircularProgress size={20} color="inherit" /> : 'Update Banner Content'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f1f5f9' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Slider Images</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
                Upload multiple images for the homepage hero slider. Existing images will be replaced if you upload new ones.
              </Typography>
              
              <Box sx={{ mb: 3, flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {heroPreviews.length > 0 ? heroPreviews.map((url, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Box 
                        sx={{ 
                          position: 'relative', 
                          borderRadius: 2, 
                          overflow: 'hidden', 
                          height: 120,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {heroFiles.length > 0 && (
                          <IconButton 
                            size="small" 
                            sx={{ 
                              position: 'absolute', 
                              top: 4, 
                              right: 4, 
                              bgcolor: 'rgba(255,255,255,0.8)',
                              '&:hover': { bgcolor: '#fff' }
                            }}
                            onClick={() => removeFile(idx, 'hero')}
                          >
                            <LucideTrash2 size={14} color="#ef4444" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  )) : (
                    <Grid item xs={12}>
                      <Box 
                        sx={{ 
                          height: 120, 
                          borderRadius: 2, 
                          border: '2px dashed #cbd5e1', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: '#f8fafc'
                        }}
                      >
                        <LucideUpload size={24} color="#94a3b8" />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<LucideUpload size={18} />}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {heroFiles.length > 0 ? 'Add More Images' : 'Choose Slider Images'}
                <input type="file" hidden multiple accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} />
              </Button>
              {heroFiles.length > 0 && (
                <Button 
                  size="small" 
                  color="error" 
                  sx={{ mt: 1 }} 
                  onClick={() => setHeroFiles([])}
                >
                  Clear All Selection
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Events Tab */}
      <CustomTabPanel value={tabIndex} index={1}>
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
                   {events.map((event: { _id: string; title: string; startDate: string; organizer: string; status: string }) => (
                     <TableRow key={event._id} hover>
                       <TableCell sx={{ fontWeight: 600 }}>{event.title}</TableCell>
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
                          <IconButton size="small"><LucideEdit size={16} /></IconButton>
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete event?")) deleteEvent(event._id) }}><LucideTrash2 size={16} /></IconButton>
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
      <CustomTabPanel value={tabIndex} index={2}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
           <Button 
              variant="contained" 
              startIcon={<LucidePlus size={18} />}
              onClick={() => setOpenNoticeDialog(true)}
              sx={{ bgcolor: '#000000', fontWeight: 700, '&:hover': { bgcolor: '#16a34a' } }}
           >
              Create Notice
           </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
           {noticesLoading ? <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
             <TableContainer>
               <Table>
                 <TableHead sx={{ bgcolor: '#f8fafc' }}>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                     <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {notices.map((notice: { _id: string; title: string; category: string; publishDate: string; isPinned: boolean }) => (
                     <TableRow key={notice._id} hover>
                       <TableCell sx={{ fontWeight: 600 }}>
                          {notice.isPinned && <LucideFileText size={14} style={{ marginRight: 8, color: '#eab308' }} />}
                          {notice.title}
                       </TableCell>
                       <TableCell>
                          <Chip label={notice.category} size="small" />
                       </TableCell>
                       <TableCell>{new Date(notice.publishDate).toLocaleDateString()}</TableCell>
                       <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete notice?")) deleteNotice(notice._id) }}><LucideTrash2 size={16} /></IconButton>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
        </Paper>
      </CustomTabPanel>

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle fontWeight={800}>Create New Event</DialogTitle>
         <form onSubmit={eventForm.handleSubmit(onEventSubmit)}>
            <DialogContent>
               <Stack spacing={3} sx={{ pt: 1 }}>
                  <Controller
                     name="title"
                     control={eventForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Event Title" fullWidth error={!!eventForm.formState.errors.title} helperText={eventForm.formState.errors.title?.message} />
                     )}
                  />
                  <Stack direction="row" spacing={2}>
                     <Controller
                        name="startDate"
                        control={eventForm.control}
                        render={({ field }) => (
                           <TextField {...field} label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!eventForm.formState.errors.startDate} helperText={eventForm.formState.errors.startDate?.message} />
                        )}
                     />
                     <Controller
                        name="startTime"
                        control={eventForm.control}
                        render={({ field }) => (
                           <TextField {...field} label="Start Time" type="time" fullWidth InputLabelProps={{ shrink: true }} error={!!eventForm.formState.errors.startTime} helperText={eventForm.formState.errors.startTime?.message} />
                        )}
                     />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                     <Controller
                        name="endDate"
                        control={eventForm.control}
                        render={({ field }) => (
                           <TextField {...field} label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!eventForm.formState.errors.endDate} helperText={eventForm.formState.errors.endDate?.message} />
                        )}
                     />
                     <Controller
                        name="endTime"
                        control={eventForm.control}
                        render={({ field }) => (
                           <TextField {...field} label="End Time" type="time" fullWidth InputLabelProps={{ shrink: true }} error={!!eventForm.formState.errors.endTime} helperText={eventForm.formState.errors.endTime?.message} />
                        )}
                     />
                  </Stack>
                  <Controller
                     name="location"
                     control={eventForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Location" fullWidth error={!!eventForm.formState.errors.location} helperText={eventForm.formState.errors.location?.message} />
                     )}
                  />
                  <Controller
                     name="organizer"
                     control={eventForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Organizer" fullWidth error={!!eventForm.formState.errors.organizer} helperText={eventForm.formState.errors.organizer?.message} />
                     )}
                  />
                   <Controller
                     name="category"
                     control={eventForm.control}
                     render={({ field }) => (
                        <FormControl fullWidth error={!!eventForm.formState.errors.category}>
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
                  <Controller
                     name="registrationLink"
                     control={eventForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Registration Link (Optional)" fullWidth placeholder="https://..." />
                     )}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <input 
                        type="checkbox" 
                        {...eventForm.register('isFeatured')} 
                        style={{ marginRight: 8, width: 18, height: 18 }} 
                     />
                     <Typography variant="body2" fontWeight={600}>Feature this event on home page</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Event Images</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<LucideUpload size={18} />}
                      sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                    >
                      Upload Images
                      <input type="file" hidden multiple accept="image/*" onChange={(e) => handleFileChange(e, 'event')} />
                    </Button>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                       {eventFiles.map((file, i) => (
                         <Chip 
                          key={i} 
                          label={file.name} 
                          onDelete={() => removeFile(i, 'event')}
                          size="small"
                        />
                       ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Event Attachments (PDF, Docs)</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<LucideUpload size={18} />}
                      sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                    >
                      Upload Attachments
                      <input type="file" hidden multiple onChange={(e) => handleFileChange(e, 'event-attachment')} />
                    </Button>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                       {eventAttachments.map((file, i) => (
                         <Chip 
                          key={i} 
                          label={file.name} 
                          onDelete={() => removeFile(i, 'event-attachment')}
                          size="small"
                        />
                       ))}
                    </Stack>
                  </Box>

                  <Controller
                     name="description"
                     control={eventForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Description" multiline rows={4} fullWidth error={!!eventForm.formState.errors.description} helperText={eventForm.formState.errors.description?.message} />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
               <Button onClick={() => setOpenEventDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
               <Button type="submit" variant="contained" disabled={isCreatingEvent} sx={{ bgcolor: '#000000', px: 4 }}>
                  {isCreatingEvent ? <CircularProgress size={20} /> : 'Create Event'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>

      {/* Notice Dialog */}
      <Dialog open={openNoticeDialog} onClose={() => setOpenNoticeDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle fontWeight={800}>Create New Notice</DialogTitle>
         <form onSubmit={noticeForm.handleSubmit(onNoticeSubmit)}>
            <DialogContent>
               <Stack spacing={3} sx={{ pt: 1 }}>
                  <Controller
                     name="title"
                     control={noticeForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Notice Title" fullWidth error={!!noticeForm.formState.errors.title} helperText={noticeForm.formState.errors.title?.message} />
                     )}
                  />
                  <Controller
                     name="category"
                     control={noticeForm.control}
                     render={({ field }) => (
                        <FormControl fullWidth error={!!noticeForm.formState.errors.category}>
                           <InputLabel>Category</InputLabel>
                           <Select {...field} label="Category">
                              <MenuItem value="GENERAL">General</MenuItem>
                              <MenuItem value="ACADEMIC">Academic</MenuItem>
                              <MenuItem value="ADMINISTRATIVE">Administrative</MenuItem>
                              <MenuItem value="EVENT">Event</MenuItem>
                           </Select>
                        </FormControl>
                     )}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <input 
                        type="checkbox" 
                        {...noticeForm.register('isPinned')} 
                        style={{ marginRight: 8, width: 18, height: 18 }} 
                     />
                     <Typography variant="body2" fontWeight={600}>Pin this notice to top</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Attachments</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<LucideUpload size={18} />}
                      sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                    >
                      Upload Files
                      <input type="file" hidden multiple onChange={(e) => handleFileChange(e, 'notice')} />
                    </Button>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                       {noticeFiles.map((file, i) => (
                         <Chip 
                          key={i} 
                          label={file.name} 
                          onDelete={() => removeFile(i, 'notice')}
                          size="small"
                        />
                       ))}
                    </Stack>
                  </Box>

                  <Controller
                     name="description"
                     control={noticeForm.control}
                     render={({ field }) => (
                        <TextField {...field} label="Description" multiline rows={6} fullWidth error={!!noticeForm.formState.errors.description} helperText={noticeForm.formState.errors.description?.message} />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
               <Button onClick={() => setOpenNoticeDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
               <Button type="submit" variant="contained" disabled={isCreatingNotice} sx={{ bgcolor: '#000000', px: 4 }}>
                  {isCreatingNotice ? <CircularProgress size={20} /> : 'Create Notice'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>
    </Box>
  );
}
