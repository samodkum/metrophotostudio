import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Inquiry {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  shoot_category: string | null;
  meeting_date: string | null;
  meeting_time: string | null;
  payment_status: string;
  admin_meeting_status: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
}

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id: string, field: "payment_status" | "admin_meeting_status", status: string) => {
    await supabase.from("inquiries").update({ [field]: status }).eq("id", id);
    toast({ title: `${field.replace('_', ' ')} updated to ${status}` });
    fetch();
  };

  const openWhatsApp = (inq: Inquiry) => {
    const phone = (inq.whatsapp || inq.phone || "").replace(/\D/g, "");
    if (!phone) return;
    const msg = encodeURIComponent(`Hi ${inq.full_name}, your booking for ${inq.shoot_category || "photoshoot"} is confirmed!`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const statusColor = (s: string) => {
    if (s === "verified") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Inquiries & Bookings</h1>

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Meeting</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Admin Approval</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">{inq.full_name}</TableCell>
                <TableCell>{inq.shoot_category || "-"}</TableCell>
                <TableCell>{inq.phone || inq.whatsapp || "-"}</TableCell>
                <TableCell>
                  {inq.meeting_date ? format(new Date(inq.meeting_date), "dd MMM yyyy") : "-"}
                  {inq.meeting_time && ` ${inq.meeting_time}`}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColor(inq.payment_status) as any}>{inq.payment_status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={inq.admin_meeting_status === 'approved' ? 'default' : 'secondary' as any}>
                    {inq.admin_meeting_status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(inq.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" title="Verify Payment" onClick={() => updateStatus(inq.id, "payment_status", "verified")}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Approve Meeting Link" onClick={() => updateStatus(inq.id, "admin_meeting_status", "approved")}>
                      <ExternalLink className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Reject Payment" onClick={() => updateStatus(inq.id, "payment_status", "rejected")}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button size="icon" variant="ghost" title="WhatsApp Client" onClick={() => openWhatsApp(inq)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {inq.payment_screenshot_url && (
                      <a href={inq.payment_screenshot_url} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="ghost" title="Screenshot">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </Button>
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {inquiries.length === 0 && <p className="text-center text-muted-foreground mt-8">No inquiries yet.</p>}
    </div>
  );
};

export default InquiryManagement;
