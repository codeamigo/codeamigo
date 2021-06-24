import active4d from '../monacoThemes/Active4D.json';
import all_hallows_eve from '../monacoThemes/All Hallows Eve.json';
import amy from '../monacoThemes/Amy.json';
import birds_of_paradise from '../monacoThemes/Birds of Paradise.json';
import blackboard from '../monacoThemes/Blackboard.json';
import brilliance_black from '../monacoThemes/Brilliance Black.json';
import brilliance_dull from '../monacoThemes/Brilliance Dull.json';
import chrome_devtools from '../monacoThemes/Chrome DevTools.json';
import clouds_midnight from '../monacoThemes/Clouds Midnight.json';
import clouds from '../monacoThemes/Clouds.json';
import cobalt from '../monacoThemes/Cobalt.json';
import dawn from '../monacoThemes/Dawn.json';
import dreamweaver from '../monacoThemes/Dreamweaver.json';
import eiffel from '../monacoThemes/Eiffel.json';
import espresso_libre from '../monacoThemes/Espresso Libre.json';
import github from '../monacoThemes/GitHub.json';
import idle from '../monacoThemes/IDLE.json';
import idlefingers from '../monacoThemes/idleFingers.json';
import iplastic from '../monacoThemes/iPlastic.json';
import katzenmilch from '../monacoThemes/Katzenmilch.json';
import krtheme from '../monacoThemes/krTheme.json';
import kuroir_theme from '../monacoThemes/Kuroir Theme.json';
import lazy from '../monacoThemes/LAZY.json';
import magicwb__amiga_ from '../monacoThemes/MagicWB (Amiga).json';
import merbivore_soft from '../monacoThemes/Merbivore Soft.json';
import merbivore from '../monacoThemes/Merbivore.json';
import monoindustrial from '../monacoThemes/monoindustrial.json';
import monokai_bright from '../monacoThemes/Monokai Bright.json';
import monokai from '../monacoThemes/Monokai.json';
import night_owl from '../monacoThemes/Night Owl.json';
import oceanic_next from '../monacoThemes/Oceanic Next.json';
import pastels_on_dark from '../monacoThemes/Pastels on Dark.json';
import slush_and_poppies from '../monacoThemes/Slush and Poppies.json';
import solarized_dark from '../monacoThemes/Solarized-dark.json';
import solarized_light from '../monacoThemes/Solarized-light.json';
import spacecadet from '../monacoThemes/SpaceCadet.json';
import sunburst from '../monacoThemes/Sunburst.json';
import textmate__mac_classic_ from '../monacoThemes/Textmate (Mac Classic).json';
import tomorrow from '../monacoThemes/Tomorrow.json';
import tomorrow_night from '../monacoThemes/Tomorrow-Night.json';
import tomorrow_night_blue from '../monacoThemes/Tomorrow-Night-Blue.json';
import tomorrow_night_bright from '../monacoThemes/Tomorrow-Night-Bright.json';
import tomorrow_night_eighties from '../monacoThemes/Tomorrow-Night-Eighties.json';
import twilight from '../monacoThemes/Twilight.json';
import upstream_sunburst from '../monacoThemes/Upstream Sunburst.json';
import vibrant_ink from '../monacoThemes/Vibrant Ink.json';
import VS_DARK from '../monacoThemes/VS_DARK.json';
import xcode_default from '../monacoThemes/Xcode_default.json';
import zenburnesque from '../monacoThemes/Zenburnesque.json';
import { IThemes, MonacoThemeType } from './utils';

export const generateTheme = (theme: MonacoThemeType) => ({
  accent: theme.rules.find(({ token }) => token === 'keyword')?.foreground
    ? '#' + theme.rules.find(({ token }) => token === 'keyword')?.foreground
    : '#3dc9b0',
  base: theme.base,
  bgNav: theme.rules.find(({ token }) => token === 'markup.heading')?.background
    ? '#' +
      theme.rules.find(({ token }) => token === 'markup.heading')?.background
    : theme.colors['editor.selectionBackground'],
  bgPrimary: theme.colors['editor.background'],
  textPrimary:
    theme.base === 'vs-dark' ? VS_DARK.semanticTokenColors.newOperator : '#000',
  textSecondary: theme.rules.find(({ token }) => token === 'constant')
    ?.foreground
    ? '#' + theme.rules.find(({ token }) => token === 'constant')?.foreground
    : theme.colors['editor.foreground'],
});

export const DEFAULT_THEME = 'idle';

export const themes: IThemes = {
  active4d: generateTheme(active4d as MonacoThemeType),
  all_hallows_eve: generateTheme(all_hallows_eve),
  amy: generateTheme(amy as MonacoThemeType),
  birds_of_paradise: generateTheme(birds_of_paradise as MonacoThemeType),
  blackboard: generateTheme(blackboard as MonacoThemeType),
  brilliance_black: generateTheme(brilliance_black as MonacoThemeType),
  brilliance_dull: generateTheme(brilliance_dull as MonacoThemeType),
  chrome_devtools: generateTheme(chrome_devtools as MonacoThemeType),
  clouds: generateTheme(clouds as MonacoThemeType),
  clouds_midnight: generateTheme(clouds_midnight as MonacoThemeType),
  cobalt: generateTheme(cobalt as MonacoThemeType),
  dawn: generateTheme(dawn as MonacoThemeType),
  dreamweaver: generateTheme(dreamweaver as MonacoThemeType),
  eiffel: generateTheme(eiffel as MonacoThemeType),
  espresso_libre: generateTheme(espresso_libre as MonacoThemeType),
  github: generateTheme(github as MonacoThemeType),
  idle: generateTheme(idle as MonacoThemeType),
  idlefingers: generateTheme(idlefingers as MonacoThemeType),
  iplastic: generateTheme(iplastic as MonacoThemeType),
  katzenmilch: generateTheme(katzenmilch as MonacoThemeType),
  krtheme: generateTheme(krtheme as MonacoThemeType),
  kuroir_theme: generateTheme(kuroir_theme as MonacoThemeType),
  lazy: generateTheme(lazy as MonacoThemeType),
  magicwb__amiga_: generateTheme(magicwb__amiga_ as MonacoThemeType),
  merbivore: generateTheme(merbivore as MonacoThemeType),
  merbivore_soft: generateTheme(merbivore_soft as MonacoThemeType),
  monoindustrial: generateTheme(monoindustrial as MonacoThemeType),
  monokai: generateTheme(monokai as MonacoThemeType),
  monokai_bright: generateTheme(monokai_bright as MonacoThemeType),
  night_owl: generateTheme(night_owl as MonacoThemeType),
  oceanic_next: generateTheme(oceanic_next as MonacoThemeType),
  pastels_on_dark: generateTheme(pastels_on_dark as MonacoThemeType),
  slush_and_poppies: generateTheme(slush_and_poppies as MonacoThemeType),
  solarized_dark: generateTheme(solarized_dark as MonacoThemeType),
  solarized_light: generateTheme(solarized_light as MonacoThemeType),
  spacecadet: generateTheme(spacecadet as MonacoThemeType),
  sunburst: generateTheme(sunburst as MonacoThemeType),
  textmate__mac_classic_: generateTheme(
    textmate__mac_classic_ as MonacoThemeType
  ),
  tomorrow: generateTheme(tomorrow as MonacoThemeType),
  tomorrow_night: generateTheme(tomorrow_night as MonacoThemeType),
  tomorrow_night_blue: generateTheme(tomorrow_night_blue as MonacoThemeType),
  tomorrow_night_bright: generateTheme(
    tomorrow_night_bright as MonacoThemeType
  ),
  tomorrow_night_eighties: generateTheme(
    tomorrow_night_eighties as MonacoThemeType
  ),
  twilight: generateTheme(twilight as MonacoThemeType),
  upstream_sunburst: generateTheme(upstream_sunburst as MonacoThemeType),
  vibrant_ink: generateTheme(vibrant_ink as MonacoThemeType),
  xcode_default: generateTheme(xcode_default as MonacoThemeType),
  zenburnesque: generateTheme(zenburnesque as MonacoThemeType),
};
