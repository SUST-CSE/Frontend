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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { LucideLayout, LucidePlus, LucideTrash2, LucideEdit, LucideExternalLink } from 'lucide-react';
import { 
  useGetProductsAdminQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useToggleProductStatusMutation
} from '@/features/product/productApi';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import NextImage from 'next/image';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  link: z.string().url('Invalid URL format'),
  isActive: z.boolean(),
  order: z.number().int().min(0),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductManager() {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [productIcon, setProductIcon] = useState<File | null>(null);
  const { data: productData, isLoading: productsLoading } = useGetProductsAdminQuery({});
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleProductStatus] = useToggleProductStatusMutation();

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

  const products = productData?.data || [];

  const onProductSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('link', data.link);
      formData.append('isActive', String(data.isActive));
      formData.append('order', String(data.order));
      
      if (productIcon) {
        formData.append('icon', productIcon);
      }

      if (editProductId) {
        await updateProduct({ id: editProductId, data: formData }).unwrap();
        toast.success("Project updated successfully!");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Project created successfully!");
      }
      
      setOpenProductDialog(false);
      setEditProductId(null);
      setProductIcon(null);
      productForm.reset();
    } catch (error) {
      console.error("Failed to save product", error);
      toast.error("Failed to save product");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LucideLayout size={32} />
            Student Projects
          </Typography>
          <Typography color="text.secondary">
            Manage showcased student projects and services
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={18} />}
          onClick={() => {
            setEditProductId(null);
            productForm.reset();
            setOpenProductDialog(true);
          }}
          sx={{ bgcolor: '#002147', fontWeight: 700 }}
        >
          Add Project
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
         {productsLoading ? <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box> : (
           <TableContainer>
             <Table>
               <TableHead sx={{ bgcolor: '#f8fafc' }}>
                 <TableRow>
                   <TableCell sx={{ fontWeight: 800 }}>Icon</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                   <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                   <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {products.map((product: { 
                   _id: string; 
                   name: string; 
                   description?: string;
                   link?: string;
                   icon?: string;
                   isActive?: boolean;
                   category?: string; 
                   status?: string; 
                   links?: { live?: string; github?: string };
                   order?: number;
                 }) => (
                   <TableRow key={product._id} hover>
                     <TableCell>
                        {product.icon && (
                          <Box sx={{ width: 32, height: 32, position: 'relative' }}>
                            <NextImage src={product.icon} alt={product.name} fill style={{ objectFit: 'contain' }} unoptimized />
                          </Box>
                        )}
                     </TableCell>
                     <TableCell sx={{ fontWeight: 700 }}>{product.name}</TableCell>
                     <TableCell>
                        <Chip 
                          label={product.isActive ? 'Active' : 'Inactive'} 
                          size="small" 
                          color={product.isActive ? 'success' : 'default'}
                          onClick={() => toggleProductStatus(product._id)}
                          sx={{ cursor: 'pointer' }}
                        />
                     </TableCell>
                     <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => {
                            setEditProductId(product._id);
                            productForm.reset(product);
                            setOpenProductDialog(true);
                          }}>
                            <LucideEdit size={18} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => { if(confirm("Delete project?")) deleteProduct(product._id) }}>
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

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={productForm.handleSubmit(onProductSubmit)}>
          <DialogTitle fontWeight={800}>{editProductId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Controller
                name="name"
                control={productForm.control}
                render={({ field }) => <TextField {...field} fullWidth label="Project Name" />}
              />
              <Controller
                name="description"
                control={productForm.control}
                render={({ field }) => <TextField {...field} fullWidth multiline rows={3} label="Description" />}
              />
              <Controller
                name="link"
                control={productForm.control}
                render={({ field }) => <TextField {...field} fullWidth label="Project URL" />}
              />
              <Controller
                name="isActive"
                control={productForm.control}
                render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Active" />}
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight={700}>Project Icon</Typography>
                <Button variant="outlined" component="label" startIcon={<LucidePlus size={18} />}>
                  Upload Icon
                  <input type="file" hidden onChange={(e) => setProductIcon(e.target.files?.[0] || null)} />
                </Button>
                {productIcon && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{productIcon.name}</Typography>}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#002147' }} disabled={isCreatingProduct || isUpdatingProduct}>
              Save Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
