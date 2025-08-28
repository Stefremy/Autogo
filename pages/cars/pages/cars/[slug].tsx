
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import cars from "../../data/cars.json";
import MainLayout from "../../components/MainLayout";

export default function CarPage({ car }: { car: any }) {
  if (!car) return <div>Carro não encontrado</div>;

  return (
    <MainLayout>
      <Head>
        <title>{`${car.make} ${car.model} ${car.year} | AutoGo.pt`}</title>
        <meta
          name="description"
          content={`Compre ${car.make} ${car.model} ${car.year} importado pela AutoGo.pt. Preço: €${car.price}.`}
        />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">
          {car.make} {car.model} {car.year}
        </h1>
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="mb-6"
        />
        <p className="text-lg mb-2">
          <strong>Preço:</strong> €{car.price}
        </p>
        <p className="text-lg mb-2">
          <strong>Transmissão:</strong> {car.transmission || "—"}
        </p>
        <p className="text-lg mb-2">
          <strong>País:</strong> {car.country || "—"}
        </p>
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: cars.map((car) => ({
      params: { slug: car.slug }, // usa o campo "slug" do JSON
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const car = cars.find((c) => c.slug === params?.slug);
  return {
    props: { car },
  };
};
