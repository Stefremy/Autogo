import React, { useEffect, useState } from "react";

const STORAGE_KEY = "autogo_black_friday_dismiss_v1";
const HIDE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export default function BlackFridayPromo() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ts && Date.now() - parsed.ts < HIDE_TTL) {
          setVisible(false);
          return;
        }
      }
    } catch {}
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null; // avoid SSR/client mismatch

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
    } catch {}
    setVisible(false);
  }

  return (
    <React.Fragment>
      <div
        aria-hidden={!visible}
        className={`fixed z-50 right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-500 ease-out ${
          visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ maxWidth: 520 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex items-stretch w-[20rem] sm:w-[28rem] md:w-[38rem] lg:w-[44rem]">
          {/* Image: much larger visual on desktop, full-width stacked on mobile */}
          <div className="flex-shrink-0 w-44 h-72 sm:w-48 sm:h-80 md:w-56 md:h-96 lg:w-64 lg:h-[28rem] overflow-hidden bg-gray-100">
            <img
              src="/images/black-friday.png"
              alt="Black Friday AutoGo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between relative text-left">
            <div>
              <div className="text-base sm:text-lg font-semibold text-[#111827]">Black Friday </div>
              <p className="text-sm sm:text-sm text-gray-600 mt-4">Ofertas especiais:</p>
              <p className="text-sm sm:text-sm text-gray-600 mt-2">Viaturas selecionadas:</p>
              <p className="text-sm sm:text-sm text-gray-600 mt-2">Só esta semana:</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => dismiss()}
                className="inline-block bg-[#b42121] text-white font-semibold px-4 py-2 rounded-full text-sm shadow-md hover:scale-[1.03] transition-transform"
              >
                Contactar
              </button>

              <a
                href="/viaturas"
                className="inline-block bg-white border border-gray-200 text-[#b42121] font-semibold px-3 py-2 rounded-full text-sm shadow-sm hover:shadow-md transition"
              >
                Ver Viaturas
              </a>
            </div>

            <button
              aria-label="Fechar promoção Black Friday"
              onClick={() => dismiss()}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 520px) {
          div[aria-hidden] {
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            width: calc(100% - 2rem) !important;
            max-width: calc(100% - 2rem) !important;
            transform: translateX(0) !important;
          }
          .bg-white.rounded-2xl {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .flex-shrink-0 {
            width: 100% !important;
            height: 200px !important;
          }
          .p-3 {
            padding: 1rem !important;
          }
        }
      `}</style>
    </React.Fragment>
  );
}
