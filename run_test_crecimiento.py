import json
from backend.modelos.crecimiento import resolver_crecimiento
res = resolver_crecimiento({'cantidad_inicial':100,'tipo_calculo':'cantidad','constante_crecimiento':0.05,'tiempo':10,'unidad_tiempo':'años'})
print(json.dumps(res['pasos'], indent=2, ensure_ascii=False))
