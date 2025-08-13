import { createFileRoute, Link, useRouterState } from '@tanstack/react-router';

export const Route = createFileRoute('/quiz/$quizId/results')({
  component: ResultsPage,
});

function ResultsPage() {
  const { quizId } = Route.useParams();

  // destructuring the state passed
  const { finalScore, totalQuestions } = useRouterState({
    select: (s) => s.location.state,
  });

  // safety check if user directly navigates to '/results'
  if (finalScore === undefined || totalQuestions === undefined) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl">No result to display!</h1>
        <Link to="/" className="text-cyan-400 hover:underline mt-4 block">
          Return Home
        </Link>
      </div>
    );
  }

  const percentage = Math.round((finalScore / totalQuestions) * 100);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl text-white font-bold">Quiz Complete!</h1>
        <div className="p-8 bg-gray-800/60 rounded-xl border border-gray-700">
          <p className="text-lg text-gray-400">Your Score</p>
          <p className="text-6xl font-bold text-cyan-400">
            {finalScore} / {totalQuestions}
          </p>
          <p className="text-2xl font-semibold mt-2 text-white">
            {percentage}%
          </p>
        </div>
        {/* buttons */}
        <div className="flex gap-4">
          <Link
            to="/quiz/$quizId"
            params={{ quizId }}
            className="flex-1 rounded-lg bg-cyan-600 py-3 font-bold text-white hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="flex-1 rounded-lg bg-gray-600 py-3 font-bold text-white hover:bg-gray-700 transition-colors"
          >
            New Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
