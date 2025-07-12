// src/components/SEO.tsx
"use client";
import Head from "next/head";
import { usePathname } from "next/navigation";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

export default function SEO({ title, description, image }: SEOProps) {
  const path = usePathname();
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}${path}`;

  const fullTitle = `${title} | Deep Thoughts`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || ""} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
