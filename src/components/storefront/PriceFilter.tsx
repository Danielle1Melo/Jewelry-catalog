"use client";

import { useCallback } from "react";

interface PriceFilterProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function PriceFilter({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceFilterProps) {
  const range = max - min;
  const safeRange = range > 0 ? range : 1;
  const leftPercent = range > 0 ? ((minValue - min) / safeRange) * 100 : 0;
  const rightPercent = range > 0 ? ((max - maxValue) / safeRange) * 100 : 0;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), maxValue - 1);
      onMinChange(value);
    },
    [maxValue, onMinChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), minValue + 1);
      onMaxChange(value);
    },
    [minValue, onMaxChange]
  );

  return (
    <div className="max-w-xs">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-title">Preço</span>
        <span className="text-sm text-description">
          {minValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          {" — "}
          {maxValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>

      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-gray-200" />

        <div
          className="absolute top-0 h-full rounded-full bg-tiffany"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          aria-label="Preço mínimo"
          onChange={handleMinChange}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-tiffany [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tiffany [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          aria-label="Preço máximo"
          onChange={handleMaxChange}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-tiffany [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tiffany [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
    </div>
  );
}
