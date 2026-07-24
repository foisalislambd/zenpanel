import {
  DocsCallout,
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsOl,
  DocsP,
  DocsPre,
  DocsProse,
  DocsUl,
} from "@/components/docs/docs-prose";

export default function DocsPublishingPage() {
  return (
    <DocsProse>
      <DocsH1>Publish to npm</DocsH1>
      <DocsLead>
        This monorepo publishes the CLI package at{" "}
        <DocsCode>packages/create-zenpanel</DocsCode>.
      </DocsLead>

      <DocsH2 id="prerequisites">Prerequisites</DocsH2>
      <DocsUl>
        <li>npm account with publish rights</li>
        <li>
          Node.js <DocsCode>20+</DocsCode>
        </li>
        <li>Clean git state (recommended)</li>
      </DocsUl>

      <DocsH2 id="checklist">Checklist</DocsH2>
      <DocsOl>
        <li>
          <strong>Build the CLI</strong>
          <DocsPre>{`npm run build -w create-zenpanel`}</DocsPre>
        </li>
        <li>
          <strong>Confirm package metadata</strong> in{" "}
          <DocsCode>packages/create-zenpanel/package.json</DocsCode>:{" "}
          <DocsCode>name</DocsCode>, version, <DocsCode>bin</DocsCode>,{" "}
          <DocsCode>files</DocsCode> (<DocsCode>dist</DocsCode>,{" "}
          <DocsCode>templates</DocsCode>), repository / license.
        </li>
        <li>
          <strong>Dry-run the tarball</strong>
          <DocsPre>{`cd packages/create-zenpanel
npm pack --dry-run`}</DocsPre>
          Ensure <DocsCode>templates/**/node_modules</DocsCode> are not included.
        </li>
        <li>
          <strong>Optional local install test</strong>
          <DocsPre>{`npm pack
npx ./create-zenpanel-*.tgz my-smoke --framework html --skip-install`}</DocsPre>
        </li>
        <li>
          <strong>Publish</strong>
          <DocsPre>{`npm login
cd packages/create-zenpanel
npm publish --access public`}</DocsPre>
        </li>
        <li>
          <strong>Verify</strong>
          <DocsPre>{`npm view create-zenpanel version
npm create zenpanel@latest -- --help
npx create-zenpanel@latest --help`}</DocsPre>
        </li>
      </DocsOl>

      <DocsH2 id="notes">Notes</DocsH2>
      <DocsCallout title="Package name matters">
        Root package <DocsCode>zenpanel</DocsCode> is{" "}
        <DocsCode>private: true</DocsCode> — only publish{" "}
        <DocsCode>create-zenpanel</DocsCode>. The package must stay named{" "}
        <DocsCode>create-zenpanel</DocsCode> so{" "}
        <DocsCode>npm create zenpanel@latest</DocsCode> works.
      </DocsCallout>
      <DocsP>
        Prefer tagging a git release that matches the npm version.
      </DocsP>
    </DocsProse>
  );
}
