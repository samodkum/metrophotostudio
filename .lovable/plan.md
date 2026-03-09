

# Admin Dashboard - Metro Photo Studio

## Step 1: Supabase Connect Karna (Zaroori Hai)

Admin dashboard ke liye database, login system, aur photo/video storage chahiye. Iske liye **Supabase** connect karna padega.

Aapko ek simple step karna hoga:
- Chat me "Connect Supabase" button dikhega — usse click karke Supabase link karo

---

## Step 2: Database Setup

Supabase connect hone ke baad ye tables banenge:

- **gallery_items** — Photos aur videos store karne ke liye (title, category, file URL, type: photo/video)
- **categories** — Gallery categories manage karna (add/edit/delete)
- **services** — Services section ka data (title, description, icon, pricing)
- **testimonials** — Client reviews manage karna
- **inquiries** — Booking inquiries + payment status track karna
- **site_settings** — Hero section text, contact info, Instagram link etc. edit karna
- **user_roles** — Admin authentication ke liye secure role system
- **Storage bucket** — Photos aur videos upload karne ke liye

---

## Step 3: Admin Authentication

- `/admin/login` page — Email + password se login
- Secure role-based access using `user_roles` table (server-side check)
- Protected routes — bina login ke admin pages accessible nahi honge

---

## Step 4: Admin Dashboard Pages

Sidebar-based layout with these sections:

### 4a. Dashboard Home (`/admin`)
- Total inquiries, pending payments, total photos count
- Quick stats cards

### 4b. Gallery Management (`/admin/gallery`)
- Photos aur videos upload karo (up to 200)
- Category assign karo
- Delete/edit karo
- Grid view with preview

### 4c. Category Management (`/admin/categories`)
- Add new categories
- Edit/delete existing categories

### 4d. Services Management (`/admin/services`)
- Add/edit/delete services
- Set pricing and description

### 4e. Testimonials Management (`/admin/testimonials`)
- Add/edit/delete client reviews
- Set ratings

### 4f. Inquiry & Booking Management (`/admin/inquiries`)
- View all inquiries in a table
- Payment status (Pending/Verified)
- Approve/Reject booking
- Download payment screenshot
- Manual WhatsApp resend option

### 4g. Website Settings (`/admin/settings`)
- Edit hero section text
- Edit contact info (phone, email, address)
- Edit Instagram link
- Edit stats (500+ clients, 5+ years etc.)

---

## Step 5: Frontend Website Updates

- Gallery, Services, Testimonials sections will load data from Supabase instead of hardcoded data
- Admin me jo bhi change karoge, website pe live dikhega

---

## Technical Details

### New Files:
- `src/pages/AdminLogin.tsx` — Login page
- `src/pages/admin/AdminLayout.tsx` — Sidebar layout
- `src/pages/admin/Dashboard.tsx` — Stats overview
- `src/pages/admin/GalleryManagement.tsx` — Photo/video CRUD
- `src/pages/admin/CategoryManagement.tsx` — Category CRUD
- `src/pages/admin/ServicesManagement.tsx` — Services CRUD
- `src/pages/admin/TestimonialsManagement.tsx` — Reviews CRUD
- `src/pages/admin/InquiryManagement.tsx` — Bookings table
- `src/pages/admin/SiteSettings.tsx` — Website content editor
- `src/components/AdminSidebar.tsx` — Navigation sidebar
- `src/hooks/useAuth.tsx` — Authentication hook
- `src/lib/supabase.ts` — Supabase client (auto-generated on connect)

### Database Migrations:
- Categories, gallery_items, services, testimonials, inquiries, site_settings tables
- Storage bucket for media uploads
- RLS policies for admin-only access
- user_roles table with has_role() function

### Route Updates in App.tsx:
- `/admin/login` — Public
- `/admin/*` — Protected (admin only)

---

## Pehla Step

Approve karne ke baad, main sabse pehle **Supabase connect** karunga. Uske baad database setup aur admin dashboard build hoga.

