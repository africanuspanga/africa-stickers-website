# Supabase Setup Instructions

## 1. Environment Variables

Add these environment variables to your Vercel project settings:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

Replace with your actual Supabase credentials:
- `your-supabase-project-url` - Your Supabase project URL (e.g., https://your-project.supabase.co)
- `your-supabase-anon-key` - Your Supabase anon public key

## 2. Database Setup

Run the SQL scripts in your Supabase SQL editor in this order:

1. **001-create-products-table.sql** - Creates the products and product_variants tables
2. **002-seed-initial-products.sql** - Seeds the database with initial product data

## 3. Storage Setup (Optional)

If you want to use Supabase Storage instead of Cloudinary:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "product-images"
3. Set it to public
4. Update the upload API route to use Supabase Storage

## 4. Testing

After setup:
1. Visit `/products` to see products loaded from Supabase
2. Visit `/admin/products` to manage products
3. Upload images - they should persist across browser sessions and devices

## Benefits

✅ **Real persistence** - Data survives browser refreshes, incognito mode, and different devices
✅ **Real-time sync** - Changes in admin panel appear immediately on public pages
✅ **Scalable** - Can handle thousands of products
✅ **Free tier** - 500MB database + 1GB storage, no time limits
✅ **Professional** - Real database with relationships, indexes, and security
