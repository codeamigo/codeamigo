import monacoTheme from '../monacoThemes/All Hallows Eve.json';
import { generateTheme, themes } from './index';

const Color = require('color');
const lighten = (clr: string, val: number) =>
  Color(clr).lighten(val).rgb().string();
const darken = (clr: string, val: number) =>
  Color(clr).darken(val).rgb().string();
const fade = (clr: string, val: number) => Color(clr).fade(val).string();

export type MonacoThemeType = typeof monacoTheme;
export type ThemeType = ReturnType<typeof generateTheme>;
export type MappedThemeType = ReturnType<typeof mapTheme>;

export interface IThemes {
  [key: string]: ThemeType;
}

export const mapTheme = (variables: ThemeType) => {
  return {
    '--accent': variables.accent || '',
    '--accent-faded': fade(variables.accent, 0.3) || '',
    '--bg-nav': variables.bgNav || '',
    '--bg-nav-faded': fade(variables.bgNav, 0.3) || '',
    '--bg-nav-offset':
      variables.base === 'vs-dark'
        ? lighten(variables.bgNav, 2)
        : darken(variables.bgNav, 2),
    '--bg-nav-offset-faded':
      variables.base === 'vs-dark'
        ? fade(lighten(variables.bgNav, 2), 0.3)
        : fade(darken(variables.bgNav, 2), 0.3),
    '--bg-primary': variables.bgPrimary || '',
    '--text-primary': variables.textPrimary || '',
    '--text-secondary': variables.textSecondary || '',
  };
};

export const applyTheme = (theme: string): void => {
  const themeObject: MappedThemeType = mapTheme(themes[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    root.style.setProperty(
      property,
      themeObject[property as keyof MappedThemeType]
    );
  });
};
