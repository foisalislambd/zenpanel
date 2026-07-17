import { createMemo, For } from "solid-js";

type Props = {
  content: string;
};

/** Lightweight assistant text — supports **bold** and line breaks without extra deps. */
export function AdminChatMarkdown(props: Props) {
  const parts = createMemo(() => props.content.split(/(\*\*[^*]+\*\*)/g));

  return (
    <div class="admin-chat-markdown text-sm leading-relaxed">
      <For each={parts()}>
        {(part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong class="font-semibold">{part.slice(2, -2)}</strong>;
          }

          const lines = part.split("\n");
          return (
            <For each={lines}>
              {(line, j) => (
                <span>
                  {line}
                  {j() < lines.length - 1 ? <br /> : null}
                </span>
              )}
            </For>
          );
        }}
      </For>
    </div>
  );
}
