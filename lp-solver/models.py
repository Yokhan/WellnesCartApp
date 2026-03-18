from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class SolverStatus(str, Enum):
    OPTIMAL = "optimal"
    INFEASIBLE = "infeasible"
    UNBOUNDED = "unbounded"
    ERROR = "error"


class ProductInput(BaseModel):
    id: str
    price_rub: float = Field(gt=0, description="Price per unit in rubles")
    protein_per_serving_g: float = Field(ge=0, description="Grams of protein per serving unit")
    calories_per_serving_g: float = Field(ge=0, description="Calories per serving unit")
    composite_score: float = Field(ge=0, le=1, description="Composite score 0-1")
    max_quantity: int = Field(default=5, ge=1, le=20)


class SolverConstraints(BaseModel):
    weekly_budget_rub: float = Field(gt=0)
    weekly_protein_target_g: float = Field(ge=0)
    weekly_calorie_min: float = Field(ge=0)
    weekly_calorie_max: float = Field(ge=0)
    sacred_product_ids: list[str] = Field(default_factory=list)


class SolveRequest(BaseModel):
    products: list[ProductInput] = Field(min_length=1)
    constraints: SolverConstraints


class BasketItem(BaseModel):
    product_id: str
    quantity: int


class SolveResponse(BaseModel):
    status: SolverStatus
    basket: list[BasketItem] = Field(default_factory=list)
    total_cost_rub: float = 0.0
    total_protein_g: float = 0.0
    total_calories: float = 0.0
    infeasibility_reason: Optional[str] = None
