import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientAPI } from "../services/api";
import toast from "react-hot-toast";

const ClientForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clientType: "Individual",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await clientAPI.create(form);
      toast.success("Client created");
      navigate("/clients");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create client");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        max-w-2xl
        card
      "
    >
      <h2
        className="
          mb-4
          text-2xl font-bold
        "
      >
        Add Client
      </h2>
      <form
        onSubmit={handleSubmit}
        className="
          space-y-4
        "
      >
        <div>
          <label
            className="
              text-sm text-gray-600
            "
          >
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="
              w-full
              input-field
            "
          />
        </div>

        <div>
          <label
            className="
              text-sm text-gray-600
            "
          >
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="
              w-full
              input-field
            "
          />
        </div>

        <div>
          <label
            className="
              text-sm text-gray-600
            "
          >
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="
              w-full
              input-field
            "
          />
        </div>

        <div
          className="
            flex
            gap-4
          "
        >
          <div
            className="
              flex-1
            "
          >
            <label
              className="
                text-sm text-gray-600
              "
            >
              Type
            </label>
            <select
              name="clientType"
              value={form.clientType}
              onChange={handleChange}
              className="
                w-full
                input-field
              "
            >
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>

          <div
            className="
              w-40
            "
          >
            <label
              className="
                text-sm text-gray-600
              "
            >
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full
                input-field
              "
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
        </div>

        <div
          className="
            flex
            gap-2
          "
        >
          <button
            type="submit"
            disabled={loading}
            className="
              btn-primary
            "
          >
            {loading ? "Saving..." : "Save Client"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="
              btn-outline
            "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
