export interface Ingredient {
    index: number;
    name: string;
    quantity_children: number;
    quantity_adults: number | string; // Some values in JSON might be strings or dates incorrectly, handling loosely for now or strictly if cleaned
    unit: string;
}

export interface Servings {
    children: number;
    adults: number;
}

export interface Recipe {
    sheet: string;
    code: number;
    name: string;
    group: string;
    category: string;
    ingredients: Ingredient[];
    servings: Servings;
    method: string[];
    plating: string[];
    nutrition_notes: string[];
    safety_criteria: string[];
    id: string;
    slug: string;
}
