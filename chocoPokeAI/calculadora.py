from scrapers import scrape_pokemon
from parsers import parsear_stats_base
def calcular_stats(nombre_pokemon, nivel, naturaleza, evs, ivs):
    base = parsear_stats_base(scrape_pokemon(nombre_pokemon))
    for stat in base:
        if stat == 'HP':
            base[stat] = ((2 * base['HP'] + ivs['HP'] + evs['HP'] /4) * nivel / 100) + nivel + 10
        base[stat] = (((2 * base[stat] + ivs[stat] + evs[stat]/4) * nivel / 100) + 5) * Naturaleza
    
    return {
        'HP': base['HP'],
        'ataque': base['Atk'],
        'defensa': base['Def'],
        'at_esp': base['SpA'],
        'def_esp': base['SpD'],
        'velocidad': base['Spe']
    }