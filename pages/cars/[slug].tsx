// pages/cars/[slug].tsx
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import MainLayout from "../../components/MainLayout";
import cars from "../../data/cars.json";

type Car = {
  id: string | number;
  slug: string;
  make: string;
  model: string;
  year: string | number;
  price: number;
  image: string;
  transmission?: string;
  country?: string;
  status?: string;
};

export default function CarPage({ car }: { car: Car | null }) {
  if (!car) return <div style={{ padding: 24 }}>Carro não encontrado</div>;

  return (
    <MainLayout>
      <Head>
        <title>{`${car.make} ${car.model} ${car.year} | AutoGo.pt`}</title>
        <meta
          name="description"
          content={`Compre ${car.make} ${car.model} ${car.year} importado pela AutoGo.pt. Preço: €${car.price}.`}
        />
        <meta property="og:title" content={`${car.make} ${car.model} ${car.year} | AutoGo.pt`} />
        <meta
          property="og:description"
          content={`Compre ${car.make} ${car.model} ${car.year} importado pela AutoGo.pt. Preço: €${car.price}.`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={car.image} />
        <meta property="og:url" content={`https://www.autogo.pt/cars/${car.slug}`} />

        {/* Dados estruturados (Product + Offer) */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${car.make} ${car.model} ${car.year}`,
              image: [car.image],
              brand: car.make,
              description: `${car.make} ${car.model}, ano ${car.year}, importado pela AutoGo.pt`,
              offers: {
                "@type": "Offer",
                priceCurrency: "EUR",
                price: car.price,
                availability: "https://schema.org/InStock",
                url: `https://www.autogo.pt/cars/${car.slug}`,
              },
            }),
          }}
        />
      </Head>

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {car.make} {car.model} {car.year}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {/* Trocar por next/image depois para performance */}
            <img
              src={car.image}
              alt={`${car.make} ${car.model}`}
              className="w-full h-auto rounded-xl shadow"
              loading="lazy"
            />
          </div>

          <div className="space-y-3 text-lg">
            <p>
              <strong>Preço:</strong>{" "}
              €{car.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p>
              <strong>Transmissão:</strong> {car.transmission || "—"}
            </p>
            <p>
              <strong>País:</strong> {car.country || "—"}
            </p>
            <p>
              <strong>Status:</strong> {car.status || "—"}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths =
    (cars as Car[])
      .filter((c) => !!c.slug)
      .map((car) => ({ params: { slug: car.slug } })) || [];
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug || "");
  const car = (cars as Car[]).find((c) => c.slug === slug) || null;
  return { props: { car } };
};
