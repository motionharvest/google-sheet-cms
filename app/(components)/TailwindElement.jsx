const VALID_TAG = /^[a-zA-Z][a-zA-Z0-9-]*$/;
const TAG_ALIASES = {
  image: 'img',
  picture: 'picture',
  paragraph: 'p',
  heading: 'h2',
};

const ALLOWED_TAGS = new Set([
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'figure',
  'figcaption',
  'button',
  'strong',
  'em',
  'small',
  'blockquote',
  'pre',
  'code',
  'picture',
]);

export const VOID_TAGS = new Set([
  'img',
  'br',
  'hr',
  'input',
  'meta',
  'link',
  'source',
  'area',
  'base',
  'col',
  'embed',
  'param',
  'track',
  'wbr',
]);

export function normalizeTag(tag) {
  if (typeof tag !== 'string' || !VALID_TAG.test(tag)) {
    return 'div';
  }

  const candidate = tag.toLowerCase();
  const alias = TAG_ALIASES[candidate] ?? candidate;

  if (!ALLOWED_TAGS.has(alias)) {
    return 'div';
  }

  return alias;
}

export default function TailwindElement({ tag = 'div', className = '', content = '', attributes = {} }) {
  const ElementTag = normalizeTag(tag);
  const stringContent = content?.toString() ?? '';
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(stringContent);
  const mergedClassName = className?.toString().trim();
  const isVoidElement = VOID_TAGS.has(ElementTag);
  const extraProps = {};

  Object.entries(attributes || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    extraProps[key] = value;
  });

  if (isVoidElement) {
    return <ElementTag className={mergedClassName || undefined} {...extraProps} />;
  }

  if (containsHtml) {
    return (
      <ElementTag
        className={mergedClassName || undefined}
        {...extraProps}
        dangerouslySetInnerHTML={{ __html: stringContent }}
      />
    );
  }

  return (
    <ElementTag className={mergedClassName || undefined} {...extraProps}>
      {stringContent}
    </ElementTag>
  );
}

