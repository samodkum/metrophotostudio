-- Create the instagram_posts table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on instagram_posts"
    ON public.instagram_posts
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on instagram_posts"
    ON public.instagram_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on instagram_posts"
    ON public.instagram_posts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on instagram_posts"
    ON public.instagram_posts
    FOR DELETE
    TO authenticated
    USING (true);
