import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React from 'react';

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

// export function Footer() {
//   return (
//     <footer className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
//
//       <div className="flex flex-col items-start gap-2">
//         <div className="text-sm text-muted-foreground">
//           © 2025 devgon
//           <Image
//             src="/logo/logo_black.svg"
//             alt="Logo devgon"
//             width={40}
//             height={42}
//             priority
//           />
//         </div>
//         <div className="text-sm text-muted-foreground">
//           Wszystkie prawa zastrzeżone
//         </div>
//       </div>
//
//       <Card className="w-full bg-background rounded-none p-6">
//         <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
//           {/* Linki regulamin/polityka */}
//           <div className="flex flex-col md:flex-row gap-4 text-sm mt-4 md:mt-0">
//             <Link href="/regulamin" className="hover:underline">
//               Regulamin
//             </Link>
//             <Link href="/polityka-prywatnosci" className="hover:underline">
//               Polityka Prywatności
//             </Link>
//           </div>
//
//           {/* Social Media */}
//           <div className="flex gap-3 mt-4 md:mt-0">
//             <Button variant="ghost" size="icon" asChild>
//               <a href="https://facebook.com" target="_blank" rel="noreferrer">
//                 <Facebook className="w-5 h-5" />
//               </a>
//             </Button>
//             <Button variant="ghost" size="icon" asChild>
//               <a href="https://twitter.com" target="_blank" rel="noreferrer">
//                 <Twitter className="w-5 h-5" />
//               </a>
//             </Button>
//             <Button variant="ghost" size="icon" asChild>
//               <a href="https://instagram.com" target="_blank" rel="noreferrer">
//                 <Instagram className="w-5 h-5" />
//               </a>
//             </Button>
//             <Button variant="ghost" size="icon" asChild>
//               <a href="https://linkedin.com" target="_blank" rel="noreferrer">
//                 <Linkedin className="w-5 h-5" />
//               </a>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//
//       <div className="flex justify-center text-xs text-muted-foreground gap-1.5">
//         <span>Made with pleasure by</span>
//         <span className="font-bold">devgon</span>
//       </div>
//     </footer>
//   );
// }
