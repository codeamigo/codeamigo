import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { statusVar } from '👨‍💻apollo/cache';

const StatusIndicator: React.FC<Props> = () => {
  const status = useReactiveVar(statusVar);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setPing(true);

    setTimeout(() => {
      setPing(false);
    }, 1500);
  }, [status.lastSaved]);

  return status.connected ? (
    <div
      aria-label={`Last saved: ${moment(status.lastSaved).format(
        'MMMM Do YYYY, h:mm:ss a'
      )}`}
      className="relative flex h-3 w-3 hint--right hint--no-animate"
    >
      {ping && (
        <div className="h-4 w-4 absolute -left-0.5 -top-0.5 inline-flex animate-ping-quick bg-green-400 opacity-50 rounded-full" />
      )}
      <div className="h-full w-full bg-green-400 rounded-full" />
    </div>
  ) : (
    <div className="relative flex h-3 w-3">
      <div className="h-4 w-4 absolute -left-0.5 -top-0.5 inline-flex animate-ping bg-red-600 rounded-full" />
      <div className="h-full w-full bg-red-600 rounded-full" />
    </div>
  );
};

type Props = {};

export default StatusIndicator;
