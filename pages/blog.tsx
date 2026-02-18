import fs from "fs";
import path from "path";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "../components/MainLayout";
import Seo from "../components/Seo";
import { BLOG_KEYWORDS, SITE_WIDE_KEYWORDS, SEO_KEYWORDS, joinKeywords } from "../utils/seoKeywords";

export default function Blog({ posts }) {
  const categoryLinks = [
    {
      href: "/blog/categoria/noticias",
      label: "Notícias",
      description: "Atualizações do mercado automóvel importado e fiscalidade ISV.",
    },
    {
      href: "/blog/categoria/reviews",
      label: "Reviews",
      description: "Testes e análises detalhadas dos modelos europeus disponíveis na AutoGo.pt.",
    },
  ];
  return (
    <Layout>
      <Seo
        title={SEO_KEYWORDS.blog.title ?? 'Blog AutoGo.pt'}
        description={SEO_KEYWORDS.blog.description ?? ''}
        url="https://autogo.pt/blog"
        keywords={joinKeywords(SEO_KEYWORDS.blog.keywords ?? [], SITE_WIDE_KEYWORDS, BLOG_KEYWORDS)}
      />
      {/* Premium red underline accent fixed below navbar, expands on scroll and can go edge to edge */}
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
    var maxScroll = Math.max(footerTop - window.innerHeight, 1); // progress=1 when bottom of viewport reaches footer
    var progress = clamp(scrollY / maxScroll, 0, 1);
    var minW = 16 * 16; // 16rem
    var maxW = window.innerWidth; // allow edge-to-edge
    var newW = lerp(minW, maxW, progress);
    el.style.width = newW + 'px';
    // Fade out as we approach the footer
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
          src="/images/japans-car-magazines.webp"
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
          {/* Removido título e subtítulo do blog conforme solicitado */}
          <section className="mt-4 mb-10">
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#b42121] font-semibold">
              Categorias em destaque
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {categoryLinks.map((category) => (
                <Link key={category.href} href={category.href} legacyBehavior>
                  <a href={category.href} className="group block rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#d50032]">
                    <span className="text-lg font-semibold text-[#1a237e] group-hover:underline">
                      {category.label}
                    </span>
                    <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                    <span className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-[#d50032]">
                      Ver artigos →
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          </section>
          <div className="mt-8 space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} legacyBehavior>
                <a href={`/blog/${post.slug}`} className="block rounded-xl bg-white/70 backdrop-blur-md shadow-lg border border-gray-200 hover:shadow-xl transition p-6 group focus:outline-none focus:ring-2 focus:ring-[#d50032]">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide shadow-sm ${post.type === "review" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                    >
                      {post.type === "review" ? "Review" : "Notícia"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(post.date).toLocaleDateString("pt-PT")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a237e] group-hover:underline underline-offset-4 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const blogDir = path.join(process.cwd(), "data/blog");
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((filename) => {
      const filePath = path.join(blogDir, filename);
      const slug = filename.replace(/\.md$/, "");
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        type: data.type || "news",
        tags: data.tags || [],
        lang: data.lang || "pt-PT",
        excerpt:
          data.description ||
          data.excerpt ||
          content
            .split("\n")
            .slice(0, 3)
            .join(" ")
            .replace(/[#*]/g, "")
            .slice(0, 180) + "...",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      posts,
    },
  };
}
