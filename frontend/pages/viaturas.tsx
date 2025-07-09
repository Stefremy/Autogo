import MainLayout from '../components/MainLayout';
import cars from '../data/cars.json';
import Link from 'next/link'; // Add this at the top if not already imported

export default function Viaturas() {
  return (
    <MainLayout>
      <section className="w-full px-0 py-12 bg-[#f5f6fa]">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#b42121]">
          Viaturas Disponíveis
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-all duration-300 relative group border border-gray-100"
            >
              {/* Galeria dinâmica de imagens com efeito */}
              <div className="w-full h-44 mb-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#b42121]/60 scrollbar-track-gray-200 bg-transparent">
                {(car.images || [car.image]).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => {
                      const modal = document.getElementById(`modal-img-${car.id}-${idx}`);
                      if (modal) (modal as HTMLDialogElement).showModal();
                    }}
                  >
                    <img
                      src={img}
                      alt={`${car.make} ${car.model} foto ${idx + 1}`}
                      className="rounded-xl object-cover w-44 h-44 shadow transition-transform duration-300 group-hover:scale-105 hover:scale-125 cursor-pointer border-2 border-transparent hover:border-[#b42121] bg-white"
                      style={{ minWidth: '11rem' }}
                    />
                  </button>
                ))}
                {/* Modais para expandir imagens */}
                {(car.images || [car.image]).map((img, idx) => (
                  <dialog key={idx} id={`modal-img-${car.id}-${idx}`} className="backdrop:bg-black/70 rounded-xl p-0 border-none max-w-3xl w-full">
                    <div className="flex flex-col items-center">
                      <img src={img} alt="Foto expandida" className="max-h-[80vh] w-auto rounded-xl shadow-lg" />
                      <button onClick={e => (e.currentTarget.closest('dialog') as HTMLDialogElement)?.close()} className="mt-4 mb-2 px-6 py-2 bg-[#b42121] text-white rounded-full font-bold hover:bg-[#a11a1a] transition">Fechar</button>
                    </div>
                  </dialog>
                ))}
              </div>
              <span className="absolute top-3 left-3 bg-[#b42121] text-white px-4 py-1 rounded-full text-xs font-bold shadow">
                {car.country === "DE" ? "Importado da Alemanha" : car.country === "FR" ? "Importado de França" : "Nacional"}
              </span>
              <h2 className="text-xl font-bold mb-1 text-[#222]">
                {car.make} {car.model}
              </h2>
              <div className="text-gray-500 mb-1">
                {car.year} · {car.mileage} km
              </div>
              <div className="font-bold text-green-700 text-lg mb-3">
                €{car.price.toLocaleString()}
              </div>
              <div className="flex gap-2 w-full mt-4">
                {/* Remove Share and Download PDF buttons from car cards */}
                <Link
                  href={`/cars/${car.id}`}
                  className="bg-[#0055b8] hover:bg-[#003e8a] text-white rounded-full py-2 px-8 font-bold text-base shadow transition mt-4 text-center w-full"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
