export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

export interface ShoppingList {
  id: number;
  createdAt: string;
  items: ShoppingListItem[];
}
