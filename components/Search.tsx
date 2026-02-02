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

export interface ListeItem {
  code: string;
  value: string;
  label: string;
  continent: string;
}

interface SearchProps {
  liste: ListeItem[];
  onSelect?: (value: string, item?: ListeItem) => void;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Search({
  liste,
  onSelect,
  placeholder = "Rechercher une église...",
  value,
  onValueChange
}: SearchProps) {

  // Convertir la liste en format options pour Combobox
  const options = liste.map(item => ({
    label: item.label,
    value: item.value,
    data: item
  }));

  // Trouver l'option sélectionnée
  const selectedOption = options.find(opt => opt.value === value);

  // Gérer la sélection
  const handleSelect = (selectedValue: string) => {
    const selectedItem = liste.find(item => item.value === selectedValue);

    if (onSelect && selectedItem) {
      onSelect(selectedValue, selectedItem);
    }

    if (onValueChange) {
      onValueChange(selectedValue);
    }
  };

  return (
    <>
      {/* <Combobox
        items={options}
        value={value}
        onValueChange={handleSelect}
      >
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="min-w-62 justify-between font-normal bg-transparent w-full"
            >
              <ComboboxValue
                placeholder={placeholder}
                renderValue={(selected) => {
                  if (!selected) return placeholder;
                  return selected.label || selected.value;
                }}
              />
            </Button>
          }
        />
        <ComboboxContent>
          <ComboboxInput
            showTrigger={false}
            placeholder={placeholder}
            className="outline-none"
          />
          <ComboboxEmpty>Aucune église trouvée</ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem
                key={option.data.code}
                value={option.value}
              >
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox> */}
    </>
  );
}
