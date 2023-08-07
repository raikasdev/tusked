import { CharacterCount } from '@tiptap/extension-character-count';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { History } from '@tiptap/extension-history';
import { Link } from '@tiptap/extension-link';
import { Mention } from '@tiptap/extension-mention';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';

import { HashtagMention } from '../editor/HashtagMention';
import hashtagSuggestion from '../editor/hashtagSuggestion';
import mentionSuggestion from '../editor/mentionSuggestion';
import { apiClient } from '../utils/auth';
import { htmlToText } from '../utils/html-parser';

interface PostEditorProps {
  maxLength: number;
}

{
  /* TODO: save drafts to localstorage? */
}
export default function PostEditor({ maxLength }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Typography,
      CharacterCount.configure({
        limit: maxLength,
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        validate: (href) => {
          console.log(href);
          return /^https?:\/\//.test(href);
        },
      }),
      Mention.configure({
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: mentionSuggestion,
      }),
      HashtagMention.configure({
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
        HTMLAttributes: {
          class: 'mention hashtag',
        },
        suggestion: hashtagSuggestion,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
      History,
      Gapcursor,
      Dropcursor,
    ],
  });

  return (
    <div className="editor-container">
      <div className="editor-header">
        <img
          width="48"
          height="48"
          select-none=""
          src="https://media.mementomori.social/accounts/avatars/110/666/945/922/059/535/original/0cbd49bb8be6d45d.jpg"
          alt="raikas's avatar"
          loading="lazy"
          class="editor-avatar"
        />
        <div className="account-name">
          <strong>Roni Äikäs</strong>
          <span>@raikas</span>
        </div>
      </div>

      <div className="post-editor">
        <EditorContent editor={editor} />
        <div className="action-bar">
          <div className="actions">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
          </div>
          <span className="character-count">
            {maxLength - editor?.storage.characterCount.characters()}
          </span>
        </div>
      </div>
      <div className="post-button-container">
        <button
          className="post-button"
          onClick={async () => {
            const content = editor?.getHTML();
            if (!content) return;
            editor?.commands.clearContent();
            const mastoText = htmlToText(content);
            console.log(JSON.stringify(mastoText));
            // TODO: add loading/posting state
            await apiClient?.v1.statuses.create({
              status: mastoText,
              language: 'fi',
            });
          }}
        >
          Publish!
        </button>
      </div>
    </div>
  );
}
