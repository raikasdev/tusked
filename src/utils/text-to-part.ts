import { PostEditorPart } from '../types';

const mentionRegex = /(.*)(?<=^|[^/\w])@((?:[a-z0-9_]+(?:@[.\w-]+[\w]+)?))(.*)/; // From mastodon core with two .* groups
const hashtagRegex =
  /(.*)(?:^|[^/)\w])#(([\w_][\w_\u00B7\u30FB\u200c]*[\w\u00B7\u30FB\u200c])|([\w\u00B7\u30FB\u200c]*[\w_]))(.*)/;

const urlAllowedProtocols = [
  'http:',
  'https:',
  'dat:',
  'dweb:',
  'ipfs:',
  'ipns:',
  'ssb:',
  'gopher:',
  'xmpp:',
  'magnet:',
  'gemini:',
];

function isURL(url: string) {
  try {
    const urlObject = new URL(url);
    if (!urlAllowedProtocols.includes(urlObject.protocol)) return false;
    if (!urlObject.hostname.includes('.') || urlObject.hostname.endsWith('.'))
      return false; // TLD
    return true;
  } catch {
    return false;
  }
}

export default function textToEditorPart(text: string): PostEditorPart[] {
  const lines = text.split('\n');
  const items = lines.map((line, index) => {
    const words = line.split(' ');
    const values = words
      .map((word, wordIndex) => {
        const mentionMatch = word.match(mentionRegex);
        if (mentionMatch) {
          // Check if has start
          const parts = [];
          parts.push({
            type: 'text',
            value: `${wordIndex !== 0 ? ' ' : ''}${mentionMatch[1]}`,
          });
          parts.push({ type: 'mention', value: `@${mentionMatch[2]}` });
          parts.push({
            type: 'text',
            value: `${mentionMatch[3]}${
              wordIndex !== words.length - 1 ? ' ' : ''
            }`,
          });

          return parts;
        }

        const hashtagMatch = word.match(hashtagRegex);
        if (hashtagMatch) {
          // Check if has start
          const parts = [];
          parts.push({
            type: 'text',
            value: `${wordIndex !== 0 ? ' ' : ''}${hashtagMatch[1]}`,
          });
          parts.push({ type: 'hashtag', value: `#${hashtagMatch[2]}` });
          parts.push({
            type: 'text',
            value: `${hashtagMatch[5]}${
              wordIndex !== words.length - 1 ? ' ' : ''
            }`,
          });

          return parts;
        }

        if (isURL(word)) return [{ type: 'link', value: word }]; // TODO: better stuff for this, take into count ' etc

        const prefixSpace = wordIndex !== 0 ? ' ' : '';
        const suffixSpace = wordIndex !== words.length - 1 ? ' ' : '';
        return [{ type: 'text', value: `${prefixSpace}${word}${suffixSpace}` }];
      })
      .reduce((prev, cur) => prev.concat(cur));

    if (index !== lines.length - 1) values.push({ type: 'newline', value: '' });
    return values;
  }) as PostEditorPart[][];

  return items.reduce((prev, cur) => prev.concat(cur)) ?? [];
}
