// src/components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const DEFAULT = {
  title: "MyBlog — share ideas",
  description: "MyBlog — personal blog. Read articles about tech, life and more.",
  siteName: "MyBlog",
  twitterHandle: "@your_twitter",
  image: `${window.location.origin}/fallback.jpg`,
};

function SEO({
  title,
  description,
  image,
  url,
  canonical,
  robots = "index,follow",
  type = "article",
}) {
  const metaTitle = title ? `${title} | ${DEFAULT.siteName}` : DEFAULT.title;
  const metaDesc = description || DEFAULT.description;
  const metaImage = image || DEFAULT.image;
  const metaUrl = url || window.location.href;
  const canonicalUrl = canonical || metaUrl;

  return (
    <Helmet>
      <title>{metaTitle}</title>

      {/* Basic */}
      <meta name="description" content={metaDesc} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={DEFAULT.siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={DEFAULT.twitterHandle} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* Extra: mobile-friendly */}
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    </Helmet>
  );
}

export default SEO;
