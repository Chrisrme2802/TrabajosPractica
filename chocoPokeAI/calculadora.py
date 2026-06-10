
modificadoresNaturaleza = {
    'Hardy':   {'sube': None,   'baja': None},
    'Lonely':  {'sube': 'Atk',  'baja': 'Def'},
    'Brave':   {'sube': 'Atk',  'baja': 'Spe'},
    'Adamant': {'sube': 'Atk',  'baja': 'SpA'},
    'Naughty': {'sube': 'Atk',  'baja': 'SpD'},
    'Bold':    {'sube': 'Def',  'baja': 'Atk'},
    'Docile':  {'sube': None,   'baja': None},
    'Relaxed': {'sube': 'Def',  'baja': 'Spe'},
    'Impish':  {'sube': 'Def',  'baja': 'SpA'},
    'Lax':     {'sube': 'Def',  'baja': 'SpD'},
    'Timid':   {'sube': 'Spe',  'baja': 'Atk'},
    'Hasty':   {'sube': 'Spe',  'baja': 'Def'},
    'Serious': {'sube': None,   'baja': None},
    'Jolly':   {'sube': 'Spe',  'baja': 'SpA'},
    'Naive':   {'sube': 'Spe',  'baja': 'SpD'},
    'Modest':  {'sube': 'SpA',  'baja': 'Atk'},
    'Mild':    {'sube': 'SpA',  'baja': 'Def'},
    'Quiet':   {'sube': 'SpA',  'baja': 'Spe'},
    'Bashful': {'sube': None,   'baja': None},
    'Rash':    {'sube': 'SpA',  'baja': 'SpD'},
    'Calm':    {'sube': 'SpD',  'baja': 'Atk'},
    'Gentle':  {'sube': 'SpD',  'baja': 'Def'},
    'Sassy':   {'sube': 'SpD',  'baja': 'Spe'},
    'Careful': {'sube': 'SpD',  'baja': 'SpA'},
    'Quirky':  {'sube': None,   'baja': None},
}

def calcular_stats(nivel, naturaleza, evs, ivs, statsBase):    
    #Si no encuentra la naturaleza, regresa None ambas
    modificacion = modificadoresNaturaleza.get(naturaleza, {'sube': None, 'baja': None})
    
    for stat in statsBase:
        multiplicador = 1.0
        if modificacion['sube'] == stat:
            multiplicador = 1.1
        if modificacion['baja'] == stat:
            multiplicador = 0.9
        if stat == 'HP':
            statsBase[stat] = int(((2 * statsBase['HP'] + ivs.get('HP', 0) + evs.get('HP', 0) /4) * nivel / 100) + nivel + 10)
        else:
            statsBase[stat] = int((((2 * statsBase[stat] + ivs.get(stat, 0) + evs.get(stat, 0)/4) * nivel / 100) + 5) * multiplicador)
    
    return {
        'HP': statsBase['HP'],
        'ataque': statsBase['Atk'],
        'defensa': statsBase['Def'],
        'at_esp': statsBase['SpA'],
        'def_esp': statsBase['SpD'],
        'velocidad': statsBase['Spe']   
    }