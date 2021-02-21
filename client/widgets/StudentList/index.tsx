import React from 'react';

import { useStudentsQuery } from '👨‍💻generated/graphql';

const StudentList: React.FC<Props> = () => {
  const { data } = useStudentsQuery();

  if (!data?.users) return null;

  return (
    <div>
      {data.users.map((user) => {
        return (
          <div className="text-text-primary">
            {user.email} {new Date(Number(user.createdAt)).toLocaleDateString()}
          </div>
        );
      })}
    </div>
  );
};

type Props = {};

export default StudentList;
