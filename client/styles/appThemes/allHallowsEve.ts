import allHallowsEve from '../monacoThemes/allHallowsEve.json';

export default {
  primary: allHallowsEve.colors['editor.background'],
  secondary: allHallowsEve.colors['editor.foreground'],
  ternary: allHallowsEve.rules.find(({ token }) => token === 'markup.heading')
    ? `#${
        allHallowsEve.rules.find(({ token }) => token === 'markup.heading')!
          .background
      }`
    : allHallowsEve.colors['editor.selectionBackground'] || '',
};
