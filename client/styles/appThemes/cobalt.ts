import cobalt from '../monacoThemes/cobalt.json';

export default {
  primary: cobalt.colors['editor.background'],
  secondary: cobalt.colors['editor.foreground'],
  ternary:
    `#${
      cobalt.rules.find(({ token }) => token === 'markup.heading')?.background
    }` ||
    cobalt.colors['editor.selectionBackground'] ||
    '',
};
