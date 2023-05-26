import React, { useEffect } from 'react';

import Button from '👨‍💻components/Button';
import { Step, useMultipleChoiceQuizQuestionsQuery } from '👨‍💻generated/graphql';

const QuizExecutionProvider: React.FC<{
  setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
  step: Step;
}> = ({ setEditorReady, step }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<string[]>([]);

  const quizQuestions = useMultipleChoiceQuizQuestionsQuery({
    variables: {
      stepId: step.id,
    },
  });

  useEffect(() => {
    if (!quizQuestions.loading) {
      setEditorReady(true);
      const nextQuestionIdx =
        quizQuestions.data?.multipleChoiceQuizQuestions.findIndex(
          (question) => {
            return !question.isCorrect;
          }
        ) || 0;
      setCurrentQuestionIdx(nextQuestionIdx);
    }
  }, [quizQuestions.loading]);

  if (quizQuestions.loading) return null;

  const currentQuestion =
    quizQuestions.data?.multipleChoiceQuizQuestions[currentQuestionIdx];

  const handleChange = (
    event: React.SyntheticEvent<HTMLInputElement, Event>
  ) => {
    const selection = event.currentTarget.value;
    const choice = currentQuestion?.choices.find((choice) => {
      return choice.value === selection;
    });

    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIdx] = choice?.value || '';
      console.log(next);
      return next;
    });
  };

  const currentAnswer = userAnswers[currentQuestionIdx];
  const showSummary =
    userAnswers.length ===
    quizQuestions.data?.multipleChoiceQuizQuestions.length;

  return (
    <div className="flex h-full flex-col justify-between text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2 text-2xl font-bold">
            {step.isCompleted ? 'tada' : currentQuestion?.value}
          </div>
          {showSummary ? (
            <div>
              {userAnswers.map((answer, idx) => {
                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-800">
                        {quizQuestions.data?.multipleChoiceQuizQuestions[idx]
                          .isCorrect
                          ? '✅'
                          : '❌'}
                      </div>
                      <div>
                        {
                          quizQuestions.data?.multipleChoiceQuizQuestions[idx]
                            .value
                        }
                      </div>
                    </div>
                    <div className="ml-8 text-sm">
                      {quizQuestions.data?.multipleChoiceQuizQuestions[
                        idx
                      ].choices.map((choice) => {
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-800">
                              {choice.isCorrectAnswer ? '✅' : '❌'}
                            </div>
                            <div>{choice.value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form className="flex flex-col gap-1">
              {currentQuestion?.choices.map((choice) => {
                return (
                  <div>
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border border-t-0 border-neutral-800 p-2 text-sm ${
                        !!currentAnswer && currentAnswer !== choice.value
                          ? 'cursor-not-allowed opacity-50'
                          : currentAnswer === choice.value &&
                            choice.isCorrectAnswer
                          ? 'border-green-500 bg-green-950 text-green-600'
                          : currentAnswer === choice.value &&
                            !choice.isCorrectAnswer
                          ? 'border-red-500 bg-red-950 text-red-600'
                          : 'hover:bg-neutral-800'
                      }`}
                    >
                      <input
                        disabled={!!currentAnswer}
                        name="answer"
                        onChange={(e) => handleChange(e)}
                        type="radio"
                        value={choice.value}
                      />
                      {choice.value}
                    </label>
                    {currentAnswer === choice.value &&
                      !choice.isCorrectAnswer &&
                      choice.hint && (
                        <div className="mt-1 text-xs text-red-600">
                          {choice.hint}
                        </div>
                      )}
                  </div>
                );
              })}
            </form>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-4 border-t border-neutral-800 py-3 text-sm font-bold">
        <Button
          disabled={currentQuestionIdx === 0}
          onClick={() => {
            setCurrentQuestionIdx(currentQuestionIdx - 1);
          }}
        >
          Previous
        </Button>
        {currentQuestionIdx + 1} /{' '}
        {quizQuestions.data?.multipleChoiceQuizQuestions.length}
        <Button
          disabled={
            !quizQuestions.data?.multipleChoiceQuizQuestions.length ||
            currentQuestionIdx ===
              quizQuestions.data?.multipleChoiceQuizQuestions.length - 1 ||
            !currentAnswer
          }
          onClick={() => {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuizExecutionProvider;
