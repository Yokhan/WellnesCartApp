import type { ShoppingList, ShoppingListItem } from '../../shared/types';

export interface ListSection {
  category: string;
  label: string;
  items: ShoppingListItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'meat': 'Мясо',
  'meat-ready': 'Готовое мясо / нарезка',
  'meat-processed': 'Колбасные изделия',
  'fish': 'Рыба',
  'eggs': 'Яйца',
  'dairy': 'Молочное',
  'grains': 'Крупы / каши',
  'bread': 'Хлеб',
  'fruit': 'Фрукты',
  'veg': 'Овощи',
  'spread': 'Намазки',
  'snack': 'Перекусы',
  'oil': 'Масло',
};

export function labelFor(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function groupByCategory(list: ShoppingList): ListSection[] {
  const map = new Map<string, ShoppingListItem[]>();
  for (const it of list.items) {
    const key = it.product.category;
    const arr = map.get(key) ?? [];
    arr.push(it);
    map.set(key, arr);
  }
  const sections: ListSection[] = [];
  for (const [category, items] of map) {
    sections.push({ category, label: labelFor(category), items });
  }
  sections.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  return sections;
}

export function countChecked(list: ShoppingList): { done: number; total: number } {
  return {
    done: list.items.filter((it) => it.checked).length,
    total: list.items.length,
  };
}
