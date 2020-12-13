import React from "react";
import { LessonQuery } from "../../../generated/graphql";

const Steps: React.FC<Props> = ({ data, handleClick }) => {
  return (
    <ol className="w-1/12 px-4 py-5 bg-white sm:p-6">
      {data.lesson?.steps &&
        data.lesson.steps.map((step, i) => {
          return <li onClick={() => handleClick(i)}>Step: {i + 1}</li>;
        })}
    </ol>
  );
};

type Props = {
  data: LessonQuery
  handleClick: (n: number) => void
};

export default Steps;
