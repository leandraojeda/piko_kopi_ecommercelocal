export default function ProductToolbar({
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
      
      {/* 🔍 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring"
      />

      {/* ⬇️ ORDEN */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="px-4 py-2 border rounded focus:outline-none"
      >
        <option value="">Ordenar por</option>
        <option value="price_asc">Más baratos</option>
        <option value="price_desc">Más caros</option>
        <option value="name_asc">A – Z</option>
        <option value="name_desc">Z – A</option>
      </select>
    </div>
  );
}
