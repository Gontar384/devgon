import TypingEffect from '@/app/home/ui/TypingEffect';

export default function Hero() {
  return (
    <h1 className="text-6xl font-bold">
      <TypingEffect text="devgon" speed={400} pause={2000} />
    </h1>
  );
}
