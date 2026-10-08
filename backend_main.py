from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd

app = FastAPI(title="Car Price Prediction API")

# React/Vite runs on localhost:5173 during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pickle.load(open("LinearRegressionModel.pkl", "rb"))
car = pd.read_csv("cleaned_car.csv")


class PredictionRequest(BaseModel):
    company: str
    car_models: str
    year: int
    fuel_type: str
    kilo_driven: int


@app.get("/")
def root():
    return {"message": "Car Price Prediction API is running"}


@app.get("/api/options")
def options():
    return {
        "companies": sorted(car["company"].dropna().unique().tolist()),
        "car_models": sorted(car["name"].dropna().unique().tolist()),
        "years": sorted(
            [int(year) for year in car["year"].dropna().unique()],
            reverse=True,
        ),
        "fuel_types": sorted(car["fuel_type"].dropna().unique().tolist()),
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    input_data = pd.DataFrame(
        [[
            request.car_models,
            request.company,
            request.year,
            request.kilo_driven,
            request.fuel_type,
        ]],
        columns=[
            "name",
            "company",
            "year",
            "kms_driven",
            "fuel_type",
        ],
    )

    prediction = model.predict(input_data)

    return {
        "predicted_price": round(float(prediction[0]), 2)
    }
