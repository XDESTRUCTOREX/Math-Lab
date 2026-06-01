from sympy import symbols, sympify, diff, integrate, exp, Eq, solve, latex, Symbol, simplify
from backend.utils.validacion import validar_campo_requerido, crear_respuesta_error, normalizar_expresion_simbolica

def resolver_exactas(datos):
    pasos = []
    try:
        validar_campo_requerido(datos, "m_expr")
        validar_campo_requerido(datos, "n_expr")
        validar_campo_requerido(datos, "tipo_calculo")

        x, y, C = symbols('x y C')

        m_str = normalizar_expresion_simbolica(datos["m_expr"].strip())
        n_str = normalizar_expresion_simbolica(datos["n_expr"].strip())

        if not m_str or not n_str:
            raise ValueError("Las expresiones para M(x,y) y N(x,y) no pueden estar vacías.")

        M = sympify(m_str)
        N = sympify(n_str)
        
        tipo_calculo = datos["tipo_calculo"]

        # 1. Verificar exactitud
        dM_dy = diff(M, y)
        dN_dx = diff(N, x)

        latex_exactitud = (
            "\\begin{{gathered}}"
            "M(x,y) = {}, \\quad N(x,y) = {} \\\\[10px]"
            "\\frac{{\\partial M}}{{\\partial y}} = {} \\\\[10px]"
            "\\frac{{\\partial N}}{{\\partial x}} = {}"
            "\\end{{gathered}}"
        ).format(latex(M), latex(N), latex(dM_dy), latex(dN_dx))

        pasos.append({
            "titulo": "Verificación de exactitud",
            "descripcion": "Para que la ecuación M(x,y)dx + N(x,y)dy = 0 sea exacta, debe cumplirse que \\partial M/\\partial y = \\partial N/\\partial x:",
            "latex": latex_exactitud
        })

        es_exacta = simplify(dM_dy - dN_dx) == 0
        
        if not es_exacta:
            # Intentar encontrar factor integrante
            # Caso 1: mu(x) = exp(integral( ((dM/dy - dN/dx)/N) dx ))
            h_x_expr = (dM_dy - dN_dx) / N
            h_x = simplify(h_x_expr)
            
            if not h_x.has(y):
                integral_h = integrate(h_x, x)
                mu = simplify(exp(integral_h))
                
                latex_mu_x = (
                    "\\begin{{gathered}}"
                    "\\frac{{1}}{{N}}\\left(\\frac{{\\partial M}}{{\\partial y}} - \\frac{{\\partial N}}{{\\partial x}}\\right) = {} \\\\[10px]"
                    "\\mu(x) = e^{{\\int {} dx}} = {}"
                    "\\end{{gathered}}"
                ).format(latex(h_x), latex(h_x), latex(mu))

                pasos.append({
                    "titulo": "Factor integrante mu(x)",
                    "descripcion": "Como la ecuación no es exacta, calculamos un factor integrante que dependa solo de x:",
                    "latex": latex_mu_x
                })
                
                M = simplify(mu * M)
                N = simplify(mu * N)
                dM_dy = diff(M, y)
                dN_dx = diff(N, x)
                
                latex_new_edo = "\\left({}\\right)dx + \\left({}\\right)dy = 0".format(latex(M), latex(N))
                pasos.append({
                    "titulo": "Nueva ecuación exacta",
                    "descripcion": "Multiplicando la ecuación diferencial por el factor integrante obtenemos una ecuación exacta:",
                    "latex": latex_new_edo
                })
            else:
                # Caso 2: mu(y) = exp(integral( ((dN/dx - dM/dy)/M) dy ))
                g_y_expr = (dN_dx - dM_dy) / M
                g_y = simplify(g_y_expr)
                if not g_y.has(x):
                    integral_g = integrate(g_y, y)
                    mu = simplify(exp(integral_g))
                    
                    latex_mu_y = (
                        "\\begin{{gathered}}"
                        "\\frac{{1}}{{M}}\\left(\\frac{{\\partial N}}{{\\partial x}} - \\frac{{\\partial M}}{{\\partial y}}\\right) = {} \\\\[10px]"
                        "\\mu(y) = e^{{\\int {} dy}} = {}"
                        "\\end{{gathered}}"
                    ).format(latex(g_y), latex(g_y), latex(mu))

                    pasos.append({
                        "titulo": "Factor integrante mu(y)",
                        "descripcion": "Como la ecuación no es exacta, calculamos un factor integrante que dependa solo de y:",
                        "latex": latex_mu_y
                    })
                    M = simplify(mu * M)
                    N = simplify(mu * N)
                    dM_dy = diff(M, y)
                    dN_dx = diff(N, x)
                    
                    latex_new_edo = "\\left({}\\right)dx + \\left({}\\right)dy = 0".format(latex(M), latex(N))
                    pasos.append({
                        "titulo": "Nueva ecuación exacta",
                        "descripcion": "Multiplicando la ecuación diferencial por el factor integrante obtenemos una ecuación exacta:",
                        "latex": latex_new_edo
                    })
                else:
                    raise ValueError("La ecuación no es exacta y no se pudo encontrar un factor integrante simple mu(x) o mu(y).")
        else:
            latex_exacta = "\\frac{{\\partial M}}{{\\partial y}} = \\frac{{\\partial N}}{{\\partial x}} = {}".format(latex(dM_dy))
            pasos.append({
                "titulo": "Ecuación exacta",
                "descripcion": "Dado que las derivadas parciales son iguales, la ecuación es exacta.",
                "latex": latex_exacta
            })

        # 2. Integrar M respecto a x
        integral_M_dx = integrate(M, x)
        latex_int_M = "F(x,y) = \\int \\left({}\\right) dx + g(y) = {} + g(y)".format(latex(M), latex(integral_M_dx))
        pasos.append({
            "titulo": "Integración de M respecto a x",
            "descripcion": "La función potencial F(x,y) satisface \\partial F/\\partial x = M. Integrando M respecto a x:",
            "latex": latex_int_M
        })

        # 3. Determinar g(y)
        d_dy_integral = diff(integral_M_dx, y)
        g_prime = N - d_dy_integral
        g_prime = simplify(g_prime)
        
        g_y_expr = integrate(g_prime, y)
        g_y_expr = simplify(g_y_expr)
        
        # Build latex without nested .format() calls to avoid issues with curly braces
        latex_gy = (
            "\\begin{gathered}"
            f"\\frac{{\\partial}}{{\\partial y}}\\left({latex(integral_M_dx)}\\right) + g'(y) = N(x,y) \\\\[10px]"
            f"{latex(d_dy_integral)} + g'(y) = {latex(N)} \\\\[10px]"
            f"g'(y) = {latex(g_prime)} \\\\[10px]"
            f"g(y) = \\int \\left({latex(g_prime)}\\right) dy = {latex(g_y_expr)}"
            "\\end{gathered}"
        )

        pasos.append({
            "titulo": "Determinación de g(y)",
            "descripcion": "Derivamos F(x,y) respecto a y e igualamos a N(x,y) para encontrar g'(y):",
            "latex": latex_gy
        })

        # 4. Solución implícita F(x,y) = C
        F_xy = integral_M_dx + g_y_expr
        try:
            F_xy = simplify(F_xy)
        except Exception:
            pass
        
        latex_sol_gen = "\\boxed{{{} = C}}".format(latex(F_xy))
        pasos.append({
            "titulo": "Solución general implícita",
            "descripcion": "La solución general se expresa implícitamente como F(x,y) = C:",
            "latex": latex_sol_gen
        })

        if tipo_calculo == "particular":
            validar_campo_requerido(datos, "x0")
            validar_campo_requerido(datos, "y0")
            x0 = sympify(datos["x0"])
            y0 = sympify(datos["y0"])

            C_val = F_xy.subs({x: x0, y: y0})
            try:
                C_val = simplify(C_val)
            except Exception:
                pass

            latex_cond_part = (
                "\\begin{{gathered}}"
                "C = {} \\\\[10px]"
                "C = {}"
                "\\end{{gathered}}"
            ).format(latex(F_xy.subs({x: x0, y: y0})), latex(C_val))

            pasos.append({
                "titulo": "Condición inicial",
                "descripcion": "Sustituyendo la condición inicial y({}) = {} para encontrar C:".format(latex(x0), latex(y0)),
                "latex": latex_cond_part
            })

            latex_sol_part = "\\boxed{{{} = {}}}".format(latex(F_xy), latex(C_val))
            pasos.append({
                "titulo": "Solución particular implícita",
                "descripcion": "Sustituyendo C en la solución general implícita:",
                "latex": latex_sol_part
            })

            return {
                "modelo": "Ecuaciones Exactas",
                "tipo": "particular",
                "resultado": f"{latex(F_xy)} = {latex(C_val)}",
                "pasos": pasos
            }
        else:
            return {
                "modelo": "Ecuaciones Exactas",
                "tipo": "general",
                "resultado": f"{latex(F_xy)} = C",
                "pasos": pasos
            }

    except (ValueError, KeyError, TypeError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado al resolver la ecuación exacta: {str(e)}")
