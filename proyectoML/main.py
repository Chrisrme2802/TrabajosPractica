from fastapi import FastAPI
import pickle
import numpy as np

app = FastAPI()

# Cargamos el modelo
with open('modelo_casas.pck', 'rb') as f:
    modelo = pickle.load(f)

@app.get("/")
def root():
    return {"mensaje": "API de prediccion de casas"}

@app.post("/predecir")
def predecir(
    longitude: float,
    latitude: float,
    housing_median_age: float,
    total_rooms: float,
    total_bedrooms: float,
    population: float,
    households: float,
    median_income: float,
    ocean_proximity_encoded: int
):
    X = [[longitude, latitude, housing_median_age, total_rooms,
          total_bedrooms, population, households,
          median_income, ocean_proximity_encoded]]
    
    prediccion = modelo.predict(X)

    return {"precio_predicho": round(prediccion[0], 2)}