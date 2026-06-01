from sympy import symbols, sympify, integrate, exp, Eq, solve, latex, Symbol, simplify, diff
from backend.utils.validacion import validar_campo_requerido, crear_respuesta_error, normalizar_expresion_simbolica

def resolver_lineales(datos):
    pasos = []
    try:
        validar_campo_requerido(datos, "p_expr")
        validar_campo_requerido(datos, "q_expr")
        validar_campo_requerido(datos, "tipo_calculo")

        x = Symbol('x')
        y = Symbol('y')
        C = Symbol('C')

        p_str = normalizar_expresion_simbolica(datos["p_expr"].strip())
        q_str = normalizar_expresion_simbolica(datos["q_expr"].strip())
        
        if not p_str or not q_str:
            raise ValueError("Las expresiones para P(x) y Q(x) no pueden estar vacías.")
            
        P_x = sympify(p_str)
        Q_x = sympify(q_str)
        
        tipo_calculo = datos["tipo_calculo"]

        # 1. Forma estándar
        latex_std = "y' + P(x)y = Q(x) \\implies y' + \\left({}\\right)y = {}".format(latex(P_x), latex(Q_x))
        pasos.append({
            "titulo": "Forma estándar",
            "descripcion": "La ecuación diferencial lineal de primer orden se escribe en la forma estándar:",
            "latex": latex_std
        })

        # 2. Factor integrante
        integral_P = integrate(P_x, x)
        mu = exp(integral_P)

        # Mostrar la integración de P(x)
        pasos.append({
            "titulo": "Integración de P(x)",
            "descripcion": "Se calcula la integral de P(x) que aparece en el exponente del factor integrante:",
            "latex": "\\int P(x) dx = {}".format(latex(integral_P))
        })

        # Mostrar mu(x)
        latex_mu = (
            "\\begin{gathered}"
            f"\\mu(x) = e^{{\\int P(x) dx}} = e^{{{latex(integral_P)}}} \\\\[10px]"
            f"\\mu(x) = {latex(mu)}"
            "\\end{gathered}"
        )

        pasos.append({
            "titulo": "Factor integrante",
            "descripcion": "Se define el factor integrante \mu(x):",
            "latex": latex_mu
        })

        # 3. Multiplicación y detalle del producto
        mu_q = mu * Q_x
        # Mostrar que mu' = mu * P y la forma de derivada del producto
        latex_mult = (
            "\\begin{gathered}"
            f"\\frac{{d}}{{dx}}\\left[{latex(mu)}\\, y\\right] = {latex(mu)} y' + {latex(diff(mu, x))} y \\\\[10px]"
            f"\\text{{Pero}}\\quad {latex(diff(mu, x))} = {latex(mu)}\\cdot {latex(P_x)} \\\\[10px]"
            f"\\therefore \\frac{{d}}{{dx}}\\left[{latex(mu)}\\, y\\right] = {latex(mu)} y' + {latex(mu)} {latex(P_x)} y = {latex(mu)}\\left(y' + {latex(P_x)} y\\right) \\\\[10px]"
            f"= {latex(mu_q)}"
            "\\end{gathered}"
        )

        pasos.append({
            "titulo": "Multiplicación por \mu(x)",
            "descripcion": "Multiplicando la ecuación estándar por \mu(x) y usando que la izquierda es derivada de \mu y por y:",
            "latex": latex_mult
        })

        # 4. Integración
        integral_mu_q = integrate(mu_q, x)
        latex_int = (
            "\\begin{gathered}"
            f"\\int \\frac{{d}}{{dx}}\\left[{latex(mu)} y\\right] dx = \\int {latex(mu_q)} dx \\\\[10px]"
            f"{latex(mu)} y = {latex(integral_mu_q)} + C"
            "\\end{gathered}"
        )

        pasos.append({
            "titulo": "Integración",
            "descripcion": "Se integran ambos lados para obtener \mu(x) y en términos de la integral de \mu(x)Q(x):",
            "latex": latex_int
        })

        # 5. Solución general (desglosada)
        # Ecuación intermedia antes de despejar y
        pasos.append({
            "titulo": "Ecuación intermedia",
            "descripcion": "Se expresa la igualdad obtenida tras integrar:",
            "latex": f"{latex(mu)} \; y = {latex(integral_mu_q)} + C"
        })

        # Despeje de y
        solucion_general_expr = (integral_mu_q + C) / mu
        pasos.append({
            "titulo": "Despeje de y",
            "descripcion": "Se despeja y dividiendo por el factor integrante:",
            "latex": f"y = \frac{{{latex(integral_mu_q)} + C}}{{{latex(mu)}}}"
        })

        # Simplificación
        try:
            solucion_general_simpl = simplify(solucion_general_expr)
        except Exception:
            solucion_general_simpl = solucion_general_expr

        pasos.append({
            "titulo": "Simplificación",
            "descripcion": "Se simplifica la expresión algebraica final:",
            "latex": "\\boxed{{y(x) = {}}}".format(latex(solucion_general_simpl))
        })

        if tipo_calculo == "particular":
            validar_campo_requerido(datos, "x0")
            validar_campo_requerido(datos, "y0")
            
            x0 = sympify(datos["x0"])
            y0 = sympify(datos["y0"])
            
            # mu(x0) * y0 = integral_mu_q(x0) + C
            eq_C = Eq(mu.subs(x, x0) * y0, integral_mu_q.subs(x, x0) + C)
            solucion_C = solve(eq_C, C)
            
            if not solucion_C:
                raise ValueError("No se pudo despejar la constante C con las condiciones dadas.")
                
            valor_C = solucion_C[0]
            
            latex_cond_part = (
                "\\begin{{gathered}}"
                "{} \\cdot ({}) = {} + C \\\\[10px]"
                "C = {}"
                "\\end{{gathered}}"
            ).format(latex(mu.subs(x, x0)), latex(y0), latex(integral_mu_q.subs(x, x0)), latex(valor_C))

            pasos.append({
                "titulo": "Condición inicial",
                "descripcion": fr"Sustituyendo la condición inicial y({latex(x0)}) = {latex(y0)} para encontrar C:",
                "latex": latex_cond_part
            })
            
            solucion_particular = solucion_general_expr.subs(C, valor_C)
            try:
                solucion_particular_simpl = simplify(solucion_particular)
            except Exception:
                solucion_particular_simpl = solucion_particular
                
            latex_sol_part = "\\boxed{{y(x) = {}}}".format(latex(solucion_particular_simpl))
            pasos.append({
                "titulo": "Solución particular",
                "descripcion": "Sustituyendo el valor de C en la solución general:",
                "latex": latex_sol_part
            })
            
            return {
                "modelo": "Ecuaciones Lineales",
                "tipo": "particular",
                "resultado": f"y(x) = {solucion_particular_simpl}",
                "pasos": pasos
            }
            
        else:
            return {
                "modelo": "Ecuaciones Lineales",
                "tipo": "general",
                "resultado": f"y(x) = {solucion_general_simpl}",
                "pasos": pasos
            }

    except (ValueError, KeyError, TypeError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado al resolver la ecuación lineal: {str(e)}")
