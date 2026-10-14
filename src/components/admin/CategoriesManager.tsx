"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, FolderTree, AlertCircle, Check } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  productCount: number;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          image,
          displayOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create category");
      } else {
        setCategories((prev) => [
          ...prev,
          { ...data.category, productCount: 0 },
        ]);
        setName("");
        setSlug("");
        setDescription("");
        setImage("");
        setShowAddForm(false);
      }
    } catch {
      setError("Network error while creating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
            Organize bakery treats into artisan collections.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B87D4B] hover:bg-[#9E6535] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Cancel" : "Add Category"}</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCce] shadow-xs space-y-4 max-w-2xl animate-fade-in"
        >
          <h3 className="font-serif text-lg font-bold text-[#211510]">
            Create New Category
          </h3>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Pastries & Tarts"
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
                placeholder="e.g. pastries-and-tarts"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] font-mono text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#211510]">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Freshly baked viennoiserie, fruit tarts, and croissants"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#211510]">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6DCce] bg-[#FAF7F2] text-xs sm:text-sm text-[#211510] focus:bg-white focus:border-[#B87D4B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#211510] hover:bg-[#B87D4B] text-white text-xs font-semibold transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Saving Category..." : "Save Category"}
          </button>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-6 border border-[#E6DCce] shadow-xs flex items-start gap-4"
          >
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#F4ECE1] border border-[#E6DCce]">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8E7C72]">
                  <FolderTree className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B87D4B]">
                Order: #{cat.displayOrder}
              </span>
              <h3 className="font-serif font-bold text-base text-[#211510] truncate mt-0.5">
                {cat.name}
              </h3>
              <p className="text-xs text-[#8E7C72] font-mono mt-0.5">
                /{cat.slug}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#6B5B52] border border-[#E6DCce] text-[11px] font-medium mt-2">
                {cat.productCount} treat{cat.productCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
