# Car Price Predictor — React and FastAPI

Regression model used for the car price prediction .

## Model inputs

The frontend sends the same five features used by the trained model:

- `name`
- `company`
- `year`
- `kms_driven`
- `fuel_type`

The notebook uses `OneHotEncoder` for `name`, `company`, and `fuel_type`, with the remaining numeric features passed through the preprocessing pipeline.

## 1. Start FastAPI

From the backend directory:

```bash
uvicorn main:app --reload
```

The API should run at:

```text
http://localhost:8000
```

## 2. Start React

```bash
npm install
npm run dev
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

## 3. API endpoints

### GET `/api/options`

Returns the dropdown values:

```json
{
  "companies": [],
  "car_models": [],
  "years": [],
  "fuel_types": []
}
```

### POST `/predict`

React sends:

```json
{
  "company": "Maruti",
  "car_models": "Maruti Suzuki Swift",
  "year": 2019,
  "fuel_type": "Petrol",
  "kilo_driven": 100
}
```

The API returns:

```json
{
  "predicted_price": 123456.78
}
```

## Environment variable

Copy `.env.example` to `.env` if you need a different backend URL:

```text
VITE_API_BASE_URL=http://localhost:8000
```

## Application Preview

### Car Price Predictor UI

![Used Car Price Predictor UI](images/car-price-predictor.png)

The application provides a React-based interface for entering the car company, model, year, fuel type, and kilometers driven, and displays the estimated resale price returned by the FastAPI machine-learning backend.
