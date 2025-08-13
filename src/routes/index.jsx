import { createFileRoute, Link } from '@tanstack/react-router';
import { genreData } from '../utils/genreData';
export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="bg-neutral-950 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="space-y-8 md:space-y-12 max-w-6xl mx-auto">
        {/* === CORRECTED HEADER SECTION === */}
        <div className="text-center py-12 md:py-16 lg:py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
            The Quiz Zone
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Choose a category below to start your challenge.
          </p>
        </div>

        {/* Grid for Genre Cards - No changes needed here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {genreData.map((genre) => (
            <Link
              key={genre.id}
              to="/quiz/$genreId"
              params={{ genreId: genre.id }}
              className="block p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-cyan-500 hover:-translate-y-1 transform transition-all duration-300 ease-in-out cursor-pointer"
            >
              <h2 className="text-2xl font-bold text-gray-100">
                {genre.title}
              </h2>
              <p className="mt-2 text-gray-400 line-clamp-3">
                {genre.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
