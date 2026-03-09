import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Instagram } from "lucide-react";

export interface InstagramPost {
    id: string;
    post_url: string;
    sort_order: number;
}

const InstagramManagement = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [newUrl, setNewUrl] = useState("");
    const { toast } = useToast();

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("instagram_posts")
                .select("*")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            toast({ title: "Failed to load posts", description: err.message, variant: "destructive" });
        }
    };

    useEffect(() => {
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

    const addPost = async () => {
        if (!newUrl.trim()) return;

        const isValidUrl = extractPostId(newUrl);
        if (!isValidUrl) {
            toast({ title: "Invalid URL", description: "Please enter a valid Instagram post URL.", variant: "destructive" });
            return;
        }

        try {
            const { error } = await supabase.from("instagram_posts").insert({
                post_url: newUrl.trim(),
                sort_order: posts.length,
            });

            if (error) throw error;

            setNewUrl("");
            toast({ title: "Post added successfully!" });
            fetchPosts();
        } catch (err: any) {
            toast({ title: "Failed to add post", description: err.message, variant: "destructive" });
        }
    };

    const deletePost = async (id: string) => {
        try {
            const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
            if (error) throw error;

            toast({ title: "Post deleted!" });
            fetchPosts();
        } catch (err: any) {
            toast({ title: "Delete failed", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div>
            <h1 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <Instagram className="h-6 w-6 text-primary" /> Instagram Feed
            </h1>

            <p className="text-muted-foreground mb-6">
                Paste the URL of an Instagram post (e.g. https://www.instagram.com/p/XYZ123) to feature it on the homepage.
            </p>

            <div className="flex gap-2 mb-8 max-w-xl">
                <Input
                    placeholder="https://www.instagram.com/p/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPost()}
                />
                <Button onClick={addPost} className="shrink-0"><Plus className="mr-1 h-4 w-4" /> Add Post</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                    const postId = extractPostId(post.post_url);
                    return (
                        <Card key={post.id} className="overflow-hidden group flex flex-col">
                            <CardContent className="p-0 flex flex-col flex-grow">
                                {postId ? (
                                    <div className="bg-secondary relative flex-grow w-full flex justify-center items-center py-4">
                                        <iframe
                                            src={`https://www.instagram.com/p/${postId}/embed/captioned`}
                                            className="w-full max-w-[320px] aspect-[4/5] border-none"
                                            scrolling="no"
                                            allowTransparency={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-secondary h-48 w-full flex items-center justify-center text-muted-foreground border-b border-border">
                                        Invalid format
                                    </div>
                                )}

                                <div className="p-4 flex items-center justify-between bg-card shrink-0">
                                    <div className="truncate text-sm text-muted-foreground font-mono max-w-[200px]" title={post.post_url}>
                                        {post.post_url}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deletePost(post.id)}
                                        className="shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {posts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        No Instagram posts featured yet. Add a link above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstagramManagement;
