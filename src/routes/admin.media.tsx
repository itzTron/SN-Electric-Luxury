import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Pencil, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMedia, updateMediaMeta } from "@/lib/content/mutations";
import { mediaUrl } from "@/lib/content/media";
import { listMedia } from "@/lib/content/queries";
import { uploadImage } from "@/lib/content/upload";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: MediaPage,
});

type MediaRow = {
  id: string;
  path: string;
  alt: string;
  caption: string | null;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
};

function MediaPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<MediaRow | null>(null);
  const [alt, setAlt] = useState("");

  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "media"], queryFn: () => listMedia() });
  const rows = (data ?? []) as unknown as MediaRow[];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadImage(file, "library");
      }
      toast.success(files.length > 1 ? `${files.length} images uploaded` : "Image uploaded");
      await refresh();
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const saveAlt = useMutation({
    mutationFn: () => updateMediaMeta({ data: { id: editing!.id, alt, caption: editing!.caption } }),
    onSuccess: async () => {
      toast.success("Saved");
      setEditing(null);
      await refresh();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMedia({ data: { id } }),
    onSuccess: async () => {
      toast.success("Deleted");
      await refresh();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Media library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Uploads are downscaled to 1920px WebP in your browser before they reach storage.
          </p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
          Upload images
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load the library. Apply the migration and check your Supabase credentials.
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No uploads yet. Add your first image above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.id} className="overflow-hidden rounded-2xl border border-border bg-background">
              <img src={mediaUrl(row.path)} alt={row.alt} className="h-40 w-full object-cover" loading="lazy" />
              <div className="space-y-2 p-3">
                <div className="truncate text-xs text-muted-foreground">{row.path}</div>
                <div className="truncate text-xs">{row.alt || <span className="text-muted-foreground">No alt text</span>}</div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(mediaUrl(row.path) ?? row.path);
                      toast.success("URL copied");
                    }}
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" /> URL
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(row);
                      setAlt(row.alt ?? "");
                    }}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Alt
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (window.confirm("Delete this image? Content using it will show a broken image.")) {
                        remove.mutate(row.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alt text</DialogTitle>
            <DialogDescription>Describe the image for screen readers and search engines.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="alt">Alt text</Label>
            <Input id="alt" value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={300} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={() => saveAlt.mutate()} disabled={saveAlt.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
