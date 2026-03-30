"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

interface EditorProps {
  content?: string;
  onUpdate?: (html: string) => void;
  placeholder?: string;
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded p-1.5 text-sm transition-colors ${
      active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editor.isActive("heading", { level: 3 }))}
      >
        H3
      </button>
      <div className="mx-1 w-px self-stretch bg-gray-200" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive("blockquote"))}
      >
        ❝
      </button>
      <div className="mx-1 w-px self-stretch bg-gray-200" />
      <button
        onClick={() => {
          const url = window.prompt("图片 URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="rounded p-1.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        🖼 图片
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="rounded p-1.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        — 分割线
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="rounded p-1.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        ↩
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="rounded p-1.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        ↪
      </button>
    </div>
  );
}

export function RichTextEditor({ content, onUpdate, placeholder }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: placeholder || "开始写你的旅途故事...",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-gray max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
