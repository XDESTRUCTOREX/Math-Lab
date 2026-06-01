import json
from backend.modelos.lineales import resolver_lineales
from backend.modelos.crecimiento import resolver_crecimiento
from backend.modelos.decaimiento import resolver_decaimiento
from backend.modelos.enfriamiento import resolver_enfriamiento
from backend.modelos.mezclas import resolver_mezclas
from backend.modelos.exactas import resolver_exactas

results = {}

results['lineales'] = len(resolver_lineales({'p_expr':'1/x','q_expr':'sin(x)/x','tipo_calculo':'general'})['pasos'])
results['crecimiento'] = len(resolver_crecimiento({'cantidad_inicial':100,'tipo_calculo':'cantidad','constante_crecimiento':0.05,'tiempo':10,'unidad_tiempo':'años'})['pasos'])
results['decaimiento'] = len(resolver_decaimiento({'cantidad_inicial':100,'tipo_calculo':'cantidad','constante_decaimiento':0.03,'tiempo':5,'unidad_tiempo':'años'})['pasos'])
results['enfriamiento'] = len(resolver_enfriamiento({'ambiente':20,'inicial':100,'medida':60,'tiempo_medida':30,'tipo_calculo':'temperatura','tiempo_buscar':10,'unidad_tiempo':'min'})['pasos'])
results['mezclas'] = len(resolver_mezclas({'volumen':100,'caudal_entrada':5,'concentracion_entrada':2,'caudal_salida':5,'cantidad_inicial':10,'tipo_calculo':'cantidad','tiempo_buscar':2,'unidad_tiempo':'h'})['pasos'])
results['exactas'] = len(resolver_exactas({'m_expr':'x+y','n_expr':'x-y','tipo_calculo':'general'})['pasos'])

print(json.dumps(results, indent=2, ensure_ascii=False))
