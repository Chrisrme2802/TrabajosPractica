#python chocoPokeAI.py
from parsers import parsear_showdown, parsear_pokemon, parsear_stats_base
from scrapers import scrape_pokemon
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Mi equipo
        pokemon = scrape_pokemon(page, 'Tinkaton')
        pokemonDatos = parsear_stats_base(pokemon)

        browser.close()

print(pokemonDatos)