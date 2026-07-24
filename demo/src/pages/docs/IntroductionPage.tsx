import {
  DocsCallout,
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsP,
  DocsPre,
  DocsProse,
  DocsTable,
  DocsUl,
} from "@/components/docs/docs-prose";
import { docsNav } from "@/config/docs-nav";
import { Link } from "react-router-dom";

export default function DocsIntroductionPage() {
  return (
    <DocsProse>
      <DocsH1>ZenPanel documentation</DocsH1>
      <DocsLead>
        Guides for scaffolding, customizing, and shipping the ZenPanel admin UI
        shell across every major web framework.
      </DocsLead>

      <DocsCallout title="New here?">
        Start with{" "}
        <Link
          to="/docs/getting-started"
          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          Getting started
        </Link>
        , then open the live{" "}
        <Link
          to="/admin/login"
          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          admin demo
        </Link>{" "}
        with <DocsCode>admin</DocsCode> / <DocsCode>admin</DocsCode>.
      </DocsCallout>

      <DocsH2 id="what-is-zenpanel">What is ZenPanel?</DocsH2>
      <DocsP>
        ZenPanel is an open-source <strong>admin UI shell</strong> — login,
        sidebar, dashboard widgets, resource pages, messages, and settings —
        ready to wire to your own API. There is no backend in the scaffold;
        preview data is included so you can review UX first.
      </DocsP>
      <DocsUl>
        <li>One design language across Next.js, React, Preact, Solid, Svelte, Vue, HTML, Astro, and Angular</li>
        <li>Scaffold with <DocsCode>npm create zenpanel@latest</DocsCode></li>
        <li>Brand name, tagline, logo letter, and nav in one config file per template</li>
      </DocsUl>

      <DocsH2 id="guides">Guides</DocsH2>
      <DocsP>Follow the sections in order, or jump to what you need:</DocsP>
      <div className="mt-5 space-y-6">
        {docsNav.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {section.title}
            </p>
            <ul className="mt-2 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex flex-col gap-0.5 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <DocsH2 id="quick-start">Quick install</DocsH2>
      <DocsPre>{`npm create zenpanel@latest
cd my-admin
npm run dev`}</DocsPre>

      <DocsH2 id="demo">Live demo</DocsH2>
      <DocsTable
        headers={["Item", "Value"]}
        rows={[
          ["Demo login", <>admin / admin</>],
          [
            "Admin URL",
            <Link to="/admin/login" className="text-brand-600 hover:underline dark:text-brand-300">
              /admin/login
            </Link>,
          ],
          ["Package", <>create-zenpanel on npm</>],
        ]}
      />
    </DocsProse>
  );
}
