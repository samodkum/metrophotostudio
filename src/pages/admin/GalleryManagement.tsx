import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";


export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface SupabaseGalleryItem {
  id: string;
  title: string | null;
  file_url: string;
  file_type: string;
  category_id: string | null;
  sort_order: number | null;
  created_at?: string;
}

const GalleryManagement = () => {
  const [items, setItems] = useState<SupabaseGalleryItem[]>([]);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [galleriesRes, categoriesRes] = await Promise.all([
        supabase.from("gallery_items").select("*").order("sort_order", { ascending: true }),
        supabase.from("categories").select("*"),
      ]);

      if (galleriesRes.error) throw galleriesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setItems(galleriesRes.data as SupabaseGalleryItem[]);
      setCategories(categoriesRes.data as SupabaseCategory[]);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to load data", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;
    setLoading(true);

    const isVideo = newUrl.match(/\.(mp4|webm|ogg)$/i);

    try {
      const { error } = await supabase.from("gallery_items").insert({
        file_url: newUrl.trim(),
        file_type: isVideo ? "video" : "photo",
        title: "Added Image",
        category_id: selectedCategory !== "all" ? selectedCategory : null,
      });

      if (error) throw error;

      setNewUrl("");
      toast({ title: "Media added successfully!" });
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to add media", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: SupabaseGalleryItem) => {
    try {
      const { error } = await supabase.from("gallery_items").delete().eq("id", item.id);
      if (error) throw error;

      toast({ title: "Deleted" });
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    }
  };

  const handleCategoryChange = async (itemId: string, categoryId: string) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .update({ category_id: categoryId === "none" ? null : categoryId })
        .eq("id", itemId);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gallery Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2 max-w-xl">
          <Input
            placeholder="Paste image or video URL here..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
          />
          <Button onClick={handleAddUrl} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> {loading ? "Adding..." : "Add Media"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          .filter((i) => selectedCategory === "all" || i.category_id === selectedCategory)
          .map((item) => (
            <Card key={item.id} className="relative group overflow-hidden">
              {item.file_type === "video" ? (
                <video src={item.file_url} className="w-full h-48 object-cover" />
              ) : (
                <img src={item.file_url} alt={item.title || ""} className="w-full h-48 object-cover" loading="lazy" />
              )}
              <div className="p-3 space-y-2">
                <Select
                  value={item.category_id || "none"}
                  onValueChange={(v) => handleCategoryChange(item.id, v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Set category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(item)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">No gallery items yet. Upload your first photo or video!</p>
      )}
    </div>
  );
};

export default GalleryManagement;
