import React from 'react';
import type {ListBoxItemProps, SelectProps} from 'react-aria-components';
import {
  Select,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components';

interface SelectDropdownProps<T extends object>
  extends Omit<SelectProps<T>, 'children'> {
  label?: string;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export const SelectDropdown = <T extends object>({
  label,
  children,
  items,
  ...props
}: SelectDropdownProps<T>) => {
  return (
    <Select {...props}>
      <Label className="font-averta-bold font-normal mb-2 block">{label}</Label>
      <Button className="flex justify-between appearance-none bg-transparent border-2 border-white border-opacity-20 rounded-full text-white text-base leading-6 outline-none w-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue">
        <SelectValue className="truncate" />
        <span className="pg__icon-font pg__icon-font__select-arrow" aria-hidden="true"></span>
      </Button>
      <Popover className="max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5">
        <ListBox
          className="outline-none p-1"
          items={items}
          selectionMode="single"
        >
          {children}
        </ListBox>
      </Popover>
    </Select>
  )
};

export const SelectOption = (props: ListBoxItemProps) => {
  return (
    <ListBoxItem
      {...props}
      className={({ isSelected }) =>
        `group flex items-center gap-2 cursor-default select-none py-2 px-4 outline-none rounded text-gray-900 focus:bg-blue focus:text-white ${isSelected && "bg-blue text-white"}`}
    />
  );
}