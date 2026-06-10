#python chocoPokeAI.py
from parsers import parsear_showdown, parsear_stats_base, parsear_movimiento
from scrapers import scrape_pokemon, scrape_movement
from calculadora import calcular_stats
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Mi equipo
        pokemonDatosCrudos = parsear_showdown('resources/showdown.txt', 'ChocoChris')

        for pokemon in pokemonDatosCrudos['pokemones']:
                stats_base = parsear_stats_base(scrape_pokemon(page, pokemon['nombre']))
                pokemon['stats'] = calcular_stats(pokemon['nivel'], pokemon['naturaleza'], pokemon['evs'], pokemon['ivs'], stats_base)
                # limpiamos evs e ivs
                del pokemon['evs']
                del pokemon['ivs']

                movimientos = []
                for movimiento in pokemon['movimientos']:
                        datos = scrape_movement(page, movimiento)
                        if datos:
                                movimientos.append({'nombre': movimiento, **parsear_movimiento(datos)})
                pokemon['movimientos'] = movimientos

        browser.close()

print(json.dumps(pokemonDatosCrudos, indent=2, ensure_ascii=False))