import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

function RichTextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.menu}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
      </div>

      <EditorContent editor={editor} style={styles.editor} />
    </div>
  );
}

const styles = {
  wrapper: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
  },
  menu: {
    marginBottom: "10px",
    display: "flex",
    gap: "10px",
  },
  editor: {
    minHeight: "120px",
    outline: "none",
  },
};

export default RichTextEditor;
