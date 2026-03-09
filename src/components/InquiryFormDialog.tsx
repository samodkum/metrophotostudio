import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Camera, ArrowRight } from "lucide-react";

const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone number required").max(15),
  whatsapp: z.string().trim().min(7, "Valid WhatsApp number required").max(15),
  shootCategory: z.string().min(1, "Select a category"),
  address: z.string().trim().min(2, "Address is required").max(500),
});

export type InquiryData = z.infer<typeof inquirySchema>;

interface InquiryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InquiryData) => void;
  defaultCategory?: string;
}

const shootCategories = [
  "Baby Shoot",
  "Wedding",
  "Pre-Wedding",
  "Haldi",
  "Mehendi",
  "Maternity",
  "Birthday Shoot",
  "Event Photography",
];

const InquiryFormDialog = ({ open, onOpenChange, onSubmit, defaultCategory }: InquiryFormDialogProps) => {
  const [form, setForm] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    shootCategory: defaultCategory || "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-xl text-gold-gradient">Book Your Session</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground font-body">Fill in your details to schedule a meeting</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {[
            { id: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
            { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
            { id: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit phone number" },
            { id: "whatsapp", label: "WhatsApp Number", type: "tel", placeholder: "WhatsApp number" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="text-sm text-foreground font-body">{label} *</Label>
              <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={form[id] || ""}
                onChange={(e) => handleChange(id, e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
            </div>
          ))}

          <div className="space-y-1.5">
            <Label className="text-sm text-foreground font-body">Shoot Category *</Label>
            <Select value={form.shootCategory} onValueChange={(v) => handleChange("shootCategory", v)}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {shootCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.shootCategory && <p className="text-xs text-destructive">{errors.shootCategory}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm text-foreground font-body">Address *</Label>
            <Textarea
              id="address"
              placeholder="Your full address"
              value={form.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
          >
            Continue to Schedule Meeting
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryFormDialog;
