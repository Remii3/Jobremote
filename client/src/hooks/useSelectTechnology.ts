import { useState } from "react";

export function useSelectTechnology() {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );

  function toggleTechnology(technology: string) {
    setSelectedTechnologies((prev) =>
      prev.includes(technology)
        ? prev.filter((item) => item !== technology)
        : [...prev, technology]
    );
  }

  function clearTechnologies() {
    setSelectedTechnologies([]);
  }

  return {
    selectedTechnologies,
    toggleTechnology,
    clearTechnologies,
  };
}
