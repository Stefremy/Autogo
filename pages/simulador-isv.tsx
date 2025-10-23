import { GetServerSideProps } from 'next';

export default function SimuladorIsvRedirect() {
  // This page permanently redirects to /simulador
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/simulador',
      permanent: true,
    },
  };
};
