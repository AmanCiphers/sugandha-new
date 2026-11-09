"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      if (data.addresses) setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(editingId ? "Address updated" : "Address added");
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      label: "Home",
      full_name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">My Addresses</h1>
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-border/40 p-6 bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editingId ? "Edit Address" : "Add Address"}</h2>
            <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Label</label>
              <Input placeholder="Home / Work" value={formData.label} onChange={(e) => updateField("label", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
              <Input required placeholder="John Doe" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
              <Input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Address Line 1</label>
              <Input required placeholder="123 Main Street" value={formData.line1} onChange={(e) => updateField("line1", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Address Line 2 (Optional)</label>
              <Input placeholder="Apartment, suite, etc." value={formData.line2} onChange={(e) => updateField("line2", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">City</label>
              <Input required placeholder="Mumbai" value={formData.city} onChange={(e) => updateField("city", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">State</label>
              <Input required placeholder="Maharashtra" value={formData.state} onChange={(e) => updateField("state", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Pincode</label>
              <Input required placeholder="400001" value={formData.pincode} onChange={(e) => updateField("pincode", e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_default" checked={formData.is_default} onChange={(e) => updateField("is_default", e.target.checked)} className="accent-foreground" />
              <label htmlFor="is_default" className="text-sm text-foreground">Set as default</label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" className="rounded-full" disabled={saving}>
                {saving ? "Saving..." : (editingId ? "Update" : "Add")}
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-24">
          <MapPin className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">No Addresses Saved</h1>
          <p className="mt-2 text-muted-foreground">Add an address for faster checkout.</p>
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Address
          </Button>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-lg border border-border/40 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{address.label}</h3>
                  {address.is_default && (
                    <Badge variant="secondary" className="text-[10px]">Default</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(address)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(address.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <p>{address.full_name}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}