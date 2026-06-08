#Import de modulos


#Funcion pasar pokemon lineas a objeto
def parsear_pokemon(datosCrudos):
        return {
        'nombre': datosCrudos[0],
        'nivel': int(datosCrudos[1].replace('Lv.', '')),
        'objeto': datosCrudos[3],
        'habilidad': datosCrudos[5],
        'naturaleza': datosCrudos[7],
        'movimientos': [datosCrudos[9], datosCrudos[10], datosCrudos[11], datosCrudos[12]],
        'stats': {
            'HP': int(datosCrudos[16]),
            'Atk': int(datosCrudos[18]),
            'Def': int(datosCrudos[20]),
            'SpA': int(datosCrudos[22]),
            'SpD': int(datosCrudos[24]),
            'Spe': int(datosCrudos[26])
        }
    }

def parsear_stats_base(texto):
    lineas = texto.split('\n')
    #indice de Stats
    idx = lineas.index('Stats')
    return {
        'hp': int(lineas[idx + 3]),
        'ataque': int(lineas[idx + 5]),
        'defensa': int(lineas[idx + 7]),
        'at_esp': int(lineas[idx + 9]),
        'def_esp': int(lineas[idx + 11]),
        'velocidad': int(lineas[idx + 13])
    }

#Funcion pasar movimientos lineas a objeto
def parsear_movimiento(datosCrudos):
    lineas = datosCrudos.split('\n')
    return {
        'nombre': lineas[0],
        'tipo': lineas[1],
        'categoria': lineas[2],
        'poder': lineas[3].replace('Poder: ', '').replace('Power: ', ''),
        'precision': lineas[4].replace('Prec: ', '').replace('Acc: ', '').replace('%', ''),
        'pp': lineas[5].replace('PP: ', '')
    }

#Funcion de apoyo de EVs y IVs
def parsear_evs_ivs(stat):
      statOrdenados = {}
      partes = stat.split('/')
      for parte in partes:
            #El [0] y [1] se agregan a las dos variables
            valor, stat = parte.split(' ').strip()
            statOrdenados[stat] = int(valor)
            return statOrdenados

#Funcion para parsear un showdown
def parsear_showdown(archivo, nombre):
      pokemones = []
      with open(archivo, 'r') as f:
            archivoCrudo = f.read()
            bloques = archivoCrudo.split('\n\n')
            for bloque in bloques:
                  lineas = bloque.split('\n')

                  #Linea 0
                  linea0 = lineas[0].split('@')
                  nombre_pokemon = linea0[0].split('(')[1].replace(')', '').strip()
                  objeto = linea0[1].strip() if len(linea0) > 1 else None

                  #Lineas fijas
                  habilidad = lineas[1].replace('Ability: ', '')
                  nivel = int(lineas[2].replace('Level: ', ''))
                  naturaleza = lineas[5].replace(' Nature', '')
                  movimientos = [l.replace('- ', '') for l in lineas[-4:]]

                  #EVs y IVs
                  evs = parsear_evs_ivs(lineas[3].replace('EVs: ', ''))
                  ivs = parsear_evs_ivs(lineas[4].replace('IVs: ', ''))
                  stats = calcular_stats(nombre_pokemon, nivel, naturaleza, evs, ivs)

                  pokemones.append({
                        'nombre': nombre_pokemon,
                        'nivel': nivel,
                        'objeto': objeto,
                        'habilidad': habilidad,
                        'naturaleza': naturaleza,
                        'movimientos': movimientos,
                        'stats': stats
                    })
                  
                  return {
                    "nombre": nombre,
                    "pokemones": pokemones    
                  } 

