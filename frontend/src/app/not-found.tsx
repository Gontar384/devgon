import { Frown } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen -mt-16">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="my-4 text-xl">Strona nie została znaleziona</p>
      <Frown className="!w-10 !h-10" />
    </section>
  );
}
