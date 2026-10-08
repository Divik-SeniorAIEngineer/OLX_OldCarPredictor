import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [options, setOptions] = useState({
    companies: [],
    car_models: [],
    years: [],
    fuel_types: [],
  });

  const [form, setForm] = useState({
    company: "",
    car_models: "",
    year: "",
    fuel_type: "",
    kilo_driven: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/options`);

        if (!response.ok) {
          throw new Error(`Options request failed: ${response.status}`);
        }

        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError(
          "Could not load car data. Make sure the FastAPI server is running on port 8000.",
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPrediction(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.company ||
      !form.car_models ||
      !form.year ||
      !form.fuel_type ||
      !form.kilo_driven
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: form.company,
          car_models: form.car_models,
          year: Number(form.year),
          fuel_type: form.fuel_type,
          kilo_driven: Number(form.kilo_driven),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed.");
      }

      setPrediction(data.predicted_price);
    } catch (err) {
      setError(err.message || "Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({
      company: "",
      car_models: "",
      year: "",
      fuel_type: "",
      kilo_driven: "",
    });
    setPrediction(null);
    setError("");
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <div className="badge">AI / MACHINE LEARNING</div>
          <h1>Used Car Price Predictor</h1>
          <p>
            Enter the car details below and get an estimated resale price
            powered by your trained Linear Regression model.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="card-header">
            <div>
              <h2>Car Details</h2>
              <p>Select the vehicle information used by the ML model.</p>
            </div>
          </div>

          {loadingOptions ? (
            <div className="status">Loading car data...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="company">Company</label>
                  <select
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  >
                    <option value="">Select Company</option>
                    {options.companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="car_models">Car Model</label>
                  <select
                    id="car_models"
                    name="car_models"
                    value={form.car_models}
                    onChange={handleChange}
                  >
                    <option value="">Select Car Model</option>
                    {options.car_models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    {options.years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="fuel_type">Fuel Type</label>
                  <select
                    id="fuel_type"
                    name="fuel_type"
                    value={form.fuel_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Fuel Type</option>
                    {options.fuel_types.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field full-width">
                  <label htmlFor="kilo_driven">Kilometers Driven</label>
                  <input
                    id="kilo_driven"
                    name="kilo_driven"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 45000"
                    value={form.kilo_driven}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>

                <button type="submit" className="primary" disabled={loading}>
                  {loading ? "Predicting..." : "Predict Price"}
                </button>
              </div>
            </form>
          )}
        </section>

        {prediction !== null && (
          <section className="result-card">
            <div className="result-label">Estimated Resale Price</div>
            <div className="price">
              ₹ {Number(prediction).toLocaleString("en-IN")}
            </div>
            <p>
              Prediction generated by the trained Linear Regression pipeline.
            </p>
          </section>
        )}

        <section className="info-card">
          <h3>How it works</h3>
          <div className="steps">
            <div>
              <span>01</span>
              <strong>Enter details</strong>
              <p>
                Choose the company, model, year, fuel and kilometers driven.
              </p>
            </div>
            <div>
              <span>02</span>
              <strong>Send to FastAPI</strong>
              <p>
                The React application sends the five model features to the API.
              </p>
            </div>
            <div>
              <span>03</span>
              <strong>Get prediction</strong>
              <p>The saved ML pipeline predicts the estimated car price.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>React + FastAPI + Scikit-learn</footer>
    </div>
  );
}

export default App;
