"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, AlertCircle, Star } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    basePrice: number;
    prepTime: string;
    availability: string;
    stock: number;
    isStockTracked: boolean;
    allergens?: string | null;
    ingredients?: string | null;
    isFeatured: boolean;
    categoryId: string;
    imageUrl?: string;
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [basePrice, setBasePrice] = useState(initialData?.basePrice?.toString() || "18");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || "4-6 hours notice");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [availability, setAvailability] = useState(initialData?.availability || "AVAILABLE");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "10");
  const [isStockTracked, setIsStockTracked] = useState(initialData?.isStockTracked || false);
  const [allergens, setAllergens] = useState(initialData?.allergens || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      categoryId,
      basePrice,
      prepTime,
      shortDescription,
      description,
      availability,
      stock,
      isStockTracked,
      allergens,
      ingredients,
      isFeatured,
      imageUrl,
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData!.id}`
        : `/api/admin/products`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product.");
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-[#E6DCce] hover:bg-[#FAF7F2] text-[#6B5B52] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#211510]">
              {isEditing ? `Edit: ${initialData?.name}` : "Create New Artisan Treat"}
            </h1>
            <p className="text-xs text-[#8E7C72]">
              Configure pricing in USD, preparation times, stock, and descriptions.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
          Core Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Belgian Dark Chocolate Cake"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. belgian-dark-chocolate-cake"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] font-mono text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Base Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="34"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Preparation Notice <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 24 hours notice"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#211510]">
            Short Description (Catalog excerpt)
          </label>
          <input
            type="text"
            placeholder="Brief 1-sentence summary"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#211510]">
            Full Detailed Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the texture, flavor profile, layers, and baking craft..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
        </div>
      </div>

      {/* Inventory & Availability */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
          Availability & Stock Tracking
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            >
              <option value="AVAILABLE">AVAILABLE (Immediate Intake)</option>
              <option value="MADE_TO_ORDER">MADE TO ORDER (Bake on Demand)</option>
              <option value="UNAVAILABLE">UNAVAILABLE (Hidden from Store)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Stock Tracking
            </label>
            <label className="flex items-center gap-2 pt-2.5 text-xs text-[#211510] cursor-pointer">
              <input
                type="checkbox"
                checked={isStockTracked}
                onChange={(e) => setIsStockTracked(e.target.checked)}
                className="w-4 h-4 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
              />
              <span>Track physical inventory count</span>
            </label>
          </div>

          {isStockTracked && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Current Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>
          )}
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#211510] cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#B87D4B] focus:ring-[#B87D4B] border-[#E6DCce]"
            />
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#B87D4B] fill-[#B87D4B]" />
              <span>Mark as Homepage Featured Artisan Favorite</span>
            </span>
          </label>
        </div>
      </div>

      {/* Photography & Ingredients */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-[#211510] border-b border-[#F0E9DF] pb-3">
          Photography & Artisan Details
        </h2>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#211510]">
            Primary Image URL
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
          />
          {imageUrl && (
            <div className="pt-2 flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E6DCce]">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] text-[#8E7C72]">Image Preview</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Allergen Notice
            </label>
            <input
              type="text"
              placeholder="e.g. Contains dairy, gluten, eggs."
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Key Ingredients
            </label>
            <input
              type="text"
              placeholder="e.g. Belgian Dark Chocolate, Pure Butter, Farm Eggs"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
