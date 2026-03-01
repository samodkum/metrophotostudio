import { useEffect, useState } from "react";
import { getGalleryItems, saveGalleryItems, getCategories, LocalGalleryItem, LocalCategory } from "@/data/localStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";



const GalleryManagement = () => {
  const [items, setItems] = useState<LocalGalleryItem[]>([]);
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const fetchData = () => {
    setItems(getGalleryItems());
    setCategories(getCategories());
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;

    // Auto-detect video if it ends in mp4, webm, etc
    const isVideo = newUrl.match(/\.(mp4|webm|ogg)$/i);

    const newItem: LocalGalleryItem = {
      id: uuidv4(),
      file_url: newUrl.trim(),
      file_type: isVideo ? "video" : "photo",
      title: "Pasted Image",
      category_id: selectedCategory !== "all" ? selectedCategory : null,
      sort_order: 0,
    };

    const current = getGalleryItems();
    saveGalleryItems([newItem, ...current]);

    setNewUrl("");
    toast({ title: "Image added successfully!" });
    fetchData();
  };

  const handleDelete = (item: LocalGalleryItem) => {
    const current = getGalleryItems();
    saveGalleryItems(current.filter(i => i.id !== item.id));
    toast({ title: "Deleted" });
    fetchData();
  };

  const handleCategoryChange = (itemId: string, categoryId: string) => {
    const current = getGalleryItems();
    saveGalleryItems(current.map(i => i.id === itemId ? { ...i, category_id: categoryId === "none" ? null : categoryId } : i));
    fetchData();
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
          <Button onClick={handleAddUrl}>
            <Plus className="mr-2 h-4 w-4" /> Add Media
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
