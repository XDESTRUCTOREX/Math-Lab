from sympy import *
from sympy import ln
from utils.validacion import (
    validar_numero, validar_positivo, validar_campo_requerido, crear_respuesta_error
)

def resolver_crecimiento(datos):

    pasos = []

    try:
        # =========================
        # VALIDAR CAMPOS REQUERIDOS
        # =========================

        validar_campo_requerido(datos, "cantidad_inicial")
        validar_campo_requerido(datos, "tipo_calculo")

        # =========================
        # DATOS
        # =========================

        P0 = validar_positivo(datos["cantidad_inicial"], "Cantidad inicial")
        tipo_calculo = datos["tipo_calculo"]

        # =========================
        # VARIABLES SIMBÓLICAS
        # =========================

        t, k, P = symbols('t k P')

        # =========================
        # MODELO GENERAL
        # =========================

        modelo = P0 * exp(k*t)

        # =========================
        # MODELO DIFERENCIAL
        # =========================

        pasos.append({
            "titulo": "Modelo diferencial",
            "descripcion": "El crecimiento exponencial se modela mediante:",
            "latex": r"\frac{dP}{dt}=kP"
        })

        # =========================
        # SOLUCIÓN GENERAL
        # =========================

        pasos.append({
            "titulo": "Solución general",
            "descripcion": "Resolviendo la ecuación diferencial separable:",
            "latex": 
                fr"\begin{{gathered}}"
                fr"\frac{{dP}}{{dt}}=kP \\[10px]"
                fr"\frac{{dP}}{{P}}=kdt \\[10px]"
                fr"\int \frac{{dP}}{{P}}=\int kdt \\[10px]"
                fr"ln|P|=kt+C_1 \\[10px]"
                fr"P=e^{{kt+C_1}} \\[10px]"
                fr"\boxed{{P(t)=P_0 e^{{kt}}}}"
                fr"\end{{gathered}}"
        })

        # =========================
        # CONDICIÓN INICIAL
        # =========================

        pasos.append({
            "titulo": "Condición inicial",
            "descripcion": f"Se sustituye P(0) = {P0}",
            "latex": latex(Eq(P0, P0 * exp(0)))
        })

        # =========================
        # FUNCIÓN FINAL
        # =========================

        funcion_final = modelo
        funcion_visual = P0 * exp(k*t)

        pasos.append({
            "titulo": "Función de crecimiento",
            "descripcion": "La función de cantidad queda:",
            "latex": latex(Eq(Symbol("P(t)"), funcion_visual))
        })

        # ==================================================
        # CALCULAR CANTIDAD EN UN TIEMPO
        # ==================================================

        if tipo_calculo == "cantidad":

            if "constante_crecimiento" not in datos or "tiempo" not in datos:
                raise ValueError("Se requieren 'constante_crecimiento' y 'tiempo'")
            
            k_val = validar_positivo(datos["constante_crecimiento"], "Constante de crecimiento")
            t_val = validar_positivo(datos["tiempo"], "Tiempo")

            resultado = funcion_final.subs({k: k_val, t: t_val})
            resultado_final = round(float(resultado.evalf()), 4)

            pasos.append({
                "titulo": "Evaluación",
                "descripcion": f"Se evalúa la función en t = {t_val} con k = {k_val}:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"P({t_val}) = {P0} \cdot e^{{{k_val} \cdot {t_val}}} \\[10px]"
                    + latex(Eq(Symbol(f"P({t_val})"), resultado_final))
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Crecimiento Exponencial",
                "tipo": "cantidad",
                "resultado": resultado_final,
                "pasos": pasos
            }

        # ==================================================
        # CALCULAR TIEMPO PARA CANTIDAD OBJETIVO
        # ==================================================

        elif tipo_calculo == "tiempo":

            if "constante_crecimiento" not in datos or "cantidad_objetivo" not in datos:
                raise ValueError("Se requieren 'constante_crecimiento' y 'cantidad_objetivo'")
            
            k_val = validar_positivo(datos["constante_crecimiento"], "Constante de crecimiento")
            cantidad_objetivo = validar_positivo(datos["cantidad_objetivo"], "Cantidad objetivo")

            if cantidad_objetivo < P0:
                raise ValueError("La cantidad objetivo debe ser mayor que la cantidad inicial (crecimiento)")

            ecuacion_tiempo = Eq(cantidad_objetivo, funcion_final.subs(k, k_val))

            pasos.append({
                "titulo": "Planteamiento",
                "descripcion": f"Se sustituye P(t) = {cantidad_objetivo}:",
                "latex": latex(ecuacion_tiempo)
            })

            tiempo_resultado = ln(cantidad_objetivo / P0) / k_val
            tiempo_final = round(float(tiempo_resultado.evalf()), 4)

            pasos.append({
                "titulo": "Despeje del tiempo",
                "descripcion": "Se despeja t:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"{cantidad_objetivo} = {P0} e^{{{k_val}t}} \\[10px]"
                    fr"\frac{{{cantidad_objetivo}}}{{{P0}}} = e^{{{k_val}t}} \\[10px]"
                    fr"ln\left(\frac{{{cantidad_objetivo}}}{{{P0}}}\right) = {k_val}t \\[10px]"
                    fr"t = \frac{{1}}{{{k_val}}} ln\left(\frac{{{cantidad_objetivo}}}{{{P0}}}\right) \\[10px]"
                    + latex(Eq(Symbol("t"), tiempo_final))
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Crecimiento Exponencial",
                "tipo": "tiempo",
                "resultado": tiempo_final,
                "pasos": pasos
            }

        # ==================================================
        # CALCULAR TIEMPO DE DUPLICACIÓN
        # ==================================================

        elif tipo_calculo == "duplicacion":

            if "constante_crecimiento" not in datos:
                raise ValueError("Se requiere 'constante_crecimiento'")
            
            k_val = validar_positivo(datos["constante_crecimiento"], "Constante de crecimiento")

            pasos.append({
                "titulo": "Tiempo de duplicación",
                "descripcion": "El tiempo en que la cantidad se duplica:",
                "latex": r"\text{Tiempo de duplicación: } t_{d} = \frac{\ln(2)}{k}"
            })

            tiempo_dup = ln(2) / k_val
            tiempo_dup_final = round(float(tiempo_dup.evalf()), 4)

            pasos.append({
                "titulo": "Cálculo",
                "descripcion": f"Con k = {k_val}:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"t_{{d}} = \frac{{ln(2)}}{{{k_val}}} \\[10px]"
                    + latex(Eq(Symbol("t_d"), tiempo_dup_final))
                    + fr"\\[10px]"
                    fr"\text{{Cantidad en }} t_{{d}} = {P0} \cdot e^{{{k_val} \cdot {tiempo_dup_final}}} = {P0} \cdot 2 = {P0*2}"
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Crecimiento Exponencial",
                "tipo": "duplicacion",
                "resultado": tiempo_dup_final,
                "pasos": pasos
            }

        else:
            raise ValueError(f"Tipo de cálculo inválido: {tipo_calculo}")

    except (ValueError, KeyError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado: {str(e)}")
