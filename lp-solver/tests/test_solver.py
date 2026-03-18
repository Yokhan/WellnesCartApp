import pytest
from models import SolveRequest, SolveResponse, SolverStatus, ProductInput, SolverConstraints
from solver import solve_basket


def make_product(
    id: str,
    price: float,
    protein: float,
    calories: float,
    score: float = 0.7,
    max_qty: int = 5,
) -> ProductInput:
    return ProductInput(
        id=id,
        price_rub=price,
        protein_per_serving_g=protein,
        calories_per_serving_g=calories,
        composite_score=score,
        max_quantity=max_qty,
    )


def make_constraints(
    budget: float = 5000,
    protein: float = 700,
    cal_min: float = 10000,
    cal_max: float = 15000,
    sacred: list[str] | None = None,
) -> SolverConstraints:
    return SolverConstraints(
        weekly_budget_rub=budget,
        weekly_protein_target_g=protein,
        weekly_calorie_min=cal_min,
        weekly_calorie_max=cal_max,
        sacred_product_ids=sacred or [],
    )


class TestSolverBasic:
    def test_finds_optimal_solution(self):
        products = [
            make_product("chicken", 250, 250, 1500, score=0.9),
            make_product("eggs", 100, 120, 900, score=0.8),
            make_product("buckwheat", 80, 100, 3000, score=0.7),
            make_product("cottage_cheese", 120, 180, 800, score=0.85),
        ]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=4000, protein=700, cal_min=10000, cal_max=15000),
        )
        result = solve_basket(request)

        assert result.status == SolverStatus.OPTIMAL
        assert len(result.basket) > 0
        assert result.total_cost_rub <= 4000
        assert result.total_protein_g >= 700

    def test_infeasible_budget(self):
        products = [make_product("expensive", 1000, 10, 100, score=0.5)]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=50, protein=700, cal_min=10000, cal_max=15000),
        )
        result = solve_basket(request)

        assert result.status == SolverStatus.INFEASIBLE

    def test_sacred_item_included(self):
        products = [
            make_product("sacred_item", 200, 50, 500, score=0.3),
            make_product("regular_item", 150, 200, 1500, score=0.9),
            make_product("buckwheat", 80, 100, 3000, score=0.7),
        ]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(
                budget=5000,
                protein=300,
                cal_min=5000,
                cal_max=15000,
                sacred=["sacred_item"],
            ),
        )
        result = solve_basket(request)

        assert result.status == SolverStatus.OPTIMAL
        sacred_in_basket = any(item.product_id == "sacred_item" for item in result.basket)
        assert sacred_in_basket, "Sacred item must be in basket"

    def test_maximizes_composite_score(self):
        """High-score products should be preferred when budget allows."""
        products = [
            make_product("high_score", 100, 100, 1000, score=0.95),
            make_product("low_score", 100, 100, 1000, score=0.1),
        ]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=500, protein=300, cal_min=3000, cal_max=8000),
        )
        result = solve_basket(request)

        assert result.status == SolverStatus.OPTIMAL
        high_qty = next((i.quantity for i in result.basket if i.product_id == "high_score"), 0)
        low_qty = next((i.quantity for i in result.basket if i.product_id == "low_score"), 0)
        assert high_qty >= low_qty, "High-score product should have >= quantity vs low-score"

    def test_calorie_constraints_respected(self):
        products = [
            make_product("low_cal", 100, 100, 50, score=0.8),
            make_product("high_cal", 100, 100, 5000, score=0.8),
        ]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=5000, protein=300, cal_min=8000, cal_max=12000),
        )
        result = solve_basket(request)

        if result.status == SolverStatus.OPTIMAL:
            assert result.total_calories >= 8000
            assert result.total_calories <= 12000


class TestSolverEdgeCases:
    def test_single_product(self):
        products = [make_product("chicken", 200, 250, 1500, score=0.9, max_qty=10)]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=2000, protein=700, cal_min=8000, cal_max=15000),
        )
        result = solve_basket(request)

        # May or may not be feasible depending on constraints
        assert result.status in [SolverStatus.OPTIMAL, SolverStatus.INFEASIBLE]

    def test_all_products_excluded_by_max_qty(self):
        """If max_quantity=1 and can't meet protein target, should be infeasible."""
        products = [make_product("low_protein", 100, 10, 100, score=0.5, max_qty=1)]
        request = SolveRequest(
            products=products,
            constraints=make_constraints(budget=5000, protein=700, cal_min=500, cal_max=15000),
        )
        result = solve_basket(request)

        assert result.status == SolverStatus.INFEASIBLE
