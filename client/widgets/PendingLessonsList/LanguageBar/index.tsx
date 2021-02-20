import React from 'react';

import { LessonsQuery } from '👨‍💻generated/graphql';
import githubColors from '👨‍💻utils/githubColors';
import { getFileExt, githubFileLanguage } from '👨‍💻utils/index';

const LanguageBar: React.FC<Props> = ({ steps }) => {
  const codeModules = steps?.flatMap(({ codeModules }) => codeModules);
  if (!codeModules) return null;
  const languageMap = codeModules.reduce(
    (acc, curr) => {
      if (!curr?.name) return acc;
      const ext = getFileExt(curr.name);
      const lang = githubFileLanguage(ext);

      if (acc[lang]) {
        acc[lang] = acc[lang] + 1;
      } else {
        acc[lang] = 1;
      }

      acc.total += 1;

      return acc;
    },
    { total: 0 } as { [key in string]: number }
  );
  const sortedLangs = Object.keys(languageMap).sort(
    (a, b) => languageMap[b] - languageMap[a]
  );

  return (
    <div className="flex flex-wrap gap-2 w-10">
      {sortedLangs.map((lang) => {
        if (lang === 'total') return;
        return (
          <div
            aria-label={`${lang}: ${(
              (languageMap[lang] / languageMap.total) *
              100
            ).toFixed(0)}%`}
            className="h-2 w-2 rounded-full hint--top hint--no-animate"
            key={lang}
            style={{
              // @ts-ignore
              backgroundColor: githubColors[lang]?.color,
            }}
          ></div>
        );
      })}
    </div>
  );
};

type Props = {
  steps: LessonsQuery['lessons'][0]['steps'];
};

export default LanguageBar;
