// Redirect page — /simulador → /simulador-isv (permanent)
import { GetServerSideProps } from "next";

export default function Simulador() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/simulador-isv",
      permanent: true,
    },
  };
};
