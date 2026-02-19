import React from 'react';
import { useTranslation } from 'next-i18next';
import { FaSearch, FaTachometerAlt } from 'react-icons/fa';

interface ViaturasFilterProps {
    marca: string;
    setMarca: (v: string) => void;
    modelo: string;
    setModelo: (v: string) => void;
    minPrice: string;
    setMinPrice: (v: string) => void;
    maxPrice: string;
    setMaxPrice: (v: string) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    dia: string;
    setDia: (v: string) => void;
    mes: string;
    setMes: (v: string) => void;
    ano: string;
    setAno: (v: string) => void;
    km: string;
    setKm: (v: string) => void;
    marcas: string[];
    modelos: string[];
    meses: number[];
    dias: number[];
    anos: number[];
    onClearFilters: () => void;
}

function ViaturasFilterBar(props: ViaturasFilterProps) {
    const { t } = useTranslation('common');
    const {
        marca, setMarca,
        modelo, setModelo,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        searchQuery, setSearchQuery,
        dia, setDia,
        mes, setMes,
        ano, setAno,
        km, setKm,
        marcas, modelos, meses, dias, anos,
        onClearFilters
    } = props;

    return (
        <div
            id="filtros-viaturas"
            className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center mb-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#b42121]/10 transition-all duration-300 hover:shadow-2xl"
            style={{ color: "#000" }}
        >
            {/* Marca Select */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <img
                    src="/images/icons/reshot-icon-car-.svg"
                    alt="Car"
                    className="inline-block"
                    style={{ width: "1.125rem", height: "1.125rem" }}
                />
                <select
                    value={marca}
                    onChange={(e) => {
                        setMarca(e.target.value);
                        setModelo("");
                    }}
                    className="bg-transparent outline-none border-none text-base text-black"
                >
                    <option value="">{t("Marca")}</option>
                    {marcas.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Modelo and Price Inputs */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <select
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={!marca}
                    aria-disabled={!marca}
                    title={!marca ? 'Selecione uma marca primeiro' : undefined}
                    className={`bg-transparent outline-none border-none text-base text-black w-32 ${!marca ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    <option value="">{t("Modelo")}</option>
                    {marca && modelos.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <div className="flex items-center gap-2 ml-2">
                    <input
                        type="number"
                        min="0"
                        step="100"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min €"
                        className="bg-transparent outline-none border-none text-sm text-black w-20 px-2 py-1 rounded text-right"
                        aria-label="Preço mínimo"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                        type="number"
                        min="0"
                        step="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max €"
                        className="bg-transparent outline-none border-none text-sm text-black w-20 px-2 py-1 rounded text-right"
                        aria-label="Preço máximo"
                    />
                </div>
            </div>

            {/* Global Search Input */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <img
                    src="/images/icons/reshot-icon.svg"
                    alt="Pesquisar"
                    className="inline-block"
                    style={{ width: "1.125rem", height: "1.125rem" }}
                />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar: marca, modelo..."
                    className="bg-transparent outline-none border-none text-sm text-black w-64"
                    aria-label="Pesquisar viaturas"
                />
            </div>

            {/* Date Selectors */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <img
                    src="/images/icons/reshot-icon-calendar-ZEQ49LUW6B.svg"
                    alt="Calendário"
                    className="inline-block"
                    style={{ width: "1.125rem", height: "1.125rem" }}
                />
                <select
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    className="bg-transparent outline-none border-none text-base text-black w-16"
                >
                    <option value="">{t("Dia")}</option>
                    {dias.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
                <select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="bg-transparent outline-none border-none text-base text-black w-20"
                >
                    <option value="">{t("Mês")}</option>
                    {meses.map((m) => (
                        <option key={m} value={m.toString().padStart(2, "0")}>
                            {m.toString().padStart(2, "0")}
                        </option>
                    ))}
                </select>
                <select
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="bg-transparent outline-none border-none text-base text-black w-24"
                >
                    <option value="">{t("Ano")}</option>
                    {anos.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>

            {/* KM Input */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow border border-[#b42121]/10 focus-within:ring-2 focus-within:ring-[#b42121]/30 transition-all">
                <FaTachometerAlt className="text-black text-lg" />
                <input
                    type="number"
                    min="0"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder={t("Máx. KM")}
                    className="bg-transparent outline-none border-none text-base text-black w-24"
                />
            </div>

            {/* Action Buttons */}
            <button
                className="flex items-center gap-2 rounded-xl px-6 py-2 font-bold shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#b42121]/60 focus:ring-offset-2 border-0 bg-[rgba(213,80,80,0.85)] hover:bg-[rgba(213,80,80,1)] active:bg-[rgba(180,33,33,1)] text-white"
            >
                <FaSearch />
                {t("Filtrar")}
            </button>

            <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-2 bg-white border border-[#b42121]/30 text-[#b42121] rounded-xl px-6 py-2 font-bold shadow transition-colors duration-200 hover:bg-[#b42121] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b42121]/30 focus:ring-offset-2"
            >
                {t("Limpar Filtros")}
            </button>
        </div>
    );
}

export default React.memo(ViaturasFilterBar);
