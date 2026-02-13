import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/MainLayout";
import Seo from "../../components/Seo";
import { BLOG_KEYWORDS, SITE_WIDE_KEYWORDS, joinKeywords } from "../../utils/seoKeywords";

const MAX_DESCRIPTION_LENGTH = 155;

function stripMarkdown(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\(([^)]*)\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMetaDescription(content: string, fallback: string): string {
  const clean = stripMarkdown(content);
  if (!clean && fallback) return fallback;
  if (!clean) return "Artigo do blog AutoGo.pt sobre importação de carros.";
  if (clean.length <= MAX_DESCRIPTION_LENGTH) return clean;
  const truncated = clean
    .slice(0, MAX_DESCRIPTION_LENGTH - 1)
    .replace(/[\s,.;:-]+$/g, "");
  return `${truncated}…`;
}

export default function BlogPost({ post }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  if (!post) return <div>Artigo não encontrado.</div>;

  // Detect a background image from the post content (first image, or a frontmatter field)
  const getBackgroundImage = (post) => {
    // Try frontmatter field first
    if (post.backgroundImage) return post.backgroundImage;
    // Otherwise, find the first image in the markdown content
    const match = post.content.match(/!\[.*?\]\((.*?)\)/);
    return match ? match[1] : null;
  };
  const backgroundImage = getBackgroundImage(post);
  const primaryImage = post.ogImage || backgroundImage;
  const metaImage = primaryImage
    ? primaryImage.startsWith("http")
      ? primaryImage
      : `https://autogo.pt${primaryImage}`
    : "https://autogo.pt/images/auto-logo.png";
  const metaDescription =
    post.metaDescription ||
    buildMetaDescription(
      `${post.title ? `${post.title}. ` : ""}${post.content || ""}`,
      post.title ? `${post.title} — Blog AutoGo.pt` : "Artigo do blog AutoGo.pt",
    );
  const keywords = joinKeywords(SITE_WIDE_KEYWORDS, BLOG_KEYWORDS, post.tags || []);
  const canonicalUrl = `https://autogo.pt/blog/${post.slug}`;

  // Blog post background image (if any) should not extend under the footer
  return (
    <Layout>
      <Seo
        title={`${post.title} | Blog AutoGo.pt`}
        description={metaDescription}
        url={canonicalUrl}
        image={metaImage}
        keywords={keywords}
        ogType="article"
      />
      {backgroundImage && (
        <div
          className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none"
          style={{
            bottom: "120px", // do not overlay footer
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
          }}
          aria-hidden="true"
          data-fullwidth
        >
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            priority
            className="object-cover"
            style={{
              filter: "blur(2px) brightness(0.85)",
              opacity: 0.35,
            }}
          />
        </div>
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
          <a href="/blog" className="text-[#d50032] underline underline-offset-4 hover:text-[#b42121]">
            ← {t("Voltar ao Blog")}
          </a>
        </Link>
        <div className="mt-4 mb-2 flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide shadow-sm ${post.type === "review" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
          >
            {post.type === "review" ? "Review" : "Notícia"}
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(post.date).toLocaleDateString("pt-PT")}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#1a237e] mb-2">{post.title}</h1>
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <article className="prose prose-lg max-w-none bg-white/80 rounded-xl p-6 shadow-md backdrop-blur-md text-black prose-headings:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_li]:text-[#1a237e] [&_li]:marker:text-[#1a237e] [&_blockquote]:text-[#1a237e] [&_strong]:text-[#0b2545] [&_b]:text-[#0b2545]">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
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

export async function getStaticProps({ params, locale }) {
  const blogDir = path.join(process.cwd(), "data/blog");
  const filePath = path.join(blogDir, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const fallbackTitle = data.title || params.slug;
  const metaDescription = buildMetaDescription(
    `${data.description ? `${data.description}. ` : ""}${content}`,
    fallbackTitle ? `${fallbackTitle} — Blog AutoGo.pt` : "Artigo do blog AutoGo.pt",
  );
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      post: {
        slug: params.slug,
        title: fallbackTitle,
        date: data.date || "",
        type: data.type || "news",
        tags: data.tags || [],
        lang: data.lang || "pt-PT",
        content,
        metaDescription,
        backgroundImage: data.backgroundImage || data.image || null,
        ogImage: data.ogImage || data.image || null,
      },
    },
  };
}
