import { Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminSession } from "@/lib/content/queries";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return { adminEmail: null as string | null };
    const session = await fetchAdminSession();
    if (!session.signedIn) throw redirect({ to: "/admin/login" });
    return { adminEmail: session.email as string | null };
  },
  head: () => ({
    meta: [
      { title: "Admin — SN Electrical" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { adminEmail } = Route.useRouteContext();

  if (pathname === "/admin/login") return <Outlet />;

  return (
    <AdminShell email={adminEmail ?? ""}>
      <Outlet />
    </AdminShell>
  );
}
