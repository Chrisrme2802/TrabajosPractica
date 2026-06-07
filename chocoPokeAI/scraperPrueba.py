#python scraperPrueba.py
from playwright.sync_api import sync_playwright

def scrape_entrenador(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        page.wait_for_timeout(3000)
        
        # Buscamos todos los h1 y los imprimimos
        h1s = page.query_selector_all('h1')
        for h1 in h1s:
            print(h1.inner_text())
        
        browser.close()

scrape_entrenador('https://www.fakedex.es/anil/entrenadores/lider7-blaine')