import React from 'react';
import { TokenUsageStatusType } from 'types';

import { modalVar } from '👨‍💻apollo/cache/modal';

const Credits: React.FC<Props> = ({
  maxTokens,
  tokenUsageStatus,
  tokensUsed,
}) => {
  if (tokensUsed === null) return null;
  if (maxTokens === null) return null;
  let percentageUsed = (Math.min(tokensUsed, maxTokens) / maxTokens) * 100;

  return (
    <div
      aria-label="Token Usage"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        modalVar({
          callback: () => null,
          data: {
            tokenUsageStatus,
            tokensUsed,
          },
          name: 'usage',
          persistent: false,
        });
      }}
    >
      <pre className="hidden text-xs text-white sm:inline-block">
        Usage Limit
      </pre>
      <div
        className={`h-2 w-32 rounded-full p-[2px] transition-all duration-300 ${
          tokenUsageStatus === 'safe'
            ? 'bg-blue-900'
            : tokenUsageStatus === 'warning'
            ? 'bg-yellow-900'
            : 'bg-red-900'
        }`}
      >
        <div
          className={`h-full rounded-full bg-blue-500 transition-all duration-300 ${
            tokenUsageStatus === 'safe'
              ? 'bg-blue-500'
              : tokenUsageStatus === 'warning'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{
            width: Math.max(5, percentageUsed) + '%',
          }}
        />
      </div>
    </div>
  );
};

type Props = {
  maxTokens: number | null;
  tokenUsageStatus: TokenUsageStatusType;
  tokensUsed: number | null;
};

export default Credits;
