// pages/blog/[slug].tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import Layout from "../../components/MainLayout";

const BASE_URL = "https://www.autogo.pt";

function firstImageFromMarkdown(md: string): string | null {
  // ![alt](url) — pega a 1ª ocorrência
  const m = md.match(/!\[[^\]]*]\(([^)]+)\)/);
  return m ? m[1] : null;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`[^`]*`/g, "") // inline code
    .replace(/!\[[^\]]*]\([^)]+\)/g, "") // images
    .replace(/\[[^\]]*]\([^)]+\)/g, "") // links
    .replace(/[#>*_~`>-]+/g, " ") // md syntax
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

function makeExcerpt(md: string, maxLen = 160): string {
  const txt = stripMarkdown(md);
  if (txt.length <= maxLen) return txt;
  const cut = txt.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default function BlogPost({ post }: { post: any }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  if (!post) return <div>Artigo não encontrado.</div>;

  // imagem de fundo suave (opcional)
  const backgroundImage = post.image || firstImageFromMarkdown(post.content) || null;

  const title = post.title || post.slug;
  const metaDescription = post.description || makeExcerpt(post.content, 160);
  const ogImage =
    post.image || firstImageFromMarkdown(post.content) || "/images/auto-logo.png";
  const canonical = `${BASE_URL}/blog/${post.slug}`;

  return (
    <Layout title={title} description={metaDescription} ogImage={ogImage}>
      <Head>
        {/* básicos */}
        <title>{title} | AutoGo.pt</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} | AutoGo.pt`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | AutoGo.pt`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      {backgroundImage && (
        <div
          className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px) brightness(0.85)",
            opacity: 0.35,
          }}
          aria-hidden="true"
          data-fullwidth
        />
      )}

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Link href="/blog" legacyBehavior>
          <a className="text-[#d50032] underline underline-offset-4 hover:text-[#b42121]">
            ← {t("Voltar ao Blog")}
          </a>
        </Link>

        <div className="mt-4 mb-2 flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide shadow-sm ${
              post.type === "review" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
            }`}
          >
            {post.type === "review" ? "Review" : "Notícia"}
          </span>
          {post.date && (
            <span className="text-gray-500 text-xs">
              {new Date(post.date).toLocaleDateString("pt-PT")}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-[#1a237e] mb-2">{title}</h1>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <article className="prose prose-lg max-w-none bg-white/80 rounded-xl p-6 shadow-md backdrop-blur-md">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
        </article>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), "data/blog");
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const paths = files.map((filename) => ({
    params: { slug: filename.replace(/\.md$/, "") },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params, locale }: { params: any; locale: string }) {
  const blogDir = path.join(process.cwd(), "data/blog");
  const filePath = path.join(blogDir, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const image =
    data.image || firstImageFromMarkdown(content) || "/images/auto-logo.png";
  const description = data.description || makeExcerpt(content, 160);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt-PT", ["common"])),
      post: {
        slug: params.slug,
        title: data.title || params.slug,
        date: data.date || "",
        type: data.type || "news",
        tags: data.tags || [],
        lang: data.lang || "pt-PT",
        image,
        description,
        content,
      },
    },
  };
}
