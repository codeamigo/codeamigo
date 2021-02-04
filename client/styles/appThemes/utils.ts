import monacoTheme from '../monacoThemes/ALL_HALLOWS_EVE.json';
import { generateTheme, themes } from './index';

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
