import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { statusVar } from '👨‍💻apollo/cache';

const StatusIndicator: React.FC<Props> = ({ isPreviewing }) => {
  const status = useReactiveVar(statusVar);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setPing(true);

    var timeout = setTimeout(() => {
      setPing(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [status.lastSaved]);

  return isPreviewing ? (
    <div
      aria-label={
        'Preview Mode. Changes will not be saved! Login to save your work.'
      }
      className="flex relative w-2 h-2 hint--right hint--no-animate"
    >
      <div className="inline-flex absolute -top-0.5 -left-0.5 w-3 h-3 bg-yellow-600 rounded-full animate-ping" />
      <div className="w-full h-full bg-yellow-600 rounded-full" />
    </div>
  ) : status.connected ? (
    <div
      aria-label={`Last saved: ${moment(status.lastSaved).format(
        'MMMM Do YYYY, h:mm:ss a'
      )}`}
      className="flex relative w-2 h-2 hint--right hint--no-animate"
    >
      {ping && (
        <div className="inline-flex absolute -top-0.5 -left-0.5 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-ping-quick" />
      )}
      <div className="w-full h-full bg-green-400 rounded-full" />
    </div>
  ) : (
    <div className="flex relative w-2 h-2">
      <div className="inline-flex absolute -top-0.5 -left-0.5 w-3 h-3 bg-red-600 rounded-full animate-ping" />
      <div className="w-full h-full bg-red-600 rounded-full" />
    </div>
  );
};

type Props = {
  isPreviewing?: boolean;
};

export default StatusIndicator;
