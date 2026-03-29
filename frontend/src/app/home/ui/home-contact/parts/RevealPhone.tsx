'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTS = ['+48', '517', '988', '760'];

export function RevealPhone() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 text-primary">
        <Phone className="w-5 h-5" />
        <p className="text-base font-medium">Telefon</p>
      </div>
      <div className="h-11 flex items-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="button"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="default"
                onClick={() => setRevealed(true)}
                className="gap-2.5 h-11 px-5 text-base border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:text-primary active:border-primary/60 active:bg-primary/5 active:text-primary transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Pokaż numer
              </Button>
            </motion.div>
          ) : (
            <motion.a
              key="phone"
              href={`tel:${PARTS.join('')}`}
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-xl font-semibold hover:text-primary active:text-primary transition-colors tracking-wide"
            >
              {PARTS.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < PARTS.length - 1 ? ' ' : ''}
                </span>
              ))}
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
