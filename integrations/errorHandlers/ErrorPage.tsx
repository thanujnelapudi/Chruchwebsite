import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string } | null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="font-heading text-4xl text-primary">!</span>
        </div>
        <h1 className="font-heading text-4xl text-primary mb-4">Page Not Found</h1>
        <p className="font-paragraph text-lg text-foreground/70 mb-8">
          {error?.statusText ?? error?.message ?? "Sorry, something went wrong."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-primary text-white font-paragraph px-8 py-4 hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
