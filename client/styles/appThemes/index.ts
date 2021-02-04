import ALL_HALLOWS_EVE from '../monacoThemes/ALL_HALLOWS_EVE.json';
import COBALT from '../monacoThemes/COBALT.json';
import GITHUB from '../monacoThemes/GITHUB.json';
import VS_DARK from '../monacoThemes/VS_DARK.json';
import { IThemes, MonacoThemeType } from './utils';

export const generateTheme = (theme: MonacoThemeType) => ({
  accent: '#3dc9b0',
  bgNav:
    theme.rules.find(({ token }) => token === 'markup.heading')?.background ||
    theme.colors['editor.selectionBackground'],
  bgPrimary: theme.colors['editor.background'],
  textPrimary: VS_DARK.semanticTokenColors.newOperator,
  textSecondary:
    theme.rules.find(({ token }) => token === 'constant')?.foreground ||
    theme.colors['editor.foreground'],
});

export const themes: IThemes = {
  ALL_HALLOWS_EVE: generateTheme(ALL_HALLOWS_EVE),
  COBALT: generateTheme(COBALT as MonacoThemeType),
  GITHUB: generateTheme(GITHUB as MonacoThemeType),
};
