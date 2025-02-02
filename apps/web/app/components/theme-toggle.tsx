import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

import { Button } from '@munchy/ui/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  const { setTheme, theme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <LuSun className="dark:-rotate-90 h-6 w-6 rotate-0 scale-100 transition-all dark:scale-0" />
      <LuMoon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
