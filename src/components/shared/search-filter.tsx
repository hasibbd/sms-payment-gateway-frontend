"use client";

import * as React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onResetFilters?: () => void;
  placeholder?: string;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  placeholder = "Search records...",
}: SearchFilterProps) {
  const hasActiveFilters =
    searchQuery.length > 0 || Object.values(activeFilters).some((v) => v && v !== "all");

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full my-4">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Select Filters */}
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[140px]">
          <select
            value={activeFilters[filter.key] || "all"}
            onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All {filter.label}s</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset button */}
      {hasActiveFilters && onResetFilters && (
        <Button variant="ghost" size="sm" onClick={onResetFilters} className="h-10 text-xs text-slate-500 gap-1">
          <X className="w-3.5 h-3.5" />
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
}
