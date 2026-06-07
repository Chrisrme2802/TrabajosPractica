#python scraper.py
#Import de librerias
from playwright.sync_api import sync_playwright
import json
#import requests
#from bs4 import BeautifulSoup

#Funcion pasar datos lineas a objeto
def parsear_pokemon(datosCrudos):
        return {
        'nombre': datosCrudos[0],
        'nivel': datosCrudos[1],
        'objeto': datosCrudos[3],
        'habilidad': datosCrudos[5],
        'naturaleza': datosCrudos[7],
        'movimientos': [datosCrudos[9], datosCrudos[10], datosCrudos[11], datosCrudos[12]],
        'stats': {
            'hp': int(datosCrudos[16]),
            'ataque': int(datosCrudos[18]),
            'defensa': int(datosCrudos[20]),
            'at_esp': int(datosCrudos[22]),
            'def_esp': int(datosCrudos[24]),
            'velocidad': int(datosCrudos[26])
        }
    }

# Funcion para extraer datos de una pagina
def scrape_trainer(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        page.wait_for_timeout(3000)

        #Sacamos datos
        page.click('text=Versión 3')
        page.wait_for_timeout(1000)

        #Entrenador
        h1s = page.query_selector_all('h1')
        nombre_entrenador = h1s[1].inner_text()
        
        #Pokemones
        pokemones = []  
        h3s = page.query_selector_all('h3')
        for h3 in h3s:
            if h3.is_visible():
                pokemon = {}
                #Nombre
                pokemon['nombre'] = h3.inner_text()
                #Datos
                tarjeta = h3.evaluate_handle('el => el.closest(".bg-card")')
                datosTarjeta = tarjeta.inner_text()
                datosCrudos = datosTarjeta.split('\n')
                pokemon ['datos'] = parsear_pokemon(datosCrudos)

                pokemones.append(pokemon)

        #Cerramos
        browser.close()

        return {
            "entrenador": nombre_entrenador,
            "pokemones": pokemones
        }

    #response = requests.get(url)
    #soup = BeautifulSoup(response.text, 'html.parser')

    #Extraemos nombre
    #nombre = soup.find('h1', class_='text-2xl font-bold').text.strip()
    #print(response.text[:3000])

    #Extraemos cada pokemon
    #pokemones = []
    #tarjetas = soup.find_all('h3')

    #for tarjeta in tarjetas:
    #    pokemon = {}
    #    pokemon['nombre'] = tarjeta.text.strip()
    #    pokemones.append(pokemon)

    #return {
    #    "entrenador": nombre,
    #    "pokemones": pokemones
    #}

#Prueba
datos = scrape_trainer('https://www.fakedex.es/anil/entrenadores/lider7-blaine')
print(json.dumps(datos, indent=2, ensure_ascii=False))