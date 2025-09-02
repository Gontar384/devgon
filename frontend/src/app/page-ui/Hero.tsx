import TypingEffect from '@/app/page-ui/TypingEffect';

interface Props {
  text: string;
}

export default function Hero({ text }: Props) {
  return (
    <h1 className="text-6xl font-bold whitespace-nowrap">
      <TypingEffect
        text={text}
        speed={300}
        deleteSpeed={100}
        pause={1000}
        mode="typing"
      />
    </h1>
  );
}
