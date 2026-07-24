import {
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsOl,
  DocsP,
  DocsProse,
  DocsTable,
  DocsUl,
} from "@/components/docs/docs-prose";

export default function DocsConnectingApiPage() {
  return (
    <DocsProse>
      <DocsH1>Connect your API</DocsH1>
      <DocsLead>
        The scaffold includes preview/sample data so the dashboard and tables
        render without a backend. Swap those fetches when you are ready.
      </DocsLead>

      <DocsH2 id="where">Where preview data lives</DocsH2>
      <DocsTable
        headers={["Area", "Typical location"]}
        rows={[
          [
            "Dashboard stats, chart, activity, orders, users",
            <DocsCode>src/lib/admin-api/preview.ts</DocsCode>,
          ],
          ["AI chat mock replies", <DocsCode>src/lib/admin-api/chat.ts</DocsCode>],
          [
            "Empty resource lists",
            <DocsCode>src/lib/admin-data/resources.ts</DocsCode>,
          ],
        ]}
      />
      <DocsP>
        HTML / Astro templates often use a shared <DocsCode>data.js</DocsCode>{" "}
        instead.
      </DocsP>

      <DocsH2 id="approach">Recommended approach</DocsH2>
      <DocsOl>
        <li>Keep the UI components as-is.</li>
        <li>
          Replace <DocsCode>previewFetch*</DocsCode> functions with{" "}
          <DocsCode>fetch</DocsCode> / your SDK against real endpoints.
        </li>
        <li>
          Map API responses to existing types (
          <DocsCode>DashboardStats</DocsCode>, <DocsCode>RecentOrder</DocsCode>,{" "}
          <DocsCode>PortalUserRow</DocsCode>, etc.).
        </li>
        <li>
          Wire auth so <DocsCode>AdminGuard</DocsCode> / login use your session,
          not <DocsCode>sessionStorage</DocsCode> demo login.
        </li>
        <li>
          Enable search and “Add new” actions once the API supports them (many
          controls are intentionally disabled in preview).
        </li>
      </DocsOl>

      <DocsH2 id="env">Environment variables</DocsH2>
      <DocsP>
        Add your own env files (e.g. <DocsCode>NEXT_PUBLIC_API_URL</DocsCode>,{" "}
        <DocsCode>VITE_API_URL</DocsCode>). ZenPanel does not ship a required{" "}
        <DocsCode>.env</DocsCode> for the preview UI.
      </DocsP>

      <DocsH2 id="checklist">Production checklist</DocsH2>
      <DocsUl>
        <li>
          Remove or gate demo credentials (<DocsCode>admin</DocsCode> /{" "}
          <DocsCode>admin</DocsCode>)
        </li>
        <li>
          Protect <DocsCode>/admin/*</DocsCode> with real auth
        </li>
        <li>Replace preview fetches with production APIs</li>
        <li>Review CORS / cookies for your hosting setup</li>
      </DocsUl>
    </DocsProse>
  );
}
