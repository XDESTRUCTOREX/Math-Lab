import json
from backend.modelos.decaimiento import resolver_decaimiento
res = resolver_decaimiento({'cantidad_inicial':100,'tipo_calculo':'cantidad','constante_decaimiento':0.03,'tiempo':5,'unidad_tiempo':'años'})
print(json.dumps(res['pasos'], indent=2, ensure_ascii=False))
