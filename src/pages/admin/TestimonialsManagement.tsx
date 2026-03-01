import { useEffect, useState } from "react";
import { getTestimonials, saveTestimonials, LocalTestimonial as Testimonial } from "@/data/localStore";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Star } from "lucide-react";



const TestimonialsManagement = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", category: "", rating: "5", text: "" });
  const { toast } = useToast();

  const fetch = () => {
    setItems(getTestimonials());
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", category: "", rating: "5", text: "" }); setDialogOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, category: t.category || "", rating: String(t.rating), text: t.text }); setDialogOpen(true); };

  const save = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    const payload = { id: editing ? editing.id : uuidv4(), name: form.name, category: form.category || "General", rating: parseInt(form.rating), text: form.text };

    const current = getTestimonials();
    if (editing) {
      saveTestimonials(current.map(t => t.id === editing.id ? payload : t));
    } else {
      saveTestimonials([payload, ...current]);
    }

    setDialogOpen(false);
    toast({ title: editing ? "Updated!" : "Added!" });
    fetch();
  };

  const del = (id: string) => {
    const current = getTestimonials();
    saveTestimonials(current.filter(t => t.id !== id));
    toast({ title: "Deleted!" });
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Testimonials</h1>
        <Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add Review</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < t.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground mb-1">"{t.text}"</p>
                  <p className="text-sm font-medium">{t.name} {t.category && <span className="text-muted-foreground">· {t.category}</span>}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => del(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Review" : "Add Review"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Client Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Category (e.g. Wedding)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea placeholder="Review text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            <Button className="w-full bg-gold-gradient" onClick={save}>{editing ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManagement;
