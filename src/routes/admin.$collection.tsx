import { createFileRoute, notFound, useParams } from "@tanstack/react-router";

import { CollectionEditor } from "@/components/admin/collection-editor";
import { isCollectionKey } from "@/lib/content/tables";

export const Route = createFileRoute("/admin/$collection")({
  beforeLoad: ({ params }) => {
    if (!isCollectionKey(params.collection)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${isCollectionKey(params.collection) ? params.collection : "Content"} — Admin` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = useParams({ from: "/admin/$collection" });
  if (!isCollectionKey(collection)) return null;
  return <CollectionEditor key={collection} collection={collection} />;
}
