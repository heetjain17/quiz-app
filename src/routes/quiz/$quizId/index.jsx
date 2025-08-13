import { createFileRoute, Link } from '@tanstack/react-router';
import { genreData } from '../../../utils/genreData';
import { ChevronLeft, Loader2, TriangleAlert } from 'lucide-react';

function LoadingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-cyan-500" />
    </div>
  );
}

function ErrorComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-950">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-red-500/30 bg-gray-800/60 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <TriangleAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">An Error Occurred</h1>
        <p className="text-gray-400">
          We couldn't load the quiz data. Please check your internet connection
          and try again.
        </p>
        <Link
          to="/"
          className="!mt-6 inline-block rounded-lg bg-cyan-500 px-6 py-2 font-semibold text-white hover:bg-cyan-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/quiz/$quizId/')({
  loader: async ({ params }) => {
    // getting params id
    const { quizId } = params;

    // getting genreInfo from the given id
    const genreInfo = genreData.find((g) => g.id === quizId);

    if (!genreInfo) {
      return { genreInfo: null, questionCount: 0 };
    }

    // getting questions from json file
    const questionsModule = await import(`../../../data/${quizId}.json`);
    const questionCount = questionsModule.default.length;

    return { genreInfo, questionCount };
  },
  pendingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  component: QuizIntroPage,
});

function QuizIntroPage() {
  // useLoaderData() gives us the data from our loader function
  const { genreInfo, questionCount } = Route.useLoaderData();
  const { quizId } = Route.useParams();

  if (!genreInfo) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl text-red-500">Quiz Not Found!</h1>
        <Link to="/" className="text-cyan-400 hover:underline mt-4 block">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-neutral-950 justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-gray-800/60 border border-gray-700 rounded-2xl p-8 text-center shadow-2xl">
        {/* Back Link */}
        <Link
          to="/"
          className="text-base flex gap-2 justify-center items-center text-gray-400 hover:text-white transition-colors absolute top-6 left-6"
        >
          <ChevronLeft /> Home
        </Link>

        {/* Main Card */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
            {genreInfo.title}
          </h1>

          <p className="text-gray-300 text-base">{genreInfo.description}</p>

          {/* Metadata Section */}
          <div className="flex justify-center divide-x divide-gray-600 rounded-lg border border-gray-700 bg-gray-900/50">
            <div className="flex-1 p-4">
              <p className="text-xl font-bold text-white">{questionCount}</p>
              <p className="text-sm text-gray-400">Questions</p>
            </div>
            <div className="flex-1 p-4">
              <p className="text-xl font-bold text-white">30s</p>
              <p className="text-sm text-gray-400">Per Question</p>
            </div>
          </div>

          {/* Start Button */}
          <Link
            to="/quiz/$quizId/questions"
            params={{ quizId }}
            className="block w-full bg-cyan-500 text-white font-bold text-xl py-4 px-8 rounded-lg hover:bg-cyan-600 transition-colors transform hover:scale-102 duration-300"
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
