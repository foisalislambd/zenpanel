import {
  DocsCallout,
  DocsCode,
  DocsH1,
  DocsH2,
  DocsH3,
  DocsLead,
  DocsP,
  DocsPre,
  DocsProse,
  DocsTable,
} from "@/components/docs/docs-prose";

export default function DocsCliPage() {
  return (
    <DocsProse>
      <DocsH1>CLI reference</DocsH1>
      <DocsLead>
        Package: <DocsCode>create-zenpanel</DocsCode>. Same convention as Vite and
        Next — users run <DocsCode>npm create zenpanel</DocsCode>.
      </DocsLead>

      <DocsH2 id="usage">Usage</DocsH2>
      <DocsPre>{`npm create zenpanel@latest [project-name] -- [options]`}</DocsPre>
      <DocsP>Equivalents:</DocsP>
      <DocsPre>{`npx create-zenpanel@latest [project-name] [options]`}</DocsPre>
      <DocsP>Interactive prompts fill in anything you omit.</DocsP>
      <DocsCallout title="npm create note">
        Pass CLI flags after <DocsCode>--</DocsCode> when using{" "}
        <DocsCode>npm create</DocsCode> (npm eats unknown flags otherwise).
      </DocsCallout>

      <DocsH2 id="options">Options</DocsH2>
      <DocsTable
        headers={["Flag", "Description"]}
        rows={[
          [
            <DocsCode>-f, --framework &lt;name&gt;</DocsCode>,
            "nextjs, react, preact, solid, svelte, vue, html, astro, angular",
          ],
          [
            <DocsCode>--use-npm / --use-pnpm / --use-yarn / --use-bun</DocsCode>,
            "Package manager",
          ],
          [<DocsCode>--skip-install</DocsCode>, "Skip installing dependencies"],
          [<DocsCode>--force</DocsCode>, "Overwrite existing admin files (install mode)"],
          [<DocsCode>--install</DocsCode>, "Force install-into-existing-project mode"],
        ]}
      />
      <DocsP>
        <DocsCode>vite</DocsCode> is accepted as an alias for{" "}
        <DocsCode>react</DocsCode>.
      </DocsP>

      <DocsH2 id="modes">Modes</DocsH2>
      <DocsH3 id="create-mode">Create mode</DocsH3>
      <DocsP>
        Used when the target directory is empty / new. Copies a full framework
        template and installs deps (unless <DocsCode>--skip-install</DocsCode>).
      </DocsP>
      <DocsH3 id="install-mode">Install mode</DocsH3>
      <DocsP>
        Used when the current directory already has a{" "}
        <DocsCode>package.json</DocsCode>, or when you pass{" "}
        <DocsCode>--install</DocsCode>. Copies admin UI files into the existing
        app and merges peer dependencies where needed.
      </DocsP>

      <DocsH2 id="examples">Examples</DocsH2>
      <DocsPre>{`npm create zenpanel@latest my-admin -- --framework react --use-pnpm
npm create zenpanel@latest my-admin -- --framework html --skip-install
cd existing-app && npx create-zenpanel@latest --install --framework nextjs`}</DocsPre>

      <DocsH2 id="local-dev">Local development (monorepo)</DocsH2>
      <DocsPre>{`npm run build
node packages/create-zenpanel/dist/index.js my-test-app --framework nextjs`}</DocsPre>
    </DocsProse>
  );
}
