import json
from backend.modelos.enfriamiento import resolver_enfriamiento
res = resolver_enfriamiento({'ambiente':20,'inicial':100,'medida':60,'tiempo_medida':30,'tipo_calculo':'temperatura','tiempo_buscar':10,'unidad_tiempo':'min'})
print(json.dumps(res['pasos'], indent=2, ensure_ascii=False))
