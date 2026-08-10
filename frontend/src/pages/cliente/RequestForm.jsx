import { useEffect, useState } from "react";

import api from "../../services/api";

const initialForm = {
  title: "",
  description: "",
  category: "",
  address: "",
  scheduledDate: "",
};

function getMinimumDate() {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  );

  return localDate.toISOString().slice(0, 16);
}

export function RequestForm({ selectedCategory, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (selectedCategory) {
      setFormData((currentData) => ({
        ...currentData,
        category: selectedCategory,
      }));
    }
  }, [selectedCategory]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        scheduledDate: new Date(
          formData.scheduledDate,
        ).toISOString(),
      };

      if (formData.address.trim()) {
        requestData.address = formData.address.trim();
      }

      const response = await api.post(
        "/solicitudes",
        requestData,
      );

      /*
       * Swagger no documenta la estructura de la respuesta.
       * Estas variantes permiten obtener el ID si el backend devuelve:
       * - la solicitud directamente;
       * - { solicitud: {...} };
       * - { data: {...} };
       * - { solicitudId: 1 }.
       */
      const createdRequest =
        response.data?.solicitud ??
        response.data?.data ??
        response.data;

      const createdId =
        createdRequest?.id ??
        response.data?.solicitudId;

      let successText = "Solicitud creada correctamente.";

      if (image) {
        if (createdId) {
          const imageData = new FormData();
          imageData.append("image", image);

          try {
            await api.post(
              `/solicitudes/${createdId}/imagen`,
              imageData,
            );
          } catch {
            successText =
              "La solicitud se creó, pero no se pudo subir la imagen.";
          }
        } else {
          successText =
            "La solicitud se creó, pero el backend no devolvió su ID y no se pudo adjuntar la imagen.";
        }
      }

      setFormData({
        ...initialForm,
        category: selectedCategory || "",
      });

      setImage(null);
      event.target.reset();

      setMessage({
        type: "success",
        text: successText,
      });

      if (onCreated) {
        await onCreated();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo crear la solicitud. Revisá los datos e intentá nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 space-y-6"
    >
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="text-sm font-semibold text-[#0B1F3A]"
          >
            Título del problema *
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej.: Fuga de agua en la cocina"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-[#0B1F3A]"
          >
            Tipo de servicio *
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Seleccioná una categoría</option>
            <option value="ELECTRICIDAD">Electricidad</option>
            <option value="PLOMERIA">Plomería</option>
            <option value="INFORMATICA">Informática</option>
            <option value="GASISTAS">Gasista</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-[#0B1F3A]"
        >
          Descripción *
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describí el problema con la mayor claridad posible."
          rows="5"
          required
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="address"
            className="text-sm font-semibold text-[#0B1F3A]"
          >
            Dirección del trabajo
          </label>

          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ej.: Av. Ameghino 1234"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            Si la dejás vacía, se utilizará la dirección de tu perfil.
          </p>
        </div>

        <div>
          <label
            htmlFor="scheduledDate"
            className="text-sm font-semibold text-[#0B1F3A]"
          >
            Fecha y horario *
          </label>

          <input
            id="scheduledDate"
            name="scheduledDate"
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={handleChange}
            min={getMinimumDate()}
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1976FF] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="requestImage"
          className="text-sm font-semibold text-[#0B1F3A]"
        >
          Fotografía del problema
        </label>

        <label
          htmlFor="requestImage"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-blue-300 hover:bg-blue-50"
        >
          <span className="text-3xl">📷</span>

          <span className="mt-2 font-semibold text-[#0B1F3A]">
            {image ? image.name : "Seleccionar una fotografía"}
          </span>

          <span className="mt-1 text-xs text-slate-500">
            La imagen es opcional
          </span>
        </label>

        <input
          id="requestImage"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => {
            setFormData({
              ...initialForm,
              category: selectedCategory || "",
            });
            setImage(null);
            setMessage(null);
          }}
          disabled={loading}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Limpiar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#1976FF] px-7 py-3 font-semibold text-white shadow-md transition hover:bg-[#0f65e8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enviando solicitud..." : "Crear solicitud"}
        </button>
      </div>
    </form>
  );
}