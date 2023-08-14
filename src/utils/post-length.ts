import { PostEditorPart } from '../types';

export function calculatePostLength(parts: PostEditorPart[]) {
  if (parts.length === 1 && parts[0].type === 'newline') return 0;

  return parts.reduce((prev, part) => {
    if (part.type === 'link') return prev + 23;
    if (part.type === 'newline') return prev + 1;
    return prev + part.value.length; // Unicode Emojis are turned into text, custom emojis are normal length (:emojiname:)
  }, 0);
}
