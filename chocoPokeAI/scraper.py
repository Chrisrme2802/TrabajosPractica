#python scraper.py
import json
#Import de modulos
from parsers import parsear_pokemon, parsear_movimiento, parsear_showdown
from scrapers import scrape_trainer

#Prueba
datos = scrape_trainer('https://www.fakedex.es/anil/entrenadores/lider7-blaine')
with open(f'data/{datos["entrenador"].lower()}.json', 'w', encoding='utf-8') as f:
    json.dump(datos, f, indent=2, ensure_ascii=False)
    
print(json.dumps(datos, indent=2, ensure_ascii=False))

datosShowdown = parsear_showdown('showdown.txt', 'chris')
with open(f'data/{datos["entrenador"].lower()}.json', 'w', encoding='utf-8') as f:
    json.dump(datos, f, indent=2, ensure_ascii=False)
    
print(json.dumps(datos, indent=2, ensure_ascii=False))