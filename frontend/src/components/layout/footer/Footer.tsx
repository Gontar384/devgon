import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="mt-12 p-6">
      <Card>
        <CardContent className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2025 MyApp. Wszystkie prawa zastrzeżone.
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">
              Facebook
            </Button>
            <Button variant="ghost" size="sm">
              Twitter
            </Button>
            <Button variant="ghost" size="sm">
              Instagram
            </Button>
          </div>
        </CardContent>
      </Card>
      <Separator className="my-4" />
      <div className="text-center text-xs text-muted-foreground">
        Made with ❤️ using Shadcn UI + Next.js
      </div>
    </footer>
  );
}
