export interface BasketTemplateItem {
  universalProductId: string;
  quantity: number;
  quantityUnit: string;
}

export interface BasketTemplate {
  id: string;
  templateName: string;
  targetPersona: string;
  goalAlignment: string;
  weeklyBudgetRub: number;
  description: string;
  items: BasketTemplateItem[];
}
