function getAllElementTagsRecursively(el: Element): string[] {
  const returnList = [];
  returnList.push(el.tagName);

  for (let index = 0; index < el.children.length; index++) {
    const cel = el.children[index];
    returnList.push(...getAllElementTagsRecursively(cel));
  }
  return returnList;
}

function findAllElementsByPrefix(el: HTMLElement, prefix: string): string[] {
  const returnList = [];
  const tagList = getAllElementTagsRecursively(el);

  for (let index = 0; index < tagList.length; index++) {
    const element = tagList[index];
    const tagName = element.toLocaleLowerCase();
    if (!tagName.startsWith(prefix)) {
      continue;
    }
    returnList.push(tagName);
  }

  return returnList.sort();
}

export function findAllCamfilElements(el: HTMLElement): string[] {
  return findAllElementsByPrefix(el, 'camfil-');
}
