from sympy import symbols, sympify, integrate, exp, Eq, solve, latex, Symbol, simplify
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
        
        latex_mu = (
            "\\begin{{gathered}}"
            "\\mu(x) = e^{{\\int \\left({}\\right) dx}} \\\\[10px]"
            "\\mu(x) = e^{{{}}} = {}"
            "\\end{{gathered}}"
        ).format(latex(P_x), latex(integral_P), latex(mu))

        pasos.append({
            "titulo": "Factor integrante",
            "descripcion": "Se calcula el factor integrante \\mu(x) = e^{\\int P(x) dx}:",
            "latex": latex_mu
        })

        # 3. Multiplicación
        mu_q = mu * Q_x
        latex_mult = "\\frac{{d}}{{dx}}\\left[{} \\cdot y\\right] = {} \\cdot \\left({}\\right) = {}".format(latex(mu), latex(mu), latex(Q_x), latex(mu_q))
        pasos.append({
            "titulo": "Multiplicación",
            "descripcion": "Multiplicando ambos lados por el factor integrante, la parte izquierda se condensa como la derivada del producto:",
            "latex": latex_mult
        })

        # 4. Integración
        integral_mu_q = integrate(mu_q, x)
        
        latex_int = (
            "\\begin{{gathered}}"
            "\\int \\frac{{d}}{{dx}}\\left[{} y\\right] dx = \\int {} dx \\\\[10px]"
            "{} y = {} + C"
            "\\end{{gathered}}"
        ).format(latex(mu), latex(mu_q), latex(mu), latex(integral_mu_q))

        pasos.append({
            "titulo": "Integración",
            "descripcion": "Se integran ambos lados con respecto a x:",
            "latex": latex_int
        })

        # 5. Solución general
        solucion_general_expr = (integral_mu_q + C) / mu
        try:
            solucion_general_simpl = simplify(solucion_general_expr)
        except Exception:
            solucion_general_simpl = solucion_general_expr
            
        latex_sol_gen = "\\boxed{{y(x) = {}}}".format(latex(solucion_general_simpl))
        pasos.append({
            "titulo": "Solución general",
            "descripcion": "Se despeja y para obtener la solución general:",
            "latex": latex_sol_gen
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
