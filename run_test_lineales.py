import json
from backend.modelos.lineales import resolver_lineales
res=resolver_lineales({'p_expr':'1/x','q_expr':'sin(x)/x','tipo_calculo':'general'})
print(json.dumps(res, indent=2, ensure_ascii=False))
