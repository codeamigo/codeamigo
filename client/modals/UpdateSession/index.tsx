import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import { useUpdateSessionMutation } from '👨‍💻generated/graphql';

const UpdateSession: React.FC<Props> = () => {
  const { lessonId, sessionId } = modalVar().data;
  const [updateSession] = useUpdateSessionMutation();

  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">🆕</div>
      <div className="mt-2 font-semibold text-text-primary">
        New Version Available
      </div>
      <div className="text-xs text-text-primary">
        This lesson has been updated by the original author. We recommend
        updating. Your progress will not be affected.
      </div>
      <div className="flex items-center">
        <Button
          className="mt-5"
          onClick={() =>
            updateSession({
              variables: {
                lessonId,
                sessionId,
              },
            })
          }
        >
          Update
        </Button>
      </div>
    </div>
  );
};

type Props = {};

export default UpdateSession;
