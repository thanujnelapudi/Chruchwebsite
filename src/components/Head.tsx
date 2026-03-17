import design from "../../config/design.json";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
}

export function Head({
  title,
  description = "A Spirit-filled church in Hyderabad dedicated to worship, prayer, and proclaiming God's Word.",
  image = "/images/og-default.jpg",
  url,
  noindex = false,
}: HeadProps) {
  const siteTitle = design.brand.name;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const canonicalUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  return (
    <>
      {/* Charset & viewport */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Primary meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/icons/favicon.png" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

      {/* Theme colour (matches primary brand blue) */}
      <meta name="theme-color" content={design.colors.primary} />

      {/* Fonts — self-hosted, no Google Fonts network request */}
      <style>{`
        @font-face {
          font-family: 'Playfair Display';
          src: local('Playfair Display');
          font-display: swap;
        }
        @font-face {
          font-family: 'Open Sans';
          src: local('Open Sans');
          font-display: swap;
        }
      `}</style>
    </>
  );
}
