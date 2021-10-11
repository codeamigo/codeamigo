import { useReactiveVar } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { statusVar } from '👨‍💻apollo/cache';
import Icon from '👨‍💻components/Icon';

const StatusIndicatorV2: React.FC<Props> = ({ isActive, isPreviewing }) => {
  const status = useReactiveVar(statusVar);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setPing(true);

    var timeout = setTimeout(() => {
      setPing(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [status.lastSaved]);

  return (
    (
      <AnimatePresence>
        {ping && isActive && (
          <motion.div
            animate={{ bottom: '0.5em' }}
            className="absolute right-2"
            exit={{ bottom: '-2em' }}
            initial={{ bottom: '-2em' }}
            transition={{ duration: 1 }}
          >
            {isPreviewing ? null : status.connected ? (
              ping && isActive ? (
                <div className="flex relative">
                  {ping && (
                    <div className="flex items-center py-1 px-2 text-sm font-semibold text-white bg-green-700 rounded-2xl border border-green-200">
                      Saved{' '}
                      <Icon className="ml-2 text-green-300" name="check"></Icon>
                    </div>
                  )}
                  <div className="w-full h-full bg-green-400 rounded-full" />
                </div>
              ) : null
            ) : (
              <div className="flex relative w-2 h-2">
                <div className="inline-flex absolute -top-0.5 -left-0.5 w-3 h-3 bg-red-600 rounded-full animate-ping" />
                <div className="w-full h-full bg-red-600 rounded-full" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    ) || null
  );
};

type Props = {
  isActive: boolean;
  isPreviewing?: boolean;
};

export default StatusIndicatorV2;
