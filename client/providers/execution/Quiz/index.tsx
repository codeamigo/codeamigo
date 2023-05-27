import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Button from '👨‍💻components/Button';
import { Step, useMultipleChoiceQuizQuestionsQuery } from '👨‍💻generated/graphql';

const QuizExecutionProvider: React.FC<{
  lessonSlug: string;
  setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
  step: Step;
}> = ({ lessonSlug, setEditorReady, step }) => {
  const router = useRouter();

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
  const getIsCorrect = (answer: string, idx: number) => {
    return quizQuestions.data?.multipleChoiceQuizQuestions[idx].choices.find(
      (choice) => {
        return choice.value === answer && choice.isCorrectAnswer;
      }
    );
  };
  const correctAnswers = userAnswers.filter((answer, idx) =>
    getIsCorrect(answer, idx)
  );
  const incorrectAnswers = userAnswers.filter(
    (answer, idx) => !getIsCorrect(answer, idx)
  );

  return (
    <div className="flex h-full flex-col justify-between text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2 text-2xl font-bold">
            {showSummary ? 'Summary' : currentQuestion?.value}
          </div>
          {showSummary ? (
            <div>
              You got {correctAnswers.length} out of {userAnswers.length}{' '}
              questions correct.
              {userAnswers.map((answer, idx) => {
                const isCorrect = getIsCorrect(answer, idx);
                if (!isCorrect) return null;

                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={'text-green-600'}>
                        {
                          quizQuestions.data?.multipleChoiceQuizQuestions[idx]
                            .value
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
              {incorrectAnswers.length > 0 && (
                <div className="mt-4">
                  You need to work on the following questions:
                </div>
              )}
              {userAnswers.map((answer, idx) => {
                const isCorrect = getIsCorrect(answer, idx);
                if (isCorrect) return null;

                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={
                          isCorrect
                            ? 'text-green-600'
                            : 'text-red-600 line-through'
                        }
                      >
                        {
                          quizQuestions.data?.multipleChoiceQuizQuestions[idx]
                            .value
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
              {incorrectAnswers.length > 0 && (
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setUserAnswers(() => []);
                      setCurrentQuestionIdx(0);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <form className="flex flex-col gap-1">
              {currentQuestion?.choices.map((choice) => {
                const isAnswered = !!currentAnswer;
                const isCorrectlyAnswered =
                  currentAnswer === choice.value && choice.isCorrectAnswer;
                const isIncorrectlyAnswered =
                  currentAnswer === choice.value && !choice.isCorrectAnswer;

                return (
                  <div>
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 p-2 text-sm ${
                        isCorrectlyAnswered
                          ? 'border-green-500 bg-green-950 text-green-600'
                          : isIncorrectlyAnswered
                          ? 'border-red-500 bg-red-950 text-red-600'
                          : isAnswered
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-neutral-800'
                      }`}
                    >
                      <input
                        disabled={!!currentAnswer}
                        key={choice.value}
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
      <div>
        <div className="mb-6 w-full text-2xl">
          {currentAnswer &&
          quizQuestions.data?.multipleChoiceQuizQuestions[
            currentQuestionIdx
          ].choices.find((choice) => {
            return choice.value === currentAnswer;
          })?.isCorrectAnswer &&
          !showSummary ? (
            <div className="flex items-center justify-center">
              <span>🎉</span>
            </div>
          ) : (
            <div className="invisible">
              <span>🎉</span>
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-center gap-4 border-t border-neutral-800 py-3 text-sm font-bold">
          {showSummary ? (
            <>
              <Button
                disabled={!step.prevSlug}
                onClick={() => {
                  router.push(`/v2/lesson/${lessonSlug}/step/${step.prevSlug}`);
                }}
              >
                Back
              </Button>
              <Button
                disabled={!step.nextSlug}
                onClick={() => {
                  router.push(`/v2/lesson/${lessonSlug}/step/${step.nextSlug}`);
                }}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
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
                    quizQuestions.data?.multipleChoiceQuizQuestions.length -
                      1 ||
                  !currentAnswer
                }
                onClick={() => {
                  setCurrentQuestionIdx(currentQuestionIdx + 1);
                }}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizExecutionProvider;
