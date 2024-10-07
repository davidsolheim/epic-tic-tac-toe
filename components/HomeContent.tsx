'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Moon, Sun, Users, Cpu, Grid, Trophy, Volume2, VolumeX } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState, ReactNode } from 'react';

// Animation variants
const container: Variants = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

interface LinkProps {
  href: string;
  text: string;
  variant: 'default' | 'secondary' | 'outline';
}

interface GameModeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  links: LinkProps[];
  item: Variants;
}

export default function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    // Add logic to enable/disable sound effects
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-5xl font-bold mb-8">Epic Tic Tac Toe</h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <GameModeCard
          title="Play vs Friend"
          description="Challenge a friend on the same device"
          icon={<Users className="w-8 h-8" />}
          links={[
            { href: "/game?mode=friend&size=3", text: "3x3", variant: "default" },
            { href: "/game?mode=friend&size=4", text: "4x4", variant: "secondary" },
            { href: "/game?mode=friend&size=5", text: "5x5", variant: "outline" },
          ]}
          item={item}
        />
        <GameModeCard
          title="Play vs AI"
          description="Test your skills against the computer"
          icon={<Cpu className="w-8 h-8" />}
          links={[
            { href: "/game?mode=ai&difficulty=easy&size=3", text: "Easy", variant: "default" },
            { href: "/game?mode=ai&difficulty=medium&size=3", text: "Medium", variant: "secondary" },
            { href: "/game?mode=ai&difficulty=hard&size=3", text: "Hard", variant: "outline" },
          ]}
          item={item}
        />
      </motion.div>
      <div className="mt-8 space-x-4">
        <Link href="/leaderboard">
          <Button variant="outline" className="w-48">
            <Trophy className="mr-2 h-4 w-4" /> Leaderboard
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12"
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}

function GameModeCard({ title, description, icon, links, item }: GameModeCardProps) {
  return (
    <motion.div variants={item}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <Button variant={link.variant} className="w-full">
                {link.text}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}