"use client"

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";

interface SearchProps<T> {
  liste: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  onSelect?: (value: string, item?: T) => void;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Search<T>({
  liste,
  getLabel,
  getValue,
  onSelect,
  placeholder = "Rechercher...",
  value,
  onValueChange
}: SearchProps<T>) {

  // Convertir la liste en options pour Combobox
  const options = liste.map(item => ({
    label: getLabel(item),
    value: getValue(item),
    data: item
  }));

  const handleSelect = (selectedValue: string | null) => {
    if (selectedValue === null) return;

    const selectedItem = liste.find(item => getValue(item) === selectedValue);

    if (onSelect && selectedItem) {
      onSelect(selectedValue, selectedItem);
    }

    if (onValueChange) {
      onValueChange(selectedValue);
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Combobox items={options} value={value} onValueChange={handleSelect}>
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            className="min-w-62 justify-between font-normal bg-transparent w-full"
          >
            <ComboboxValue
              placeholder={placeholder}
            />
          </Button>
        }
      />
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder={placeholder} className="outline-none" />
        <ComboboxEmpty>Aucune option trouvée</ComboboxEmpty>
        <ComboboxList>
          {(option) => (
            <ComboboxItem key={option.value} value={option.value}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
