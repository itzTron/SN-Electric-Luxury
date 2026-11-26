import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettings } from "@/lib/content/mutations";
import { getAdminSettings } from "@/lib/content/queries";
import type { SiteSettings } from "@/lib/content/types";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Site settings — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAdminSettings(),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Could not load settings. Apply the migration and check your Supabase credentials.
      </p>
    );
  }

  return <SettingsForm key={JSON.stringify(data)} initial={data} />;
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const setSocial = (key: string, value: string) =>
    setValues((current) => ({ ...current, socials: { ...current.socials, [key]: value } }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveSettings({ data: values });
      toast.success("Settings saved");
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Site settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact details, social links and global imagery used across every page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name">
            <Input value={values.name} onChange={(event) => set("name", event.target.value)} required />
          </Field>
          <Field label="Short name">
            <Input value={values.short} onChange={(event) => set("short", event.target.value)} required />
          </Field>
          <Field label="Tagline" full>
            <Input value={values.tagline} onChange={(event) => set("tagline", event.target.value)} required />
          </Field>
          <Field label="Description" full>
            <Textarea
              rows={3}
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone (dial)">
            <Input value={values.phone} onChange={(event) => set("phone", event.target.value)} required />
          </Field>
          <Field label="Phone (display)">
            <Input value={values.phone_display} onChange={(event) => set("phone_display", event.target.value)} required />
          </Field>
          <Field label="WhatsApp number">
            <Input value={values.whatsapp} onChange={(event) => set("whatsapp", event.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={values.email} onChange={(event) => set("email", event.target.value)} required />
          </Field>
          <Field label="Hours" full>
            <Input value={values.hours} onChange={(event) => set("hours", event.target.value)} />
          </Field>
          <Field label="Service area / address" full>
            <Textarea rows={2} value={values.address} onChange={(event) => set("address", event.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {["facebook", "instagram", "linkedin", "youtube"].map((network) => (
            <Field key={network} label={network[0].toUpperCase() + network.slice(1)}>
              <Input
                value={values.socials[network] ?? ""}
                onChange={(event) => setSocial(network, event.target.value)}
              />
            </Field>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Global images</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="Logo"
            value={values.logo_path}
            onChange={(value) => set("logo_path", value)}
            folder="brand"
            help="Square PNG works best."
          />
          <ImageField
            label="Hero image"
            value={values.hero_image_path}
            onChange={(value) => set("hero_image_path", value)}
            folder="hero"
            help="Wide, high-resolution image for the home hero."
          />
          <ImageField
            label="About image"
            value={values.about_image_path}
            onChange={(value) => set("about_image_path", value)}
            folder="about"
          />
          <ImageField
            label="Open Graph image"
            value={values.og_image_path}
            onChange={(value) => set("og_image_path", value)}
            folder="brand"
            help="Used for social sharing previews (1200×630)."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
