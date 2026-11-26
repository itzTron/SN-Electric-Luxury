import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mediaUrl } from "@/lib/content/media";
import { listMedia } from "@/lib/content/queries";
import { uploadImage } from "@/lib/content/upload";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  folder?: string;
  label?: string;
  help?: string;
};

export function ImageField({ value, onChange, folder = "general", label = "Image", help }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadImage(file, folder);
      onChange(path);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const preview = mediaUrl(value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary/40">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setLibraryOpen(true)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Library
            </Button>
            {value ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
              </Button>
            ) : null}
          </div>
          <Input
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value || null)}
            placeholder="services/abc.webp or hero.jpg"
            className="h-9 text-xs"
          />
          <p className="text-xs text-muted-foreground">{help ?? "Images are resized to 1920px WebP automatically."}</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      <MediaLibraryDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(path) => {
          onChange(path);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}

function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (path: string) => void;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => listMedia(),
    enabled: open,
  });

  const rows = (data ?? []) as { id: string; path: string; alt: string }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>Pick an uploaded image, or close this and upload a new one.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="py-8 text-sm text-muted-foreground">Could not load the library. Upload an image instead.</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">No uploads yet. Upload your first image from the field.</p>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  onSelect(row.path);
                  void queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
                }}
                className="group overflow-hidden rounded-xl border border-border text-left transition hover:border-[color:var(--brand)]"
              >
                <img src={mediaUrl(row.path)} alt={row.alt} className="h-24 w-full object-cover" loading="lazy" />
                <span className="block truncate px-2 py-1.5 text-[11px] text-muted-foreground">{row.path}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
