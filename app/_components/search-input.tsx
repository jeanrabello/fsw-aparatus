"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  Scissors,
  User,
  Sparkles,
  Hand,
  Eye,
  Footprints,
  Zap,
  Droplets,
  LucideIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface QuickSearchOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const QUICK_SEARCH_OPTIONS: QuickSearchOption[] = [
  { label: "Cabelo", value: "cabelo", icon: Scissors },
  { label: "Barba", value: "barba", icon: User },
  { label: "Acabamento", value: "acabamento", icon: Sparkles },
  { label: "Massagem", value: "massagem", icon: Hand },
  { label: "Sobrancelha", value: "sobrancelha", icon: Eye },
  { label: "Pézinho", value: "pézinho", icon: Footprints },
  { label: "Progressiva", value: "progressiva", icon: Zap },
  { label: "Hidratação", value: "hidratação", icon: Droplets },
];

const SearchInput = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/barbershops?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleQuickSearch = (value: string) => {
    router.push(`/barbershops?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Pesquise serviços ou barbearias"
          className="border-border rounded-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type="submit" variant="default" size="icon" className="rounded-full">
          <SearchIcon />
        </Button>
      </form>

      <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {QUICK_SEARCH_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              className="flex items-center gap-3 rounded-full whitespace-nowrap"
              onClick={() => handleQuickSearch(option.value)}
            >
              <Icon className="size-4" />
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInput;
