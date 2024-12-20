import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Link as LinkEditor,
  Bold,
  ClassicEditor,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  List,
  Heading,
  Underline,
  Strikethrough,
  BlockQuote,
} from "ckeditor5";

import "ckeditor5/ckeditor5-editor.css";

export function OfferCkEditor({
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
}) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
          ],
        },
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          LinkEditor,
          Undo,
          List,
          Heading,
          Underline,
          Strikethrough,
          BlockQuote,
          List,
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading",
              class: "ck-heading_heading3",
            },
          ],
        },
        placeholder: placeholder || "Your offer description...",
      }}
      data={value || ""}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      onBlur={() => {
        onBlur();
      }}
    />
  );
}
