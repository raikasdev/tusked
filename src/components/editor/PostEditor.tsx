import { useMemo, useRef, useState } from 'preact/hooks';

import { useSnapshot } from 'valtio';

import { authStore } from '../../stores/auth';
import { PostEditorPart } from '../../types';
import { calculatePostLength } from '../../utils/post-length';
import textToEditorPart from '../../utils/text-to-part';
import { AutoSuggestOption } from './AutoSuggest';

interface PostEditorProps {
  maxLength: number;
}

// TODO: save drafts to localstorage?
export default function PostEditor({ maxLength }: PostEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const { account } = useSnapshot(authStore);
  const [parts, setParts] = useState<PostEditorPart[]>([]);
  const postLength = useMemo(
    () => calculatePostLength(textToEditorPart(text)),
    [text],
  );
  const [, setOptions] = useState<AutoSuggestOption[]>([]);

  const input = () => {
    if (!ref.current) return;
    if (Math.random() > 0.5) {
      setOptions([{ title: '#Mastodon' }, { title: '#Mastopoet' }]);
    } else {
      setOptions([]);
    }
    ref.current.style.height = `auto`;
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <img
          width="48"
          height="48"
          select-none=""
          src={account?.avatar}
          alt={'Your avatar'} /* TODO: i18n */
          loading="lazy"
          class="editor-avatar"
        />
        <div className="account-name">
          <strong>
            {account?.displayName || account?.acct || 'Unknown user'}
          </strong>
          <span>@{account?.acct}</span>
        </div>
      </div>

      <div className="post-editor">
        <div className="editor">
          <div className="editor-copy" onClick={() => ref.current?.focus()}>
            <p aria-hidden="true">
              {parts.map((part) => {
                switch (part.type) {
                  case 'mention':
                  case 'link':
                  case 'hashtag':
                    return <span className="link">{part.value}</span>;
                  case 'newline':
                    return <br />;
                  default:
                    return <span>{part.value}</span>;
                }
              })}
            </p>
          </div>
          <textarea
            ref={ref}
            onChange={(e) => {
              setText(e.currentTarget.value);
              setParts(textToEditorPart(e.currentTarget.value));
              input();
            }}
            spellcheck={false}
            autocomplete={'off'}
            placeholder={"What's on your mind?"} /* TODO: add i18n */
            value={text}
          />
        </div>
        <div className="action-bar">
          <div className="actions">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
          </div>
          <span className="character-count">{maxLength - postLength}</span>
        </div>
      </div>
      <div className="post-button-container">
        <button
          className="post-button"
          disabled={text === ''}
          onClick={async () => {
            if (text === '') return;
            setText('');
            input();
            /*await apiClient?.v1.statuses.create({
              status: text,
              language: 'fi',
            });*/
          }}
        >
          Publish!
        </button>
      </div>
    </div>
  );
}
