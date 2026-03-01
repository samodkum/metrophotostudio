import { useEffect, useState } from "react";
import { getServices, saveServices, LocalService as Service } from "@/data/localStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "Camera", pricing: "" });
  const { toast } = useToast();

  const fetch = () => {
    setServices(getServices());
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", description: "", icon: "Camera", pricing: "" }); setDialogOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ title: s.title, description: s.description || "", icon: s.icon || "Camera", pricing: s.pricing || "" }); setDialogOpen(true); };

  const save = () => {
    if (!form.title.trim()) return;
    const current = getServices();

    if (editing) {
      saveServices(current.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      saveServices([...current, { id: Date.now().toString(), ...form, sort_order: 0 }]);
    }

    setDialogOpen(false);
    toast({ title: editing ? "Updated!" : "Added!" });
    fetch();
  };

  const del = (id: string) => {
    const current = getServices();
    saveServices(current.filter(s => s.id !== id));
    toast({ title: "Deleted!" });
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  {s.pricing && <p className="text-sm text-primary mt-1">{s.pricing}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Icon name (e.g. Camera, Heart)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <Input placeholder="Pricing (e.g. ₹5000)" value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} />
            <Button className="w-full bg-gold-gradient" onClick={save}>{editing ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;
