import Head from "next/head";
import MainLayout from "../components/MainLayout";

export default function CookiePolicy() {
  return (
    <MainLayout>
      <Head>
        <title>Política de Cookies | Autogo</title>
        <meta name="description" content="Política de Cookies da Autogo" />
      </Head>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "2.5rem",
            marginBottom: "2.5rem",
            color: "#222",
               // Fix: Type assertion to access style property
               }}
               onClick={(e) => {
                 const target = e.currentTarget as HTMLElement;
                 target.style.background = "#f5f6fa";
               }}
        >
          Política de Cookies
        </h1>
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#e53e3e",
              marginBottom: "1.2rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontWeight: 900, marginRight: "0.5rem" }}>1.</span>O
            que são cookies?
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.15rem",
              lineHeight: 2,
              color: "#333",
              background: "#f8f8fa",
              borderRadius: "0.5rem",
              padding: "1.3rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              marginBottom: 0,
            }}
          >
            Cookies são pequenos ficheiros de texto que um site coloca no seu
            dispositivo (computador, smartphone ou tablet) quando o visita.
            Estes ficheiros permitem ao site recordar as suas ações e
            preferências (como o login, idioma ou outras definições), melhorando
            a sua experiência de navegação.
          </p>
        </section>
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#e53e3e",
              marginBottom: "1.2rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontWeight: 900, marginRight: "0.5rem" }}>2.</span>
            Para que utilizamos cookies?
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.15rem",
              lineHeight: 2,
              color: "#333",
              marginBottom: "1rem",
            }}
          >
            Usamos cookies para:
          </p>
          <ul
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
              lineHeight: 2,
              color: "#333",
              marginLeft: "1.5rem",
              marginBottom: 0,
            }}
          >
            <li>Garantir o funcionamento seguro e eficiente do website;</li>
            <li>Melhorar continuamente a experiência do utilizador;</li>
            <li>
              Analisar padrões de navegação, com o apoio do Google Analytics;
            </li>
            <li>Personalizar conteúdos, quando aplicável.</li>
          </ul>
        </section>
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#e53e3e",
              marginBottom: "1.2rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontWeight: 900, marginRight: "0.5rem" }}>3.</span>
            Cookies utilizados
          </h2>
          <div style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              a) Cookies estritamente necessários
            </h3>
            <p style={{ lineHeight: 2, marginBottom: "1.2rem" }}>
              Essenciais para o correto funcionamento do site. Estes cookies não
              recolhem informações pessoais e não requerem consentimento.
            </p>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              b) Cookies analíticos (Google Analytics)
            </h3>
            <p style={{ lineHeight: 2, marginBottom: "0.5rem" }}>
              O nosso website utiliza o Google Analytics, um serviço fornecido
              pela Google Inc., que permite analisar a forma como os
              utilizadores navegam no site. Recolhemos:
            </p>
            <ul style={{ lineHeight: 2, marginBottom: "0.5rem" }}>
              <li>Páginas visitadas;</li>
              <li>Tempo de permanência;</li>
              <li>Tipo de dispositivo e sistema operativo;</li>
              <li>Navegador utilizado;</li>
              <li>Região geográfica (aproximada).</li>
            </ul>
            <p style={{ lineHeight: 2, marginBottom: "1.2rem" }}>
              ⚠️ Estes dados são recolhidos de forma anonimizada e usados
              exclusivamente para fins estatísticos. A funcionalidade de
              anonimização de IP está ativada.
              <br />
              A Google poderá transferir estes dados para fora do EEE, mas fá-lo
              com base em cláusulas contratuais-tipo da Comissão Europeia.
              <br />
              Mais sobre a{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade da Google
              </a>
            </p>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              c) Cookies de funcionalidade
            </h3>
            <p style={{ lineHeight: 2, marginBottom: "1.2rem" }}>
              Permitem memorizar as preferências do utilizador (por exemplo:
              idioma ou região).
            </p>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              d) Cookies de terceiros
            </h3>
            <p style={{ lineHeight: 2, marginBottom: 0 }}>
              Poderão existir cookies de serviços integrados, como vídeos do
              YouTube ou mapas do Google Maps.
            </p>
          </div>
        </section>
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#e53e3e",
              marginBottom: "1.2rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontWeight: 900, marginRight: "0.5rem" }}>4.</span>
            Consentimento e gestão de cookies
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.15rem",
              lineHeight: 2,
              color: "#333",
              marginBottom: "1rem",
            }}
          >
            Quando entra no nosso site, é-lhe apresentado um banner de
            consentimento de cookies. Apenas os cookies estritamente necessários
            são ativados por defeito. Os restantes apenas serão utilizados com o
            seu consentimento.
            <br />
            Pode a qualquer momento:
          </p>
          <ul
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
              lineHeight: 2,
              color: "#333",
              marginLeft: "1.5rem",
              marginBottom: 0,
            }}
          >
            <li>
              Alterar ou retirar o consentimento clicando em “Gerir preferências
              de cookies” no rodapé do site;
            </li>
            <li>
              Configurar o seu navegador para bloquear ou eliminar cookies.
            </li>
          </ul>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
              lineHeight: 2,
              color: "#333",
              marginTop: "1.2rem",
            }}
          >
            Links úteis para gestão de cookies:
            <br />
            <a
              href="https://support.google.com/chrome/answer/95647?hl=pt-PT"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: "#b42121",
                textDecoration: "underline",
                textDecorationColor: "#b42121",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "600";
                  target.style.color = "#8b1a1a";
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "500";
                  target.style.color = "#b42121";
                }
              }}
            >
              Google Chrome
            </a>
            <br />
            <a
              href="https://support.mozilla.org/pt-PT/kb/ativar-desativar-cookies"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: "#b42121",
                textDecoration: "underline",
                textDecorationColor: "#b42121",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "600";
                  target.style.color = "#8b1a1a";
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "500";
                  target.style.color = "#b42121";
                }
              }}
            >
              Mozilla Firefox
            </a>
            <br />
            <a
              href="https://support.apple.com/pt-pt/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: "#b42121",
                textDecoration: "underline",
                textDecorationColor: "#b42121",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "600";
                  target.style.color = "#8b1a1a";
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "500";
                  target.style.color = "#b42121";
                }
              }}
            >
              Safari
            </a>
            <br />
            <a
              href="https://support.microsoft.com/pt-pt/help/4027947/microsoft-edge-delete-cookies"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 500,
                color: "#b42121",
                textDecoration: "underline",
                textDecorationColor: "#b42121",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "600";
                  target.style.color = "#8b1a1a";
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                  target.style.fontWeight = "500";
                  target.style.color = "#b42121";
                }
              }}
            >
              Microsoft Edge
            </a>
          </p>
        </section>
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#e53e3e",
              marginBottom: "1.2rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontWeight: 900, marginRight: "0.5rem" }}>5.</span>
            Alterações à Política de Cookies
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.15rem",
              lineHeight: 2,
              color: "#333",
              marginBottom: "1.2rem",
            }}
          >
            Reservamo-nos o direito de modificar esta política a qualquer
            momento. Recomendamos que consulte esta página regularmente.
          </p>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
              lineHeight: 2,
              color: "#333",
            }}
          >
            📅 Última atualização: 6 de agosto de 2025
            <br />
            📧 Contacto:{" "}
            <a href="mailto:autogo.stand@gmail.com">autogo.stand@gmail.com</a>
            <br />
            🏢 Responsável pelo Tratamento dos Dados: Linke.pt
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
