from pulp import (
    LpProblem, LpVariable, LpMaximize, LpInteger,
    lpSum, LpStatus, value, PULP_CBC_CMD
)
from models import SolveRequest, SolveResponse, BasketItem, SolverStatus
import logging

logger = logging.getLogger(__name__)


def solve_basket(request: SolveRequest) -> SolveResponse:
    """
    Solve the basket optimization ILP problem.
    Returns optimal product quantities given budget and nutritional constraints.

    Decision variables: x_i = quantity of product i (integer, >= 0, <= max_quantity)
    Objective: Maximize sum(composite_score_i * x_i)
    Constraints: budget, protein, calories (min/max), sacred items
    """
    prob = LpProblem("SmartCartBasket", LpMaximize)

    products = request.products
    constraints = request.constraints

    # Decision variables: integer quantities per product
    qty_vars = {
        p.id: LpVariable(f"qty_{i}", lowBound=0, upBound=p.max_quantity, cat=LpInteger)
        for i, p in enumerate(products)
    }

    # Objective: maximize weighted composite score
    prob += lpSum(
        p.composite_score * qty_vars[p.id]
        for p in products
    ), "TotalCompositeScore"

    # Budget constraint: sum(price_i * x_i) <= weekly_budget
    prob += lpSum(
        p.price_rub * qty_vars[p.id]
        for p in products
    ) <= constraints.weekly_budget_rub, "Budget"

    # Protein constraint: sum(protein_per_serving_i * x_i) >= weekly_protein_target
    prob += lpSum(
        p.protein_per_serving_g * qty_vars[p.id]
        for p in products
    ) >= constraints.weekly_protein_target_g, "MinProtein"

    # Calorie lower bound: sum(calories_per_serving_i * x_i) >= weekly_calorie_min
    prob += lpSum(
        p.calories_per_serving_g * qty_vars[p.id]
        for p in products
    ) >= constraints.weekly_calorie_min, "MinCalories"

    # Calorie upper bound: sum(calories_per_serving_i * x_i) <= weekly_calorie_max
    prob += lpSum(
        p.calories_per_serving_g * qty_vars[p.id]
        for p in products
    ) <= constraints.weekly_calorie_max, "MaxCalories"

    # Sacred items: x_i >= 1 for each sacred product ID
    sacred_ids = set(constraints.sacred_product_ids)
    for p in products:
        if p.id in sacred_ids:
            prob += qty_vars[p.id] >= 1, f"Sacred_{p.id}"

    # Solve — suppress CBC output, hard timeout of 30s
    solver = PULP_CBC_CMD(msg=0, timeLimit=30)
    prob.solve(solver)

    status_str = LpStatus[prob.status]
    logger.info(f"Solver status: {status_str}")

    if status_str != "Optimal":
        reason = _explain_infeasibility(constraints)
        solver_status = (
            SolverStatus.INFEASIBLE
            if "Infeasible" in status_str
            else SolverStatus.ERROR
        )
        return SolveResponse(
            status=solver_status,
            infeasibility_reason=reason,
        )

    # Extract results from solution
    basket: list[BasketItem] = []
    total_cost = 0.0
    total_protein = 0.0
    total_calories = 0.0
    product_map = {p.id: p for p in products}

    for pid, var in qty_vars.items():
        qty = int(round(value(var) or 0))
        if qty > 0:
            p = product_map[pid]
            basket.append(BasketItem(product_id=pid, quantity=qty))
            total_cost += p.price_rub * qty
            total_protein += p.protein_per_serving_g * qty
            total_calories += p.calories_per_serving_g * qty

    return SolveResponse(
        status=SolverStatus.OPTIMAL,
        basket=basket,
        total_cost_rub=round(total_cost, 2),
        total_protein_g=round(total_protein, 2),
        total_calories=round(total_calories, 2),
    )


def _explain_infeasibility(constraints: SolverConstraints) -> str:
    """Build a human-readable explanation for why the problem is infeasible."""
    reasons = []
    if constraints.weekly_protein_target_g > 0:
        reasons.append(
            f"невозможно набрать {constraints.weekly_protein_target_g:.0f}г белка"
        )
    if constraints.weekly_budget_rub < 500:
        reasons.append(f"бюджет {constraints.weekly_budget_rub:.0f}₽ слишком мал")
    return (
        "Не удалось составить корзину: " + "; ".join(reasons)
        if reasons
        else "Невозможно выполнить все ограничения одновременно"
    )
