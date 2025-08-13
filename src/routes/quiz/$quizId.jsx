import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/quiz/$quizId')({
  component: () => (
    <div className="bg-neutral-950">
      <Outlet />
    </div>
  ),
});
