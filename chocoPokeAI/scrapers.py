#Import de librerias
from playwright.sync_api import sync_playwright
import os
import json
#Import de modulos
from parsers import parsear_pokemon, parsear_movimiento, parsear_stats_base
from utils import obtener_traduccion

#Funcion para extraer datos de movimiento
def scrape_movement(page, movimiento):
    if os.path.exists('data/movimientos.json'):
        with open('data/movimientos.json', 'r', encoding='utf-8') as f:
            movimientos = json.load(f)
    else:
        movimientos = {}

    if movimiento in movimientos:
        return movimientos[movimiento]
    
    page.goto('https://www.fakedex.es/anil/movimientos')
    page.wait_for_timeout(2000)
    
    #Asi me refiero al id de algo html
    page.fill('#search', movimiento)
    page.press('#search', 'Enter')
    page.wait_for_timeout(1000)

    tarjetas = page.query_selector_all('[data-slot="card"]')
    for tarjeta in tarjetas:
        if tarjeta.is_visible():
            texto = tarjeta.inner_text()
            if texto.split('\n')[0] == movimiento:
                movimientoProcesado = parsear_movimiento(texto)
                movimientos[movimiento] = movimientoProcesado
                with open('data/movimientos.json', 'w', encoding='utf-8') as f:
                    json.dump(movimientos, f, indent=2, ensure_ascii=False)
                return movimientoProcesado
            
    nombre_es = obtener_traduccion(movimiento)
    if nombre_es != movimiento:
        resultado = scrape_movement(page, nombre_es)
        if resultado:
            movimientos[movimiento] = resultado
            with open('data/movimientos.json', 'w', encoding='utf-8') as f:
                    json.dump(movimientos, f, indent=2, ensure_ascii=False)
            return resultado
        
    return None

#Funcion para extraer datos de pokemon
def scrape_pokemon(page, pokemon):
    if os.path.exists('data/pokemons.json'):
        with open('data/pokemons.json', 'r', encoding='utf-8') as f:
            pokemons = json.load(f)
    else:
        pokemons = {}
    if pokemon in pokemons:
        return pokemons[pokemon]
    
    page.goto(f'https://www.fakedex.es/anil/pokemon/{pokemon.lower()}')
    page.wait_for_timeout(2000)

    tarjetas = page.query_selector_all('[data-slot="card"]')
    for tarjeta in tarjetas:
        if tarjeta.is_visible():
            texto = tarjeta.inner_text()
            if 'Estadísticas' in texto or 'Stats' in texto:
                pokemonProcesado = parsear_stats_base(texto)
                pokemons[pokemon] = pokemonProcesado
                with open('data/pokemons.json', 'w', encoding='utf-8') as f:
                    json.dump(pokemons, f, indent=2, ensure_ascii=False)
                return pokemonProcesado
        
    return None

# Funcion para extraer datos de una pagina
def scrape_trainer(page, entrenador):
    page.goto(entrenador)
    page.wait_for_timeout(3000)
    #Sacamos datos
    page.click('text=Version 3')
    page.wait_for_timeout(1000)
    #Entrenador
    h1s = page.query_selector_all('h1')
    nombre_entrenador = h1s[1].inner_text()
    
    #Pokemones
    if os.path.exists('data/pokemons.json'):
        with open('data/pokemons.json', 'r', encoding='utf-8') as f:
            pokemons_cache = json.load(f)
    else: 
        pokemons_cache = {} 
    pokemones = []  
    h3s = page.query_selector_all('h3')
    for h3 in h3s:
        if h3.is_visible():
            nombre = h3.inner_text()
            if nombre in pokemons_cache:
                pokemones.append(pokemons_cache[nombre])
                continue

            pokemon = {}
            #Nombre
            pokemon['nombre'] = h3.inner_text()
            #Datos
            tarjeta = h3.evaluate_handle('el => el.closest(".bg-card")')
            datosTarjeta = tarjeta.inner_text()
            datosCrudos = datosTarjeta.split('\n')
            pokemon.update(parsear_pokemon(datosCrudos))
            pokemones.append(pokemon)

            pokemons_cache[nombre] = pokemon
            with open('data/pokemons.json', 'w', encoding='utf-8') as f:
                json.dump(pokemons_cache, f, indent=2, ensure_ascii=False)

    #Lista que elimina duplicados
    movimientos_unicos = set()
    for pokemon in pokemones:
        for mov in pokemon['movimientos']:
            movimientos_unicos.add(mov)

    #Saco los datos de los movimientos
    datos_movimientos = {}
    for mov in movimientos_unicos:
        datos_movimientos[mov] = scrape_movement(page, mov)
    
    #Actualizamos diccionario
    for pokemon in pokemones:
        pokemon['movimientos'] = [
            #** explota el diccionario y lo agrega automatico
            { 'nombre': mov, **datos_movimientos[mov]}
            for mov in pokemon['movimientos']
            if datos_movimientos.get(mov) is not None
        ]

    return {
        "entrenador": nombre_entrenador,
        "pokemones": pokemones,
    }