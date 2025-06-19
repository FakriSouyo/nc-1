import { z } from 'zod'

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Nomor telepon tidak valid'),
})

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Nomor telepon tidak valid'),
})

// Menu item validations
export const menuItemSchema = z.object({
  category_id: z.string().min(1, 'Kategori harus dipilih'),
  name: z.string().min(2, 'Nama menu minimal 2 karakter'),
  description: z.string().optional(),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  caffeine_content: z.number().min(0, 'Kandungan kafein tidak boleh negatif'),
  is_available: z.boolean().default(true),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  description: z.string().optional(),
})

// Voucher validations
export const voucherSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{4,20}$/, 'Kode voucher harus 4-20 karakter (huruf besar dan angka)'),
  title: z.string().min(2, 'Judul voucher minimal 2 karakter'),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed', 'free_item']),
  discount_value: z.number().min(0, 'Nilai diskon tidak boleh negatif'),
  min_purchase: z.number().min(0, 'Minimal pembelian tidak boleh negatif'),
  max_usage: z.number().optional(),
  valid_from: z.string(),
  valid_until: z.string(),
  is_active: z.boolean().default(true),
}).refine(
  (data) => new Date(data.valid_until) > new Date(data.valid_from),
  {
    message: 'Tanggal berakhir harus setelah tanggal mulai',
    path: ['valid_until'],
  }
).refine(
  (data) => {
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      return false
    }
    return true
  },
  {
    message: 'Persentase diskon tidak boleh lebih dari 100%',
    path: ['discount_value'],
  }
)

// Order validations
export const orderItemSchema = z.object({
  menu_item_id: z.string().min(1, 'Menu item harus dipilih'),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
})

export const createOrderSchema = z.object({
  user_id: z.string().min(1, 'User ID diperlukan'),
  items: z.array(orderItemSchema).min(1, 'Minimal 1 item dalam order'),
  voucher_code: z.string().optional(),
  payment_method: z.enum(['cash', 'debit', 'credit', 'qris', 'transfer']),
})

// Headline validations
export const headlineSchema = z.object({
  title: z.string().min(2, 'Judul headline minimal 2 karakter'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

// Point reward validations
export const pointRewardSchema = z.object({
  title: z.string().min(2, 'Judul reward minimal 2 karakter'),
  description: z.string().optional(),
  points_required: z.number().min(1, 'Poin yang diperlukan minimal 1'),
  reward_type: z.enum(['voucher', 'free_item', 'discount']),
  reward_value: z.record(z.any()),
  is_active: z.boolean().default(true),
})

// User role validation
export const userRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'kasir']),
})

// Search validations
export const searchSchema = z.object({
  query: z.string().min(1, 'Query pencarian tidak boleh kosong').max(100, 'Query terlalu panjang'),
})

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1, 'Halaman minimal 1').default(1),
  limit: z.number().min(1, 'Limit minimal 1').max(100, 'Limit maksimal 100').default(10),
})

// Date range validation
export const dateRangeSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
}).refine(
  (data) => {
    if (data.from && data.to) {
      return new Date(data.to) >= new Date(data.from)
    }
    return true
  },
  {
    message: 'Tanggal akhir harus setelah atau sama dengan tanggal awal',
    path: ['to'],
  }
)

// Password change validation
export const changePasswordSchema = z.object({
  current_password: z.string().min(6, 'Password saat ini minimal 6 karakter'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirm_password: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine(
  (data) => data.new_password === data.confirm_password,
  {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirm_password'],
  }
)

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'Ukuran file maksimal 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Format file harus JPEG, PNG, atau WebP'
  ),
})

// Voucher code input validation
export const voucherCodeSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{4,20}$/, 'Kode voucher tidak valid'),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

// Types for form data
export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>
export type MenuItemForm = z.infer<typeof menuItemSchema>
export type CategoryForm = z.infer<typeof categorySchema>
export type VoucherForm = z.infer<typeof voucherSchema>
export type OrderItemForm = z.infer<typeof orderItemSchema>
export type CreateOrderForm = z.infer<typeof createOrderSchema>
export type HeadlineForm = z.infer<typeof headlineSchema>
export type PointRewardForm = z.infer<typeof pointRewardSchema>
export type UserRoleForm = z.infer<typeof userRoleSchema>
export type SearchForm = z.infer<typeof searchSchema>
export type PaginationForm = z.infer<typeof paginationSchema>
export type DateRangeForm = z.infer<typeof dateRangeSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
export type FileUploadForm = z.infer<typeof fileUploadSchema>
export type VoucherCodeForm = z.infer<typeof voucherCodeSchema>
export type ContactForm = z.infer<typeof contactSchema>