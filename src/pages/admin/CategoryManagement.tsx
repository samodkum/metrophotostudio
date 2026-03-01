import { useEffect, useState } from "react";
import { getCategories, saveCategories, LocalCategory } from "@/data/localStore";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const fetchCategories = () => {
    setCategories(getCategories());
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = () => {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/\s+/g, "-");
    const current = getCategories();
    if (current.some(c => c.slug === slug)) {
      toast({ title: "Error", description: "Category slug must be unique", variant: "destructive" });
      return;
    }
    const updated = [...current, { id: uuidv4(), name: newName.trim(), slug }];
    saveCategories(updated);
    setNewName("");
    toast({ title: "Category added!" });
    fetchCategories();
  };

  const updateCategory = (id: string) => {
    if (!editName.trim()) return;
    const slug = editName.trim().toLowerCase().replace(/\s+/g, "-");
    const current = getCategories();
    const updated = current.map(c => c.id === id ? { ...c, name: editName.trim(), slug } : c);
    saveCategories(updated);
    setEditingId(null);
    toast({ title: "Updated!" });
    fetchCategories();
  };

  const deleteCategory = (id: string) => {
    const current = getCategories();
    const updated = current.filter(c => c.id !== id);
    saveCategories(updated);
    toast({ title: "Deleted!" });
    fetchCategories();
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
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" onKeyDown={(e) => e.key === "Enter" && updateCategory(cat.id)} />
                  <Button size="icon" variant="ghost" onClick={() => updateCategory(cat.id)}><Check className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
