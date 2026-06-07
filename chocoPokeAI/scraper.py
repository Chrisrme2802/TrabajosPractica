#python scraper.py
#Import de librerias
from playwright.sync_api import sync_playwright
import json

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

def parsear_movimiento(datosCrudos):
    lineas = datosCrudos.split('\n')
    return {
        'nombre': lineas[0],
        'tipo': lineas[1],
        'categoria': lineas[2],
        'poder': lineas[3].replace('Poder: ', ''),
        'precision': lineas[4].replace('Prec: ', ''),
        'pp': lineas[5].replace('PP: ', '')
    }

# Funcion para extraer datos de una pagina
def scrape_trainer(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(url)
        page.wait_for_timeout(3000)

        def scrape_movement(movimiento):
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
                        return texto
                
            return None

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
                pokemon.update(parsear_pokemon(datosCrudos))

                pokemones.append(pokemon)

        #Lista que elimina duplicados
        movimientos_unicos = set()
        for pokemon in pokemones:
            for mov in pokemon['movimientos']:
                movimientos_unicos.add(mov)

        #Saco los datos de los movimientos
        datos_movimientos = {}
        for mov in movimientos_unicos:
            datos_movimientos[mov] = scrape_movement(mov)
        
        #Actualizamos diccionario
        for pokemon in pokemones:
            pokemon['movimientos'] = [
                #** explota el diccionario y lo agrega automatico
                { 'nombre': mov, **parsear_movimiento(datos_movimientos[mov])}
                for mov in pokemon['movimientos']
                if datos_movimientos.get(mov) is not None
            ]

        #Cerramos
        browser.close()

        return {
            "entrenador": nombre_entrenador,
            "pokemones": pokemones,
        }


#Prueba
datos = scrape_trainer('https://www.fakedex.es/anil/entrenadores/lider7-blaine')
print(json.dumps(datos, indent=2, ensure_ascii=False))