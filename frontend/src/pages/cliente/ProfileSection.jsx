import { useEffect, useRef, useState } from "react";

import api from "../../services/api";
import avatarCliente from "../../assets/imagenes/perfil-usuario-femenino.png";
import { useAuth } from "../../context/AuthContext";

export function ProfileSection({ profile, onLogout, onClose }) {
  const { updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState(profile);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });

  const fileInputRef = useRef(null);

  // Cargar el perfil desde el backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/users/me");

        const userData =
          response.data?.user ??
          response.data?.data ??
          response.data;

        setProfileData(userData);

        setFormData({
          name: userData?.name || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          address: userData?.address || "",
        });
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    loadProfile();
  }, []);

  // Cambios en los inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({
      name: profileData?.name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      address: profileData?.address || "",
    });

    setIsEditing(false);
  };

  // Subir nueva foto
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      // Subir imagen
      await api.post("/users/me/image", imageFormData);

      // Obtener perfil actualizado
      const response = await api.get("/users/me");

      const updatedUser =
        response.data?.user ??
        response.data?.data ??
        response.data;

      setProfileData(updatedUser);

      // Actualizar usuario global
      updateUser(updatedUser);

      console.log("Foto actualizada:", updatedUser);
    } catch (error) {
      console.error(
        "Error al subir la imagen:",
        error.response?.data || error.message,
      );
    }
  };

  // Guardar cambios del perfil
  const handleSaveChanges = async () => {
    try {
      const response = await api.patch("/users/me", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      const updatedUser =
        response.data?.user ??
        response.data?.data ??
        response.data;

      setProfileData(updatedUser);

      // Actualizar usuario global
      updateUser(updatedUser);

      setFormData({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
        address: updatedUser?.address || "",
      });

      setIsEditing(false);

      console.log("Perfil actualizado:", updatedUser);
    } catch (error) {
      console.error(
        "Error al actualizar el perfil:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo oscuro */}
      <button
        type="button"
        aria-label="Cerrar perfil"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40 backdrop-blur-sm"
      />

      {/* Panel lateral */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-6">
          <div>
            <p className="font-semibold text-[#1976FF]">
              Mi cuenta
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-[#0B1F3A]">
              Mi perfil
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Consultá y administrá tu información personal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 px-6 py-8">
          {/* Avatar */}
          <div className="flex flex-col items-center border-b border-slate-200 pb-8">
            <div className="relative">
              <img
                src={profileData?.imageUrl || avatarCliente}
                alt="Foto de perfil"
                onError={(event) => {
                  event.currentTarget.src = avatarCliente;
                }}
                className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover shadow-sm"
              />

              {/* Input oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Cámara */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 text-lg text-slate-500 transition hover:text-[#1976FF]"
                aria-label="Cambiar foto de perfil"
                title="Cambiar foto"
              >
                📷
              </button>
            </div>

            <h3 className="mt-4 text-center text-xl font-bold text-[#0B1F3A]">
              {profileData?.name || "Cliente UrbanFix"}
            </h3>

            <p className="mt-1 text-center text-sm font-medium text-[#1976FF]">
              Cliente
            </p>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-5 rounded-xl bg-[#1976FF] px-5 py-3 font-semibold text-white transition hover:bg-[#0f65e8]"
              >
                Editar perfil
              </button>
            )}
          </div>

          {/* Datos */}
          <div className="mt-8 space-y-5">
            {/* Nombre */}
            <div>
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-[#0B1F3A]"
              >
                Nombre completo
              </label>

              <input
                id="profile-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-[#0B1F3A]"
              >
                Email
              </label>

              <input
                id="profile-email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="profile-phone"
                className="text-sm font-semibold text-[#0B1F3A]"
              >
                Teléfono
              </label>

              <input
                id="profile-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Agregá tu teléfono"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Dirección */}
            <div>
              <label
                htmlFor="profile-address"
                className="text-sm font-semibold text-[#0B1F3A]"
              >
                Dirección
              </label>

              <input
                id="profile-address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Agregá tu dirección"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Botones */}
            {isEditing && (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="rounded-xl bg-[#1976FF] px-5 py-3 font-semibold text-white transition hover:bg-[#0f65e8]"
                >
                  Guardar cambios
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cerrar sesión */}
        <div className="border-t border-slate-200 p-6">
          <div className="rounded-2xl bg-[#0B1F3A] p-5 text-white">
            <p className="font-bold">
              ¿Querés cerrar sesión?
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Vas a tener que volver a iniciar sesión para acceder a tu cuenta.
            </p>

            <button
              type="button"
              onClick={onLogout}
              className="mt-4 w-full rounded-xl border border-white/30 px-5 py-3 font-semibold transition hover:bg-white hover:text-[#0B1F3A]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}