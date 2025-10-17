import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "../../../components/MainLayout";
import Seo from "../../../components/Seo";
import { BLOG_KEYWORDS, SITE_WIDE_KEYWORDS, joinKeywords } from "../../../utils/seoKeywords";

const CATEGORY_DETAILS: Record<string, {
  type: string;
  label: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  keywords: string[];
}> = {
  noticias: {
    type: "news",
    label: "Notícias",
    seoTitle: "Notícias AutoGo.pt — Atualizações sobre importação de carros",
    seoDescription:
      "Acompanhe as últimas notícias e tendências do mercado automóvel europeu com a equipa AutoGo.pt.",
    intro:
      "Acompanhe as novidades sobre importação de carros, tendências do mercado europeu e atualizações fiscais que impactam a compra da sua próxima viatura.",
    keywords: ["noticias carros importados", "mercado automovel europa", "tendencias automoveis"],
  },
  reviews: {
    type: "review",
    label: "Reviews",
    seoTitle: "Reviews AutoGo.pt — Testes e análises de carros importados",
    seoDescription:
      "Análises imparciais e impressões detalhadas dos melhores carros importados disponíveis através da AutoGo.pt.",
    intro:
      "Conheça em detalhe as reviews de modelos importados que testamos e avaliamos para ajudar na escolha da sua próxima viatura.",
    keywords: ["reviews carros importados", "analises automoveis", "testes carros europa"],
  },
};

interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  type: string;
  tags: string[];
  excerpt: string;
}

interface BlogCategoryPageProps {
  posts: BlogPostSummary[];
  categoryKey: string;
}

export default function BlogCategoryPage({ posts, categoryKey }: BlogCategoryPageProps) {
  const { t } = useTranslation("common");
  const category = CATEGORY_DETAILS[categoryKey];

  if (!category) {
    return null;
  }

  const keywords = joinKeywords(
    SITE_WIDE_KEYWORDS,
    BLOG_KEYWORDS,
    category.keywords,
  );

  const canonicalUrl = `https://autogo.pt/blog/categoria/${categoryKey}`;

  return (
    <Layout>
      <Seo
        title={category.seoTitle}
        description={category.seoDescription}
        url={canonicalUrl}
        keywords={keywords}
      />
      <div
        id="hero-redline"
        className="fixed top-[64px] left-0 w-full z-40 pointer-events-none"
        style={{ height: "0" }}
      >
        <div id="hero-redline-bar" className="w-full flex justify-center">
          <span
            id="hero-redline-span"
            className="block h-1.5 rounded-full bg-gradient-to-r from-[#b42121] via-[#d50032] to-[#b42121] opacity-90 shadow-[0_0_16px_4px_rgba(213,0,50,0.18)] animate-pulse transition-all duration-700"
            style={{ width: "16rem", margin: "0 auto" }}
          />
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }
  function onScroll() {
    var el = document.getElementById('hero-redline-span');
    var bar = document.getElementById('hero-redline-bar');
    var footer = document.querySelector('footer');
    if (!el || !bar || !footer) return;
    var scrollY = window.scrollY;
    var footerTop = footer.getBoundingClientRect().top + window.scrollY;
    var maxScroll = Math.max(footerTop - window.innerHeight, 1);
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16;
    var maxW = window.innerWidth;
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
    var fadeStart = 0.98;
    var fadeProgress = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
    el.style.opacity = 0.9 - 0.6 * fadeProgress;
    el.style.marginLeft = el.style.marginRight = 'auto';
  }
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  setTimeout(onScroll, 100);
})();
`,
        }}
      />
      <div className="min-h-screen w-full flex flex-col overflow-x-hidden relative">
        <img
          src="/images/japans-car-magazines.jpg"
          alt="Fundo Blog"
          className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-60 z-0 transition-all duration-700"
          style={{ objectPosition: "center top", filter: "blur(0.5px)" }}
        />
        <div
          className="pointer-events-none select-none fixed inset-0 w-screen h-screen z-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(245,246,250,0.80) 0%, rgba(251,233,233,0.65) 60%, rgba(245,246,250,0.80) 100%)",
          }}
        />
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
          <h1 className="mt-6 text-3xl font-bold text-[#1a237e]">{category.label} AutoGo.pt</h1>
          <p className="mt-2 text-gray-700 max-w-2xl">{category.intro}</p>

          {posts.length === 0 ? (
            <p className="mt-8 text-gray-600">
              Ainda não existem artigos publicados nesta categoria. Volte em breve para mais novidades.
            </p>
          ) : (
            <div className="mt-10 space-y-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} legacyBehavior>
                  <a href={`/blog/${post.slug}`} className="block rounded-xl bg-white/70 backdrop-blur-md shadow-lg border border-gray-200 hover:shadow-xl transition p-6 group focus:outline-none focus:ring-2 focus:ring-[#d50032]">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide shadow-sm ${
                          post.type === "review" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.type === "review" ? "Review" : "Notícia"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {post.date ? new Date(post.date).toLocaleDateString("pt-PT") : ""}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a237e] group-hover:underline underline-offset-4 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

function mapTypeToCategory(type?: string): string | null {
  if (!type) return null;
  const normalized = type.toLowerCase();
  const entry = Object.entries(CATEGORY_DETAILS).find(([, value]) => value.type === normalized);
  return entry ? entry[0] : null;
}

export async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), "data/blog");
  if (!fs.existsSync(blogDir)) {
    return { paths: [], fallback: false };
  }
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const categories = new Set<string>();
  files.forEach((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    const categoryKey = mapTypeToCategory(data?.type);
    if (categoryKey && CATEGORY_DETAILS[categoryKey]) {
      categories.add(categoryKey);
    }
  });

  const paths = Array.from(categories).map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
  const categoryParam = Array.isArray(params?.category) ? params?.category[0] : params?.category;
  const categoryKey = categoryParam as string | undefined;
  if (!categoryKey || !CATEGORY_DETAILS[categoryKey]) {
    return { notFound: true };
  }

  const blogDir = path.join(process.cwd(), "data/blog");
  if (!fs.existsSync(blogDir)) {
    return { notFound: true };
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((filename) => {
      const filePath = path.join(blogDir, filename);
      const slug = filename.replace(/\.md$/, "");
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      return {
        slug,
        title: data?.title || slug,
        date: data?.date || "",
        type: data?.type || "news",
        tags: data?.tags || [],
        excerpt:
          content
            .split("\n")
            .slice(0, 3)
            .join(" ")
            .replace(/[#*]/g, "")
            .slice(0, 180) + "...",
      } as BlogPostSummary;
    })
    .filter((post) => mapTypeToCategory(post.type) === categoryKey)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      posts,
      categoryKey,
    },
  };
}
