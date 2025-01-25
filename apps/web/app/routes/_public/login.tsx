import { Button } from '@munchy/ui/components/ui/button';
import { Card, CardContent } from '@munchy/ui/components/ui/card';
import { Separator } from '@munchy/ui/components/ui/separator';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { cx } from 'class-variance-authority';
import { toast } from 'sonner';
import { authClient } from '~/utils/auth-client';
import { dashboardLinkOptions } from '~/utils/link-options';
import { type SocialProvider, socialProviders } from '~/utils/social-provider';

export const Route = createFileRoute('/_public/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect(dashboardLinkOptions);
    }
  },
  component: LoginPage,
});

export function LoginPage() {
  const router = useRouter();

  const handleSocialSignIn = async (provider: SocialProvider['id']) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/',
      });
      router.invalidate();
    } catch (_error) {
      toast.error('Failed to sign in');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <h1 className="font-bold text-4xl tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Choose your preferred sign in method
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {socialProviders.map((socialProvider) => (
              <Button
                key={socialProvider.id}
                variant="outline"
                onClick={() => handleSocialSignIn(socialProvider.id)}
                style={{
                  ['--social-bg' as string]: socialProvider.backgroundColor,
                }}
                className={cx(
                  'w-full items-center justify-center gap-2 border',
                  'bg-[var(--social-bg)] hover:bg-[var(--social-bg)] focus-visible:ring-[var(--social-bg)]',
                  'brightness-100 hover:brightness-90',
                  socialProvider.id === 'google' && 'focus-visible:ring-ring'
                )}
              >
                <socialProvider.icon
                  size={socialProvider.size}
                  color={socialProvider.logoColor}
                />
                <span style={{ color: socialProvider.textColor }}>
                  {socialProvider.name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
