// pages/viaturas/[slug].tsx
import Head from "next/head";
import type { GetServerSideProps } from "next";
import MainLayout from "../../components/MainLayout";
import cars from "../../data/cars.json";

type Car = {
  id: string | number;
  slug?: string;
  make: string;
  model: string;
  year: number;
  image: string;
  price: number;
  transmission?: string;
  country?: string;
  status?: string;
  [key: string]: any;
};

type Props = { car: Car | null };

export default function CarPage({ car }: Props) {
  if (!car) {
    return (
      <MainLayout title="Viatura não encontrada">
        <section className="max-w-3xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-semibold mb-4">Viatura não encontrada</h1>
          <p className="text-gray-600">
            Verifica o link ou volta para a lista de viaturas.
          </p>
        </section>
      </MainLayout>
    );
  }

  const title = `${car.make} ${car.model} ${car.year}`;
  const pricePT = Number(car.price).toLocaleString("pt-PT");

  return (
    <MainLayout title={title} description={`${title} à venda na AutoGo.`}>
      <Head>
        <meta name="description" content={`${title} à venda na AutoGo.`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={`${title} à venda na AutoGo.`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={car.image} />
      </Head>

      <section className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8">
        <div>
          {/* usa <img> para aceitar URL local ou externa sem config extra */}
          <img
            src={car.image}
            alt={title}
            className="w-full rounded-2xl shadow object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-[var(--text)]">
            {title}
          </h1>

          <p className="text-2xl font-bold mb-6 text-[var(--text)]">€ {pricePT}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <div className="text-sm text-gray-500">Ano</div>
              <div className="font-medium">{car.year}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Marca</div>
              <div className="font-medium">{car.make}</div>
            </div>
            {car.transmission && (
              <div>
                <div className="text-sm text-gray-500">Transmissão</div>
                <div className="font-medium">{car.transmission}</div>
              </div>
            )}
            {car.country && (
              <div>
                <div className="text-sm text-gray-500">País</div>
                <div className="font-medium">{car.country}</div>
              </div>
            )}
            {car.status && (
              <div>
                <div className="text-sm text-gray-500">Estado</div>
                <div className="font-medium">{car.status}</div>
              </div>
            )}
          </div>

          <a
            href="/viaturas"
            className="inline-flex items-center rounded-full px-5 py-3 text-white font-semibold
                     bg-gradient-to-r from-[#b42121] to-[#d55050]
                     hover:brightness-110 shadow-md"
          >
            ← Voltar às viaturas
          </a>
        </div>
      </section>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const slugParam = String((params?.slug as string) || "");

  const list = (cars as unknown as Car[]) || [];

  // 1º tenta por slug; 2º tenta por id (compatibilidade)
  const car =
    list.find((c) => String(c.slug ?? "") === slugParam) ||
    list.find((c) => String(c.id) === slugParam) ||
    null;

  return { props: { car } };
};
