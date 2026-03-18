from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from models import SolveRequest, SolveResponse
from solver import solve_basket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SmartCart LP Solver",
    description="ILP basket optimization microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://backend:3001"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "lp-solver"}


@app.post("/solve", response_model=SolveResponse)
async def solve(request: SolveRequest) -> SolveResponse:
    start = time.time()
    try:
        result = solve_basket(request)
        elapsed = time.time() - start
        logger.info(
            f"Solved in {elapsed:.3f}s — status={result.status}, "
            f"items={len(result.basket)}, cost={result.total_cost_rub:.2f}₽"
        )
        return result
    except Exception as e:
        logger.error(f"Solver error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Solver error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
