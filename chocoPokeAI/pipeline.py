from parsers import parsear_showdown
from calculadora import calcular_stats
from scrapers import scrape_movement, scrape_pokemon

def procesar_equipo_showdown(page, archivo, nombre='Jugador'):
    datos = parsear_showdown(archivo, nombre)
    
    for pokemon in datos['pokemones']:
        stats_base = scrape_pokemon(page, pokemon['nombre'])
        pokemon['stats'] = calcular_stats(pokemon['nivel'], pokemon['naturaleza'], pokemon['evs'], pokemon['ivs'], stats_base)
        del pokemon['evs']
        del pokemon['ivs']
        
        movimientos = []
        for movimiento in pokemon['movimientos']:
            datos_mov = scrape_movement(page, movimiento)
            if datos_mov:
                movimientos.append({'nombre': movimiento, **datos_mov})
        pokemon['movimientos'] = movimientos
    
    return datos