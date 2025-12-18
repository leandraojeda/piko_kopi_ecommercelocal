import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiPublic from "../../api/apiPublic";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiPublic.post("/auth/login", form);

      const user = res.data.user;

      // guardar token y usuario
      localStorage.setItem("user_token", res.data.token);
      localStorage.setItem("user_data", JSON.stringify(user));

      // 🔥 REDIRECCIÓN SEGÚN ROL
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (error) {
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-pink-600 font-semibold">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
