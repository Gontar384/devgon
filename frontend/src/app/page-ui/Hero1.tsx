import TypingEffect from '@/app/page-ui/TypingEffect';

interface Props {
  text: string;
}

export default function Hero1({ text }: Props) {
  return (
    <h2 className="text-2xl font-bold whitespace-nowrap">
      <TypingEffect text={text} mode="cursor" />
    </h2>
  );
}
