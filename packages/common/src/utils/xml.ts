import { findTagByName, findTagsByName } from 'xml-utils';

export function findTagArray(xml: string, tagName: string): string[] {
  const tags: string[] = [];
  findTagsByName(xml, tagName).forEach(tag => {
    if (tag && tag.inner) {
      tags.push(tag.inner);
    }
  });
  return tags;
}

export function findTagText(xml: string, tagName: string): string | undefined {
  const tag = findTagByName(xml, tagName);
  if (tag?.inner) {
    return tag.inner;
  }
}
