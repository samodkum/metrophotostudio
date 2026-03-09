import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStats as getLocalStats } from "@/data/localStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, FileText, MessageSquare, Briefcase } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ gallery: 0, inquiries: 0, testimonials: 0, services: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const local = getLocalStats();
      const [i, t, g] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        gallery: g.count ?? 0,
        inquiries: i.count ?? 0,
        testimonials: t.count ?? 0,
        services: local.services,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Gallery Items", value: stats.gallery, icon: Image, color: "text-primary" },
    { title: "Inquiries", value: stats.inquiries, icon: FileText, color: "text-destructive" },
    { title: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-green-500" },
    { title: "Services", value: stats.services, icon: Briefcase, color: "text-blue-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
