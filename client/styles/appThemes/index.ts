import ALL_HALLOWS_EVE from '../monacoThemes/ALL_HALLOWS_EVE.json';
import COBALT from '../monacoThemes/COBALT.json';
import GITHUB from '../monacoThemes/GITHUB.json';
import base from './base';
import { IThemes, MonacoThemeType } from './utils';

export const generateTheme = (theme: MonacoThemeType) => ({
  primary: '#d4d4d4',
  primaryBg: theme.colors['editor.background'],
  // TODO: fix this, get from vs-dark or base
  secondary: theme.rules.find(({ token }) => token === 'constant')?.foreground
    ? `#${theme.rules.find(({ token }) => token === 'constant')?.foreground}`
    : theme.colors['editor.foreground'],
  secondaryBg: theme.colors['editor.foreground'],
  // TODO: fix this, get from vs-dark or base
  ternary: '#3dc9b0',
  ternaryBg: theme.rules.find(({ token }) => token === 'markup.heading')
    ? `#${
        theme.rules.find(({ token }) => token === 'markup.heading')!.background
      }`
    : theme.colors['editor.selectionBackground'] || '',
});

export const themes: IThemes = {
  ALL_HALLOWS_EVE: generateTheme(ALL_HALLOWS_EVE),
  COBALT: generateTheme(COBALT as MonacoThemeType),
  GITHUB: generateTheme(GITHUB as MonacoThemeType),
  base,
};
