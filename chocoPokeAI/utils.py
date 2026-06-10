#Import de librerias
import requests
import json
import os

def obtener_traduccion(nombre_ingles):
    if os.path.exists('data/traducciones.json'):
        with open('data/traducciones.json', 'r') as f:
            traducciones = json.load(f)
    else:
        traducciones = {}
    
    if nombre_ingles in traducciones:
        return traducciones[nombre_ingles]
    
    #    datos['names'] = {"language": {"name": "es"}, "name": "Terremoto"},
    response = requests.get(f'https://pokeapi.co/api/v2/move/{nombre_ingles.lower().replace(' ','-')}', headers={'Accept-Charset': 'utf-8'})

    if response.status_code != 200:
        return nombre_ingles
    
    datos = response.json()

    for nombre in datos['names']:
        if nombre['language']['name'] == 'es':
            traducciones[nombre_ingles] = nombre['name']
            traducciones[nombre['name']] = nombre['name']
            with open('data/traducciones.json', 'w', encoding='utf-8') as f:
                json.dump(traducciones, f, indent=2, ensure_ascii=False)
            return nombre['name']
    
    return nombre_ingles