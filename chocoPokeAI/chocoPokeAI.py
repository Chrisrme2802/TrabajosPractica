#python chocoPokeAI.py
from pipeline import procesar_equipo_showdown
from scrapers import scrape_trainer
from playwright.sync_api import sync_playwright
import json
import os

with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Mi equipo
        mi_equipo = procesar_equipo_showdown(page, 'resources/showdown.txt', 'ChocoChris')
        # Lider
        lider = scrape_trainer(page, 'https://www.fakedex.es/anil/entrenadores/lider7-blaine')

        browser.close()
        
        os.makedirs('data', exist_ok=True)

        with open(f'data/{mi_equipo["nombre"].lower()}.json', 'w', encoding='utf-8') as f:
                json.dump(mi_equipo, f, indent=2, ensure_ascii=False)

        with open(f'data/{lider["entrenador"].lower()}.json', 'w', encoding='utf-8') as f:
                json.dump(lider, f, indent=2, ensure_ascii=False)