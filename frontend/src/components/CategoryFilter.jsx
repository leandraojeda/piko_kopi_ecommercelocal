export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm border transition
          ${
            selectedCategory === null
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
      >
        Todas
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm border transition
            ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
