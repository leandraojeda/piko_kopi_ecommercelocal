import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiAdmin from "../../api/apiAdmin";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";

  /* ================= STATES ================= */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [hasVariants, setHasVariants] = useState(false);

  const [isOffer, setIsOffer] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPack, setIsPack] = useState(false);

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  /* 🔥 CATEGORÍAS */
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    apiAdmin.get("/categories")
      .then(res => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (!isEdit) return;

    apiAdmin.get(`/admin/products/${id}`)
      .then(res => {
        const p = res.data;

        setName(p.name ?? "");
        setDescription(p.description ?? "");
        setBasePrice(p.basePrice ?? "");
        setOldPrice(p.oldPrice ?? "");
        setStock(p.stock ?? "");

        setHasVariants(Boolean(p.hasVariants));
        setIsOffer(Boolean(p.isOffer));
        setIsNew(Boolean(p.isNew));
        setIsPack(Boolean(p.isPack));

        setImages(p.ProductImages?.map(i => i.imageUrl) ?? []);
        setVariants(p.ProductVariants ?? []);

        // 👇 categorías seleccionadas
        setSelectedCategories(
          p.Categories?.map(c => c.id) ?? []
        );
      })
      .catch(() => alert("Error al cargar producto"));
  }, [id, isEdit]);

  /* ================= VARIANTS ================= */
  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "Tipo", value: "", price: "", stock: "" },
    ]);
  };

  const updateVariant = (i, field, value) => {
    const copy = [...variants];
    copy[i][field] = value;
    setVariants(copy);
  };

  const removeVariant = (i) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        basePrice,
        oldPrice: oldPrice || null,
        stock: hasVariants ? null : stock,
        hasVariants,
        images,
        variants: hasVariants ? variants : [],
        isOffer,
        isNew,
        isPack,
        categoryIds: selectedCategories, // 👈 CLAVE
      };

      if (isEdit) {
        await apiAdmin.put(`/admin/products/${id}`, payload);
      } else {
        await apiAdmin.post("/admin/products", payload);
      }

      navigate("/admin/products");
    } catch {
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">
          {isEdit ? "Editar producto" : "Nuevo producto"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ===== INFO BÁSICA ===== */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">Información básica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" value={name} onChange={setName} required />
              <Input label="Precio" type="number" value={basePrice} onChange={setBasePrice} required />
              <Input label="Precio anterior" type="number" value={oldPrice} onChange={setOldPrice} />
              {!hasVariants && (
                <Input label="Stock" type="number" value={stock} onChange={setStock} />
              )}
            </div>

            <Textarea label="Descripción" value={description} onChange={setDescription} />
          </section>

          {/* ===== CATEGORÍAS ===== */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Categorías</h2>

            <select
              multiple
              value={selectedCategories}
              onChange={(e) =>
                setSelectedCategories(
                  Array.from(e.target.selectedOptions).map(
                    opt => Number(opt.value)
                  )
                )
              }
              className="w-full border rounded-lg px-3 py-2 h-40"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500">
              Mantén presionado Ctrl / Cmd para seleccionar varias categorías
            </p>
          </section>

          {/* ===== FLAGS ===== */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Etiquetas</h2>

            <div className="flex flex-wrap gap-4">
              <Check label="Tiene variantes" checked={hasVariants} onChange={() => setHasVariants(!hasVariants)} />
              <Check label="Oferta" checked={isOffer} onChange={() => setIsOffer(!isOffer)} />
              <Check label="Nuevo" checked={isNew} onChange={() => setIsNew(!isNew)} />
              <Check label="Pack" checked={isPack} onChange={() => setIsPack(!isPack)} />
            </div>
          </section>

          {/* ===== IMÁGENES ===== */}
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Imágenes</h2>
            <Textarea
              placeholder="Una URL por línea"
              value={images.join("\n")}
              onChange={(v) => setImages(v.split("\n"))}
            />
          </section>

          {/* ===== VARIANTES ===== */}
          {hasVariants && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Variantes</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Añadir variante
                </button>
              </div>

              {variants.map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 border rounded-lg p-4"
                >
                  <Input value={v.name} onChange={(val) => updateVariant(i, "name", val)} placeholder="Nombre" />
                  <Input value={v.value} onChange={(val) => updateVariant(i, "value", val)} placeholder="Valor" />
                  <Input type="number" value={v.price} onChange={(val) => updateVariant(i, "price", val)} placeholder="Precio" />
                  <Input type="number" value={v.stock} onChange={(val) => updateVariant(i, "stock", val)} placeholder="Stock" />

                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-600 text-sm"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-5 py-2 border rounded"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              className="px-6 py-2 rounded bg-green-600 text-white font-semibold"
            >
              {loading ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== COMPONENTES UI ===== */
function Input({ label, value, onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
