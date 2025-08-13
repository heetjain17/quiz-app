import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

export const Route = createFileRoute('/quiz/$quizId/questions')({
  // loading the questions before component renders
  loader: async ({ params }) => {
    const questionsModule = await import(`../../../data/${params.quizId}.json`);
    return questionsModule.default;
  },
  component: QuizSessionPage,
});

function QuizSessionPage() {
  const questions = Route.useLoaderData();
  const { quizId } = Route.useParams();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // small performance optimization
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex], // creator function (performs the calculation and returns a value)
    [questions, currentQuestionIndex] // dependency array (re-run if anything is changed)
  );

  // starts the timer
  useEffect(() => {
    // if question is answered stops the timer
    if (isAnswered) return;

    // resets the timer
    setTimeLeft(30);
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          setIsAnswered(true);
          setSelectedAnswer(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId); // cleanup fn
  }, [currentQuestionIndex]);

  // updates the score
  const handleAnswerSelect = (option) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(option);

    // checks and updates the score
    if (option === currentQuestion.answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // updates the indexes of question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // Reset for the next question
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      // End of the quiz, navigate to results page
      navigate({
        to: '/quiz/$quizId/results',
        params: { quizId },
        state: { finalScore: score, totalQuestions: questions.length },
      });
    }
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4 sm:space-y-6 rounded-2xl bg-gray-800/60 p-4 sm:p-6 shadow-2xl">
        {/* Header and Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="w-1/3">
              Question {currentQuestionIndex + 1}
              <span className="text-sm text-gray-400">/{questions.length}</span>
            </span>

            {/* timer */}
            <span className="w-1/3 text-center text-2xl text-cyan-400">
              {timeLeft}s
            </span>
            <span className="w-1/3 text-right">Score: {score}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-lg bg-gray-900/50 p-4 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-100">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.answer;

            let buttonClass = 'bg-gray-700 hover:bg-gray-600';
            if (isAnswered) {
              if (isCorrect) {
                buttonClass = 'bg-green-500 text-white';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-500 text-white';
              } else {
                buttonClass = 'bg-gray-800 text-gray-400';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full rounded-lg cursor-pointer p-3 sm:p-4 text-left text-base sm:text-lg font-medium text-white transition-colors duration-200 ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Next Question Button */}
        {isAnswered && (
          <div className="text-center pt-2">
            <button
              onClick={handleNextQuestion}
              className="rounded-lg bg-cyan-500 px-6 py-2 sm:px-8 sm:py-3 cursor-pointer font-bold text-white hover:bg-cyan-600 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
