import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      toast({ title: "Failed to load", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async () => {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/\s+/g, "-");

    if (categories.some(c => c.slug === slug)) {
      toast({ title: "Error", description: "Category slug must be unique", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("categories").insert({
        name: newName.trim(),
        slug: slug
      });
      if (error) throw error;

      setNewName("");
      toast({ title: "Category added!" });
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Failed to add", description: err.message, variant: "destructive" });
    }
  };

  const openEditDialog = (cat: any) => {
    setEditData({ ...cat });
    setIsDialogOpen(true);
  };

  const updateCategory = async () => {
    if (!editData?.name?.trim()) return;
    const slug = editData.name.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      const { error } = await supabase.from("categories").update({
        name: editData.name.trim(),
        slug: slug,
        cover_image_url: editData.cover_image_url || null,
        description: editData.description || null,
        deliverables: editData.deliverables || null,
        delivery_time: editData.delivery_time || null,
        process_details: editData.process_details || null,
      }).eq("id", editData.id);

      if (error) throw error;

      setIsDialogOpen(false);
      setEditData(null);
      toast({ title: "Updated successfully!" });
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Deleted!" });
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Category Management</h1>

      <div className="flex gap-2 mb-6 max-w-md">
        <Input placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} />
        <Button onClick={addCategory}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium">{cat.name}</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEditDialog(cat)}><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category: {editData?.name}</DialogTitle>
            <DialogDescription>Add rich media and details to display on the public portfolio page.</DialogDescription>
          </DialogHeader>

          {editData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input value={editData.name || ""} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input placeholder="https://..." value={editData.cover_image_url || ""} onChange={e => setEditData({ ...editData, cover_image_url: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Short Description (Hero Section)</Label>
                <Textarea placeholder="Explore our curated portfolio..." value={editData.description || ""} onChange={e => setEditData({ ...editData, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deliverables</Label>
                  <Input placeholder="e.g. 500+ Edited Photos" value={editData.deliverables || ""} onChange={e => setEditData({ ...editData, deliverables: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Time</Label>
                  <Input placeholder="e.g. 2-3 Weeks" value={editData.delivery_time || ""} onChange={e => setEditData({ ...editData, delivery_time: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Process Details</Label>
                <Textarea className="min-h-[120px]" placeholder="Explain what the client should expect..." value={editData.process_details || ""} onChange={e => setEditData({ ...editData, process_details: e.target.value })} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
