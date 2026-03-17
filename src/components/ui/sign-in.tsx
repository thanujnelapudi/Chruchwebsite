/**
 * sign-in.tsx — auth stub.
 * Kept so any import of this component doesn't break during migration.
 */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SignInProps {
  title?: string;
  message?: string;
  className?: string;
  cardClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
}

export function SignIn({
  title = "Sign In Required",
  message = "Please sign in to access this content.",
  className = "min-h-screen flex items-center justify-center px-4",
  cardClassName = "w-fit max-w-xl mx-auto text-foreground",
}: SignInProps) {
  return (
    <div className={className}>
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="font-heading text-primary">{title}</CardTitle>
          <CardDescription className="font-paragraph">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-paragraph text-sm text-foreground/60">
            Authentication is not yet configured. Please contact the site administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
