import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteRow, reorderRows, saveRow } from "@/lib/content/mutations";
import { mediaUrl } from "@/lib/content/media";
import { listCollection } from "@/lib/content/queries";
import { collections, type CollectionKey, type Field } from "@/lib/content/tables";
import { ImageField } from "./image-field";

type Row = Record<string, unknown>;

export function CollectionEditor({ collection }: { collection: CollectionKey }) {
  const config = collections[collection];
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", collection],
    queryFn: () => listCollection({ data: { table: collection } }),
  });

  const rows = (data ?? []) as Row[];
  const columns = useMemo(() => config.fields.filter((field) => field.inTable), [config]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
    await router.invalidate();
  };

  const save = useMutation({
    mutationFn: (payload: { id?: string; values: Row }) =>
      saveRow({ data: { table: collection, id: payload.id, values: payload.values } }),
    onSuccess: async () => {
      toast.success("Saved");
      setEditing(null);
      await refresh();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow({ data: { table: collection, id } }),
    onSuccess: async () => {
      toast.success("Deleted");
      await refresh();
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => reorderRows({ data: { table: collection, ids } }),
    onSuccess: refresh,
    onError: (mutationError) => toast.error(mutationError.message),
  });

  const move = (index: number, direction: -1 | 1) => {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const ids = next.map((row) => String(row.id));
    if (ids.every((id) => /^[0-9a-f-]{36}$/i.test(id))) reorder.mutate(ids);
    else toast.error("This content still uses the bundled seed rows — run the migration first.");
  };

  const newRow = () => setEditing({ ...config.createDefaults });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={newRow}>
          <Plus className="mr-1.5 h-4 w-4" /> New {config.singular}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
              <TableHead>Order</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="py-8 text-center text-sm text-muted-foreground">
                  Could not load rows. Check that the migration has been applied and you are signed in.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="py-8 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={String(row.id)}>
                  {columns.map((field) => (
                    <TableCell key={field.key} className="max-w-[280px] align-middle">
                      <Cell field={field} value={row[field.key]} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(index, -1)} aria-label="Move up">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(index, 1)} aria-label="Move down">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(row)} aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this {config.singular}?</AlertDialogTitle>
                            <AlertDialogDescription>This removes it from the public site immediately.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove.mutate(String(row.id))}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing?.id ? `Edit ${config.singular}` : `New ${config.singular}`}</SheetTitle>
            <SheetDescription>{config.description}</SheetDescription>
          </SheetHeader>
          {editing ? (
            <RowForm
              key={String(editing.id ?? "new")}
              fields={config.fields}
              folder={collection}
              initial={editing}
              saving={save.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(values) => save.mutate({ id: editing.id ? String(editing.id) : undefined, values })}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Cell({ field, value }: { field: Field; value: unknown }) {
  if (field.type === "image") {
    return value ? (
      <img src={mediaUrl(String(value))} alt="" className="h-10 w-14 rounded-md border border-border object-cover" />
    ) : (
      <span className="text-xs text-muted-foreground">None</span>
    );
  }
  if (field.type === "switch") {
    return <Badge variant={value ? "default" : "secondary"}>{value ? "On" : "Off"}</Badge>;
  }
  const text = value === null || value === undefined || value === "" ? "—" : String(value);
  return <span className="line-clamp-2 text-sm">{text}</span>;
}

function RowForm({
  fields,
  folder,
  initial,
  saving,
  onSubmit,
  onCancel,
}: {
  fields: Field[];
  folder: string;
  initial: Row;
  saving: boolean;
  onSubmit: (values: Row) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Row>(() => ({ ...initial }));

  const set = (key: string, value: unknown) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const missing = fields.find((field) => field.required && !String(values[field.key] ?? "").trim());
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 pb-6">
      {fields.map((field) => (
        <div key={field.key} className={field.full ? "" : ""}>
          {field.type === "image" ? (
            <ImageField
              label={field.label}
              value={(values[field.key] as string | null) ?? null}
              onChange={(value) => set(field.key, value)}
              folder={folder}
              help={field.help}
            />
          ) : field.type === "switch" ? (
            <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Switch
                id={field.key}
                checked={Boolean(values[field.key])}
                onCheckedChange={(checked) => set(field.key, checked)}
              />
            </div>
          ) : field.type === "textarea" ? (
            <div className="space-y-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Textarea
                id={field.key}
                rows={4}
                value={(values[field.key] as string | null) ?? ""}
                onChange={(event) => set(field.key, event.target.value)}
                placeholder={field.placeholder}
              />
              {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            </div>
          ) : field.type === "select" ? (
            <div className="space-y-1.5">
              <Label>{field.label}</Label>
              <Select
                value={String(values[field.key] ?? "")}
                onValueChange={(value) => set(field.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder ?? "Select…"} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options ?? []).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                value={(values[field.key] as string | number | null) ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (field.type === "number") set(field.key, raw === "" ? null : Number(raw));
                  else set(field.key, raw === "" ? null : raw);
                }}
                placeholder={field.placeholder}
              />
              {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            </div>
          )}
        </div>
      ))}

      <SheetFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </SheetFooter>
    </form>
  );
}
