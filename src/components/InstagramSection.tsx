import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const INSTAGRAM_URL = "https://www.instagram.com/metro_photo_studioo?igsh=MTRuMms1NHYybWs0aw==";

const InstagramSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("instagram_posts")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch Instagram posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const extractPostId = (url: string) => {
    try {
      const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">Follow Us on Instagram</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            See our latest stories, reels & behind-the-scenes content
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Instagram profile card */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-secondary border border-border hover:border-primary/40 rounded-2xl px-8 py-6 transition-all hover:shadow-gold"
          >
            <div className="bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] rounded-full p-3">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                @metro_photo_studioo
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Photos · Videos · Stories · Reels
              </p>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
          </a>


          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mt-2 mb-8"
          >
            <Instagram className="h-5 w-5" />
            View All on Instagram
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 max-w-7xl mx-auto px-4 justify-items-center">
            {posts.map((post) => {
              const postId = extractPostId(post.post_url);
              if (!postId) return null;

              return (
                <div key={post.id} className="w-full max-w-[328px] overflow-hidden rounded-xl border border-border shadow-sm hover:shadow-gold transition-shadow bg-secondary flex justify-center items-center">
                  <iframe
                    src={`https://www.instagram.com/p/${postId}/embed`}
                    className="w-[320px] aspect-[4/5] border-none"
                    scrolling="no"
                    allowTransparency={true}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default InstagramSection;
