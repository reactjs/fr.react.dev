import {Children, memo} from 'react';
import InlineCode from './InlineCode';
import Sandpack from './Sandpack';

const ShowRenderedHTML = `
import { renderToStaticMarkup } from 'react-dom/server';
import formatHTML from './formatHTML.js';

export default function ShowRenderedHTML({children}) {
  const markup = renderToStaticMarkup(
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
  return (
    <>
      <h1>HTML produit :</h1>
      <pre>
        {formatHTML(markup)}
      </pre>
    </>
  );  
}`;

const formatHTML = `
import format from 'html-format';

export default function formatHTML(markup) {
  // Bidouilles pour formatter lisiblement le HTML -- je n'ai pas
  // réussi à trouver un module tournant côté navigateur qui nettoie
  // le HTML s'il n'a pas de retours-chariot.
  return format(markup
    .replace('<html>', '<html>\\n')
    .replace('<head>', '<head>\\n')
    .replaceAll(/<\\/script>/g, '<\\/script>\\n')
    .replaceAll(/<style([^>]*)\\/>/g, '<style $1/>\\n\\n')
    .replaceAll(/<\\/style>/g, '\\n    <\\/style>\\n')
    .replaceAll(/<link([^>]*)\\/>/g, '<link $1/>\\n')
    .replaceAll(/<meta([^/]*)\\/>/g, '<meta $1/>\\n')
    .replace('</head>', '</head>\\n')
    .replace('<body>', '<body>\\n')
    .replace('</body>', '\\n</body>\\n')
    .replace('</h1>', '</h1>\\n')
  );
}
`;

const packageJSON = `
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "html-format": "^1.1.2"
  },
  "main": "/index.js",
  "devDependencies": {}
}
`;

// Intentionally not a React component because <Sandpack> will read
// through its childrens' props. This imitates the output of ```
// codeblocks in MDX.
function createFile(meta: string, source: string) {
  return (
    <pre key={meta}>
      <InlineCode meta={meta} className="language-js">
        {source}
      </InlineCode>
    </pre>
  );
}

export default memo(function SandpackWithHTMLOutput(
  props: React.ComponentProps<typeof Sandpack>
) {
  const children = [
    ...Children.toArray(props.children),
    createFile('src/ShowRenderedHTML.js', ShowRenderedHTML),
    createFile('src/formatHTML.js hidden', formatHTML),
    createFile('package.json hidden', packageJSON),
  ];
  return <Sandpack {...props}>{children}</Sandpack>;
});
