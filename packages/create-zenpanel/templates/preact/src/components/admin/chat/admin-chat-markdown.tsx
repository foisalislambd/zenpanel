type Props = {
  content: string;
};

/** Lightweight assistant text — supports **bold** and line breaks without extra deps. */
export function AdminChatMarkdown({ content }: Props) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div className="admin-chat-markdown text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }

        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 ? <br /> : null}
          </span>
        ));
      })}
    </div>
  );
}
