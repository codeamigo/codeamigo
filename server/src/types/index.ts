import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';

type MySession = Session & { userId: string };

export type MyContext = {
  redis: Redis;
  req: Request & { session: MySession };
  res: Response;
};

export enum ThemeEnum {
  'active4d' = 'Active4D',
  'all_hallows_eve' = 'All Hallows Eve',
  'amy' = 'Amy',
  'birds_of_paradise' = 'Birds of Paradise',
  'blackboard' = 'Blackboard',
  'brilliance_black' = 'Brilliance Black',
  'brilliance_dull' = 'Brilliance Dull',
  'chrome_devtools' = 'Chrome DevTools',
  'clouds_midnight' = 'Clouds Midnight',
  'clouds' = 'Clouds',
  'cobalt' = 'Cobalt',
  'dawn' = 'Dawn',
  'dreamweaver' = 'Dreamweaver',
  'eiffel' = 'Eiffel',
  'espresso_libre' = 'Espresso Libre',
  'github' = 'GitHub',
  'idle' = 'IDLE',
  'katzenmilch' = 'Katzenmilch',
  'kuroir_theme' = 'Kuroir Theme',
  'lazy' = 'LAZY',
  'magicwb__amiga_' = 'MagicWB (Amiga)',
  'merbivore_soft' = 'Merbivore Soft',
  'merbivore' = 'Merbivore',
  'monokai_bright' = 'Monokai Bright',
  'monokai' = 'Monokai',
  'night_owl' = 'Night Owl',
  'oceanic_next' = 'Oceanic Next',
  'pastels_on_dark' = 'Pastels on Dark',
  'slush_and_poppies' = 'Slush and Poppies',
  'solarized_dark' = 'Solarized-dark',
  'solarized_light' = 'Solarized-light',
  'spacecadet' = 'SpaceCadet',
  'sunburst' = 'Sunburst',
  'textmate_mac_classic_' = 'Textmate (Mac Classic)',
  'tomorrow_night_blue' = 'Tomorrow-Night-Blue',
  'tomorrow_night_bright' = 'Tomorrow-Night-Bright',
  'tomorrow_night_eighties' = 'Tomorrow-Night-Eighties',
  'tomorrow_night' = 'Tomorrow-Night',
  'tomorrow' = 'Tomorrow',
  'twilight' = 'Twilight',
  'upstream_sunburst' = 'Upstream Sunburst',
  'vibrant_ink' = 'Vibrant Ink',
  'xcode_default' = 'Xcode_default',
  'zenburnesque' = 'Zenburnesque',
  'iplastic' = 'iPlastic',
  'idlefingers' = 'idleFingers',
  'krtheme' = 'krTheme',
  'monoindustrial' = 'monoindustrial',
}
