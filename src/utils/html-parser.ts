import { decode } from 'tiny-decode';
import type { Node } from 'ultrahtml';
import { TEXT_NODE, parse } from 'ultrahtml';

import logger from './logger';

export function htmlToText(html: string) {
  try {
    const tree = parse(html);
    return (tree.children as Node[])
      .map((n) => treeToText(n))
      .join('')
      .trim();
  } catch (err) {
    logger.error(err);
    return '';
  }
}

export function recursiveTreeToText(input: Node): string {
  if (input && input.children && input.children.length > 0)
    return input.children.map((n: Node) => recursiveTreeToText(n)).join('');
  else return treeToText(input);
}

const emojiIdNeedsWrappingRE = /^(\d|\w|-|_)+$/;

export function treeToText(input: Node): string {
  let pre = '';
  let body = '';
  let post = '';

  if (input.type === TEXT_NODE) return decode(input.value);

  if (input.name === 'br') return '\n';

  if (['p', 'pre'].includes(input.name)) pre = '\n';

  if (input.attributes?.['data-type'] === 'mention') {
    const acct = input.attributes['data-id'];
    if (acct) return acct.startsWith('@') ? acct : `@${acct}`;
  }

  if (input.name === 'code') {
    if (input.parent?.name === 'pre') {
      const lang = input.attributes.class?.replace('language-', '');

      pre = `\`\`\`${lang || ''}\n`;
      post = '\n```';
    } else {
      pre = '`';
      post = '`';
    }
  } else if (input.name === 'b' || input.name === 'strong') {
    pre = '**';
    post = '**';
  } else if (input.name === 'i' || input.name === 'em') {
    pre = '*';
    post = '*';
  } else if (input.name === 'del') {
    pre = '~~';
    post = '~~';
  }

  if ('children' in input)
    body = (input.children as Node[]).map((n) => treeToText(n)).join('');

  if (input.name === 'img' || input.name === 'picture') {
    if (input.attributes.class?.includes('custom-emoji')) {
      const id =
        input.attributes['data-emoji-id'] ??
        input.attributes.alt ??
        input.attributes.title ??
        'unknown';
      return id.match(emojiIdNeedsWrappingRE) ? `:${id}:` : id;
    }
    if (input.attributes.class?.includes('iconify-emoji'))
      return input.attributes.alt;
  }

  return pre + body + post;
}
