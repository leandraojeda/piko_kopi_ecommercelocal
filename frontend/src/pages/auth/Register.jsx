import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiPublic from "../../api/apiPublic";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* ===============================
         1️⃣ REGISTRO
      =============================== */
      const registerRes = await apiPublic.post("/auth/register", form);

      /**
       * OPCIÓN A (RECOMENDADA)
       * Si el backend ya devuelve token + user
       */
      if (registerRes.data?.token && registerRes.data?.user) {
        localStorage.setItem("user_token", registerRes.data.token);
        localStorage.setItem(
          "user_data",
          JSON.stringify(registerRes.data.user)
        );

        navigate("/");
        return;
      }

      /**
       * OPCIÓN B (SEGURA)
       * Si el backend NO devuelve token en register
       * → login automático
       */
      const loginRes = await apiPublic.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("user_token", loginRes.data.token);
      localStorage.setItem(
        "user_data",
        JSON.stringify(loginRes.data.user)
      );

      navigate("/");
    } catch (err) {
      console.error("REGISTER ERROR 👉", err.response?.data);
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">
          Crear cuenta
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Regístrate para continuar
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
              required
            />

            <input
              type="text"
              placeholder="Apellido"
              value={form.lastname}
              onChange={(e) =>
                setForm({ ...form, lastname: e.target.value })
              }
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Celular"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Ciudad"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
          />

          <button
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold transition"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-pink-600 font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
