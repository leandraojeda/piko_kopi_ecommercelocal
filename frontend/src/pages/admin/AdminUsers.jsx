import { useEffect, useState } from "react";
import apiPrivate from "../../api/apiPrivate";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const closeModal = () =>
    setModal({ open: false, title: "", message: "", action: null });

  const loadUsers = async (search = "") => {
    setLoading(true);
    try {
      const res = await apiPrivate.get(
        `/admin/users${search ? `?q=${encodeURIComponent(search)}` : ""}`
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error?.response || error);
      alert(error?.response?.data?.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers("");
  }, []);

  const confirmBlock = (user) => {
    const active = user.isActive !== false; // ✅ undefined => true
    setModal({
      open: true,
      title: active ? "Bloquear usuario" : "Desbloquear usuario",
      message: `¿Seguro que deseas ${active ? "bloquear" : "desbloquear"} a ${
        user.name
      } ${user.lastname}?`,
      action: async () => {
        try {
          setBusy(true);
          await apiPrivate.patch(`/admin/users/${user.id}/block`, {
            isActive: !active,
          });
          closeModal();
          await loadUsers(q);
        } catch (error) {
          console.error("Error block:", error?.response || error);
          alert(error?.response?.data?.message || "No se pudo cambiar el estado");
        } finally {
          setBusy(false);
        }
      },
    });
  };

  const confirmRole = (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";

    setModal({
      open: true,
      title: "Cambiar rol",
      message: `¿Seguro que deseas cambiar el rol de ${user.name} ${user.lastname} a "${newRole}"?`,
      action: async () => {
        try {
          setBusy(true);
          await apiPrivate.patch(`/admin/users/${user.id}/role`, { role: newRole });
          closeModal();
          await loadUsers(q);
        } catch (error) {
          console.error("Error role:", error?.response || error);
          alert(error?.response?.data?.message || "No se pudo cambiar el rol");
        } finally {
          setBusy(false);
        }
      },
    });
  };

  if (loading) return <p className="text-gray-500">Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Usuarios registrados</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o email"
          className="border px-3 py-2 rounded w-72"
        />
        <button
          onClick={() => loadUsers(q)}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setQ("");
            loadUsers("");
          }}
          className="border px-4 py-2 rounded"
        >
          Limpiar
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => {
              const active = u.isActive !== false; // ✅
              return (
                <tr key={u.id} className="border-t">
                  <td className="p-3">
                    {u.name} {u.lastname}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{active ? "Activo" : "Bloqueado"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => confirmRole(u)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      {u.role === "admin" ? "Quitar admin" : "Hacer admin"}
                    </button>

                    <button
                      onClick={() => confirmBlock(u)}
                      className={`px-3 py-1 rounded text-white ${
                        active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {active ? "Bloquear" : "Desbloquear"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmText="Sí, confirmar"
        cancelText="Cancelar"
        loading={busy}
        onCancel={closeModal}
        onConfirm={() => modal.action?.()}
      />
    </div>
  );
}
