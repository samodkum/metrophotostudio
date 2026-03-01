import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const settingsFields = [
  { key: "hero_title", label: "Hero Title" },
  { key: "hero_subtitle", label: "Hero Subtitle" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "address", label: "Address" },
  { key: "instagram", label: "Instagram Link" },
  { key: "stat_clients", label: "Clients Count (e.g. 500+)" },
  { key: "stat_years", label: "Years Experience (e.g. 5+)" },
  { key: "stat_events", label: "Events Count (e.g. 1000+)" },
];

const SiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row) => { map[row.key] = row.value || ""; });
        setSettings(map);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").update({ value }).eq("key", key);
    }
    setSaving(false);
    toast({ title: "Settings saved!" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Website Settings</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-gold-gradient">
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsFields.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SiteSettings;
