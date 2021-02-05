import monacoTheme from '../monacoThemes/All Hallows Eve.json';
import { generateTheme, themes } from './index';

const Color = require('color');
const lighten = (clr: string, val: number) =>
  Color(clr).lighten(val).rgb().string();
const darken = (clr: string, val: number) =>
  Color(clr).darken(val).rgb().string();

export type MonacoThemeType = typeof monacoTheme;
export type ThemeType = ReturnType<typeof generateTheme>;
export type MappedThemeType = ReturnType<typeof mapTheme>;

export interface IThemes {
  [key: string]: ThemeType;
}

export const mapTheme = (variables: ThemeType) => {
  return {
    '--accent': variables.accent || '',
    '--bg-nav': variables.bgNav || '',
    '--bg-nav-lighter': lighten(variables.bgNav, 2),
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
