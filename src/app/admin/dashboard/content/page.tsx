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
import { LucidePlus, LucideTrash2, LucideEdit, LucideCalendar, LucideFileText, LucideUpload, LucideTrophy, LucideExternalLink } from 'lucide-react';
import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '@/features/event/eventApi';
import { 
  useGetNoticesQuery, 
  useCreateNoticeMutation, 
  useDeleteNoticeMutation,
  useGetHomepageQuery,
  useUpdateHomepageMutation,
  useGetAchievementsQuery,
  useCreateAchievementMutation,
  useDeleteAchievementMutation
} from '@/features/content/contentApi';
import {
  useGetProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation
} from '@/features/product/productApi';
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
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  teamName: z.string().optional(),
  competitionName: z.string().min(1, 'Competition name is required'),
  position: z.string().min(1, 'Position is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['CP', 'HACKATHON', 'CTF', 'DL', 'ACADEMIC', 'OTHER']),
});

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  link: z.string().url('Invalid URL format'),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

type EventFormData = z.infer<typeof eventSchema>;
type NoticeFormData = z.infer<typeof noticeSchema>;
type HeroFormData = z.infer<typeof heroSchema>;
type AchievementFormData = z.infer<typeof achievementSchema>;
type ProductFormData = z.infer<typeof productSchema>;

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  competitionName: string;
  position: string;
  category: string;
  date: string;
}

interface AdminEvent {
  _id: string;
  title: string;
  startDate: string;
  organizer: string;
  status: string;
}

export default function AdminContentPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  // Product State
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [productIcon, setProductIcon] = useState<File | null>(null);
  const { data: productData, isLoading: productsLoading } = useGetProductsAdminQuery({});
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleProductStatus] = useToggleProductStatusMutation();

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
  const { data: heroData, isLoading: heroLoading } = useGetHomepageQuery({});
  const [updateHomepage, { isLoading: isUpdatingHero }] = useUpdateHomepageMutation();
  const [editSlideIndex, setEditSlideIndex] = useState<number | null>(null);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [heroPreviews, setHeroPreviews] = useState<string[]>([]);

  // Achievement State
  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [achievementFiles, setAchievementFiles] = useState<File[]>([]);
  const { data: achievementData, isLoading: achievementsLoading } = useGetAchievementsQuery({});
  const [createAchievement, { isLoading: isCreatingAchievement }] = useCreateAchievementMutation();
  const [deleteAchievement] = useDeleteAchievementMutation();
  const [openHeroDialog, setOpenHeroDialog] = useState(false);

  const events = eventData?.data || [];
  const notices = noticeData?.data || [];
  const achievements = achievementData?.data || [];
  const hero = heroData?.data || { heroSlides: [] };
  const products = productData?.data || [];

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      link: '',
      isActive: true,
      order: 0,
    }
  });

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

  // No-op useEffect to handle cleanup only, previews are set in handleFileChange
  useEffect(() => {
    const urls: string[] = [];
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
      
      if (editSlideIndex !== null) {
        formData.append('editSlideIndex', String(editSlideIndex));
      }

      if (heroFiles.length > 0) {
        formData.append('heroImages', heroFiles[0]); // Only one image per slide update/add
      }


      await updateHomepage(formData).unwrap();
      alert(editSlideIndex !== null ? "Slide updated successfully!" : "New slide added successfully!");
      setOpenHeroDialog(false);
      setHeroFiles([]);
      setHeroPreviews([]);
      setEditSlideIndex(null);
      heroForm.reset({ title: '', subtitle: '', description: '', ctaText: '', ctaLink: '' });
    } catch (err: unknown) {
      console.error("Failed to update homepage", err);
      const error = err as { data?: { message?: string }; message?: string };
      const msg = error?.data?.message || error?.message || "Unknown error";
      alert(`Failed to update homepage banner: ${msg}`);
    }
  };

  const onAchievementSubmit = async (data: AchievementFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      achievementFiles.forEach(file => {
        formData.append('images', file);
      });

      await createAchievement(formData).unwrap();
      setOpenAchievementDialog(false);
      achievementForm.reset();
      setAchievementFiles([]);
      alert("Achievement created successfully!");
    } catch (error) {
       console.error("Failed to create achievement", error);
       alert("Failed to create achievement. Please try again.");
    }
  };

  const onProductSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('link', data.link);
      formData.append('isActive', String(data.isActive));
      formData.append('order', String(data.order));
      
      if (productIcon) {
        formData.append('icon', productIcon);
      }

      if (editProductId) {
        await updateProduct({ id: editProductId, data: formData }).unwrap();
        alert("Product updated successfully!");
      } else {
        await createProduct(formData).unwrap();
        alert("Product created successfully!");
      }
      
      setOpenProductDialog(false);
      setEditProductId(null);
      setProductIcon(null);
      productForm.reset();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDeleteHeroSlide = async (index: number) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const formData = new FormData();
      formData.append('deleteSlideIndex', String(index));
      await updateHomepage(formData).unwrap();
      alert("Slide deleted successfully!");
    } catch (error) {
      console.error("Failed to delete slide", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'notice' | 'event-attachment' | 'hero') => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (type === 'hero') {
        const newFiles = Array.from(e.target.files);
        setHeroFiles(newFiles);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setHeroPreviews(newPreviews);
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
          <Tab label="Student Projects" icon={<LucideFileText size={18} />} iconPosition="start" />
          <Tab label="Achievements" icon={<LucideTrophy size={18} />} iconPosition="start" />
          <Tab label="Events" icon={<LucideCalendar size={18} />} iconPosition="start" />
          <Tab label="Notices" icon={<LucideFileText size={18} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Hero Banner Tab */}
      <CustomTabPanel value={tabIndex} index={0}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button 
            variant={!showPreview ? "contained" : "outlined"}
            onClick={() => setShowPreview(false)}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Management
          </Button>
          <Button 
            variant={showPreview ? "contained" : "outlined"}
            onClick={() => setShowPreview(true)}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Live Preview
          </Button>
        </Stack>

        {!showPreview ? (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={800}>Current Slides ({hero.heroSlides.length})</Typography>
              <Button 
                variant="contained" 
                startIcon={<LucidePlus size={18} />}
                onClick={() => {
                  setEditSlideIndex(null);
                  heroForm.reset({ title: '', subtitle: '', description: '', ctaText: '', ctaLink: '' });
                  setOpenHeroDialog(true);
                }}
                sx={{ bgcolor: '#16a34a', fontWeight: 700, '&:hover': { bgcolor: '#15803d' } }}
              >
                Add New Slide
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {heroLoading ? (
                <Grid size={{ xs: 12 }}><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></Grid>
              ) : (
                <>
                  {hero.heroSlides.map((slide: HeroSlide, idx: number) => (
                    <Grid key={slide._id || idx} size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff', transition: 'all 0.3s ease', '&:hover': { borderColor: '#16a34a', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                        <Stack direction="row" spacing={2.5}>
                          <Box sx={{ width: 140, height: 90, borderRadius: 3, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid #f1f5f9' }}>
                            <NextImage src={slide.image} alt={slide.title} fill style={{ objectFit: 'cover' }} unoptimized />
                          </Box>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slide.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 600 }}>{slide.subtitle || 'No subtitle'}</Typography>
                            <Stack direction="row" spacing={1}>
                              <Button 
                                size="small" 
                                startIcon={<LucideEdit size={14} />} 
                                onClick={() => {
                                  setEditSlideIndex(idx);
                                  heroForm.reset(slide);
                                  setOpenHeroDialog(true);
                                }}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="small" 
                                color="error" 
                                startIcon={<LucideTrash2 size={14} />} 
                                onClick={() => handleDeleteHeroSlide(idx)}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                  {(!hero.heroSlides || hero.heroSlides.length === 0) && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 6, border: '2px dashed #e2e8f0' }}>
                        <LucideFileText size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" fontWeight={700} color="text.secondary">No hero slides active</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Add a slide to showcase it on the homepage banner.</Typography>
                      </Box>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </>
        ) : (
          <Box sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#000' }}>
             <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary">HOMEPAGE PREVIEW (DESKTOP VIEW)</Typography>
                <Chip label="Live" size="small" color="error" sx={{ fontWeight: 900, height: 20, fontSize: '0.6rem' }} />
             </Box>
             <Box sx={{ height: 500, overflow: 'hidden', pointerEvents: 'none' }}>
                <Hero />
             </Box>
          </Box>
        )}
      </CustomTabPanel>

      {/* Products Tab */}
      <CustomTabPanel value={tabIndex} index={1}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
           <Button 
              variant="contained" 
              startIcon={<LucidePlus size={18} />}
              onClick={() => {
                setEditProductId(null);
                productForm.reset({ name: '', description: '', link: '', isActive: true, order: 0 });
                setOpenProductDialog(true);
              }}
              sx={{ bgcolor: '#000000', fontWeight: 700 }}
           >
              Add Project
           </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
           {productsLoading ? <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
             <TableContainer>
               <Table>
                 <TableHead sx={{ bgcolor: '#f8fafc' }}>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 800 }}>Icon</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Project Name</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Project URL</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Order</TableCell>
                     <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {products.map((product: any) => (
                     <TableRow key={product._id} hover>
                       <TableCell>
                         {product.icon && (
                           <Box sx={{ width: 32, height: 32, position: 'relative' }}>
                             <NextImage src={product.icon} alt={product.name} fill style={{ objectFit: 'contain' }} unoptimized />
                           </Box>
                         )}
                       </TableCell>
                       <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                       <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.link}</TableCell>
                       <TableCell>
                          <Chip 
                            label={product.isActive ? 'Active' : 'Inactive'} 
                            size="small" 
                            color={product.isActive ? 'success' : 'default'}
                            onClick={() => toggleProductStatus(product._id)}
                            sx={{ cursor: 'pointer' }}
                          />
                       </TableCell>
                       <TableCell>{product.order}</TableCell>
                       <TableCell align="right">
                          <IconButton size="small" onClick={() => {
                            setEditProductId(product._id);
                            productForm.reset({
                              name: product.name,
                              description: product.description || '',
                              link: product.link,
                              isActive: product.isActive,
                              order: product.order || 0
                            });
                            setOpenProductDialog(true);
                          }}><LucideEdit size={16} /></IconButton>
                          <IconButton component="a" href={`/projects/${product._id}`} target="_blank" size="small" color="primary">
                            <LucideExternalLink size={16} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete product?")) deleteProduct(product._id) }}><LucideTrash2 size={16} /></IconButton>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
        </Paper>
      </CustomTabPanel>

      {/* Achievements Tab */}
      <CustomTabPanel value={tabIndex} index={2}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
           <Button 
              variant="contained" 
              startIcon={<LucidePlus size={18} />}
              onClick={() => setOpenAchievementDialog(true)}
              sx={{ bgcolor: '#000000', fontWeight: 700 }}
           >
              Add Achievement
           </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
           {achievementsLoading ? <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
             <TableContainer>
               <Table>
                 <TableHead sx={{ bgcolor: '#f8fafc' }}>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Competition</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
                     <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                     <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {achievements.map((achievement: Achievement) => (
                     <TableRow key={achievement._id} hover>
                       <TableCell sx={{ fontWeight: 600 }}>{achievement.title}</TableCell>
                       <TableCell>{achievement.competitionName}</TableCell>
                       <TableCell>{achievement.position}</TableCell>
                       <TableCell><Chip label={achievement.category} size="small" /></TableCell>
                       <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete achievement?")) deleteAchievement(achievement._id) }}><LucideTrash2 size={16} /></IconButton>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
        </Paper>
      </CustomTabPanel>

      <CustomTabPanel value={tabIndex} index={3}>
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
                   {events.map((event: AdminEvent) => (
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
      <CustomTabPanel value={tabIndex} index={4}>
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

      {/* Hero Slide Dialog */}
      <Dialog open={openHeroDialog} onClose={() => setOpenHeroDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>{editSlideIndex !== null ? 'Edit Hero Slide' : 'Add New Hero Slide'}</DialogTitle>
        <form onSubmit={heroForm.handleSubmit(onHeroSubmit)}>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
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
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Slide Image</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<LucideUpload size={18} />}
                  sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                >
                  {heroFiles.length > 0 ? 'Change Image' : 'Upload Image'}
                  <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} />
                </Button>
                {heroPreviews.length > 0 && (
                  <Box sx={{ mt: 2, height: 150, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <NextImage src={heroPreviews[0]} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenHeroDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isUpdatingHero} sx={{ bgcolor: '#000000', px: 4 }}>
              {isUpdatingHero ? <CircularProgress size={20} /> : (editSlideIndex !== null ? 'Save Changes' : 'Add Slide')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Achievement Dialog */}
      <Dialog open={openAchievementDialog} onClose={() => setOpenAchievementDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>Add New Achievement</DialogTitle>
        <form onSubmit={achievementForm.handleSubmit(onAchievementSubmit)}>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Controller
                name="title"
                control={achievementForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Achievement Title" fullWidth error={!!achievementForm.formState.errors.title} helperText={achievementForm.formState.errors.title?.message} />
                )}
              />
              <Controller
                name="competitionName"
                control={achievementForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Competition Name" fullWidth error={!!achievementForm.formState.errors.competitionName} helperText={achievementForm.formState.errors.competitionName?.message} />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Controller
                  name="position"
                  control={achievementForm.control}
                  render={({ field }) => (
                    <TextField {...field} label="Position/Rank" fullWidth error={!!achievementForm.formState.errors.position} helperText={achievementForm.formState.errors.position?.message} />
                  )}
                />
                <Controller
                  name="date"
                  control={achievementForm.control}
                  render={({ field }) => (
                    <TextField {...field} label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!achievementForm.formState.errors.date} helperText={achievementForm.formState.errors.date?.message} />
                  )}
                />
              </Stack>
              <Controller
                name="category"
                control={achievementForm.control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!achievementForm.formState.errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      <MenuItem value="CP">Competitive Programming</MenuItem>
                      <MenuItem value="HACKATHON">Hackathon</MenuItem>
                      <MenuItem value="CTF">CTF</MenuItem>
                      <MenuItem value="DL">Digital Logistics/Design</MenuItem>
                      <MenuItem value="ACADEMIC">Academic</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="teamName"
                control={achievementForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Team Name (Optional)" fullWidth />
                )}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Achievement Image</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<LucideUpload size={18} />}
                  sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}
                >
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAchievementFiles([e.target.files[0]]);
                    }
                  }} />
                </Button>
                {achievementFiles.length > 0 && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{achievementFiles[0].name}</Typography>}
              </Box>
              <Controller
                name="description"
                control={achievementForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Description" multiline rows={4} fullWidth error={!!achievementForm.formState.errors.description} helperText={achievementForm.formState.errors.description?.message} />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAchievementDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isCreatingAchievement} sx={{ bgcolor: '#000000', px: 4 }}>
              {isCreatingAchievement ? <CircularProgress size={20} /> : 'Add Achievement'}
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

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>{editProductId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <form onSubmit={productForm.handleSubmit(onProductSubmit)}>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Controller
                name="name"
                control={productForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Project Name" fullWidth error={!!productForm.formState.errors.name} helperText={productForm.formState.errors.name?.message} />
                )}
              />
              <Controller
                name="link"
                control={productForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Project URL" fullWidth error={!!productForm.formState.errors.link} helperText={productForm.formState.errors.link?.message} />
                )}
              />
              <Controller
                name="order"
                control={productForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Display Order" type="number" fullWidth error={!!productForm.formState.errors.order} helperText={productForm.formState.errors.order?.message} />
                )}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  {...productForm.register('isActive')} 
                  style={{ marginRight: 8, width: 18, height: 18 }} 
                />
                <Typography variant="body2" fontWeight={600}>Active (Show in Navbar)</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Project Icon</Typography>
                <Button variant="outlined" component="label" fullWidth startIcon={<LucideUpload size={18} />} sx={{ py: 1.5, borderStyle: 'dashed', borderRadius: 2 }}>
                  {productIcon ? 'Change Icon' : 'Upload Icon'}
                  <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setProductIcon(e.target.files[0]); }} />
                </Button>
                {productIcon && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{productIcon.name}</Typography>}
              </Box>
              <Controller
                name="description"
                control={productForm.control}
                render={({ field }) => (
                  <TextField {...field} label="Description" multiline rows={4} fullWidth />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenProductDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isCreatingProduct || isUpdatingProduct} sx={{ bgcolor: '#000000', px: 4 }}>
              {isCreatingProduct || isUpdatingProduct ? <CircularProgress size={20} /> : (editProductId ? 'Update Project' : 'Add Project')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
