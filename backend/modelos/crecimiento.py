from sympy import *
from sympy import ln
from backend.utils.validacion import (
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
        # SOLUCIÓN GENERAL (desglosada)
        # =========================

        pasos.append({
            "titulo": "Separación de variables",
            "descripcion": "Se separan las variables para integrar:",
            "latex": fr"\frac{{dP}}{{dt}}=kP \\[10px] \frac{{dP}}{{P}}=kdt"
        })

        pasos.append({
            "titulo": "Integración",
            "descripcion": "Se integran ambos lados respecto a sus variables:",
            "latex": fr"\int \frac{{dP}}{{P}}=\int k dt"
        })

        pasos.append({
            "titulo": "Resultado de la integración",
            "descripcion": "Se obtiene la expresión logarítmica y se despeja la constante de integración:",
            "latex": fr"\ln|P| = kt + C_1"
        })

        pasos.append({
            "titulo": "Exponenciación y solución general",
            "descripcion": "Se aplica la exponenciación para despejar P(t):",
            "latex": fr"P = e^{{kt + C_1}} = e^{{C_1}} e^{{kt}} \\[10px] P(t) = P_0 e^{{kt}}"
        })

        # =========================
        # CONDICIÓN INICIAL
        # =========================

        pasos.append({
            "titulo": "Condición inicial",
            "descripcion": f"Se sustituye P(0) = {P0}",
            "latex": latex(Eq(P0, P0 * exp(0)))
        })

        # ==================================================
        # DETERMINAR CONSTANTE K Y UNIDAD DE TIEMPO
        # ==================================================
        unidad = datos.get("unidad_tiempo", "").strip() or "unidades de tiempo"
        modo_dos_puntos = datos.get("modo_dos_puntos") in [True, "true"]

        if modo_dos_puntos:
            validar_campo_requerido(datos, "t1")
            validar_campo_requerido(datos, "p1")
            t1_val = validar_positivo(datos["t1"], "Tiempo 1 (t1)")
            p1_val = validar_positivo(datos["p1"], "Población 1 (p1)")
            
            if p1_val <= P0:
                raise ValueError("La cantidad en t1 (p1) debe ser mayor que la cantidad inicial para un modelo de crecimiento")
            
            k_val_sym = ln(p1_val / P0) / t1_val
            k_val = round(float(k_val_sym.evalf()), 4)
            
            pasos.append({
                "titulo": "Cálculo de la constante k",
                "descripcion": f"Dado que en t1 = {t1_val} {unidad} la población es p1 = {p1_val}:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"P({t1_val}) = {P0} \cdot e^{{k \cdot {t1_val}}} = {p1_val} \\[10px]"
                    fr"e^{{{t1_val}k}} = \frac{{{p1_val}}}{{{P0}}} \\[10px]"
                    fr"{t1_val}k = \ln\left(\frac{{{p1_val}}}{{{P0}}}\right) \\[10px]"
                    fr"k = \frac{{\ln\left({round(float(p1_val/P0), 4)}\right)}}{{{t1_val}}} \\[10px]"
                    fr"\boxed{{k \approx {k_val}}}"
                    fr"\end{{gathered}}"
            })
        else:
            validar_campo_requerido(datos, "constante_crecimiento")
            k_val = validar_positivo(datos["constante_crecimiento"], "Constante de crecimiento")

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

            validar_campo_requerido(datos, "tiempo")
            t_val = validar_positivo(datos["tiempo"], "Tiempo")

            resultado = funcion_final.subs({k: k_val, t: t_val})
            resultado_final = round(float(resultado.evalf()), 4)

            pasos.append({
                "titulo": "Evaluación",
                "descripcion": f"Se evalúa la función en t = {t_val} {unidad} con k = {k_val}:",
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

            validar_campo_requerido(datos, "cantidad_objetivo")
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
                    + fr"t \approx {tiempo_final} \text{{ {unidad}}}"
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Crecimiento Exponencial",
                "tipo": "tiempo",
                "resultado": f"{tiempo_final} {unidad}",
                "pasos": pasos
            }

        # ==================================================
        # CALCULAR TIEMPO DE DUPLICACIÓN
        # ==================================================

        elif tipo_calculo == "duplicacion":

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
                    fr"t_d \approx {tiempo_dup_final} \text{{ {unidad}}} \\[10px]"
                    fr"\text{{Cantidad en }} t_{{d}} = {P0} \cdot e^{{{k_val} \cdot {tiempo_dup_final}}} = {P0} \cdot 2 = {P0*2}"
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Crecimiento Exponencial",
                "tipo": "duplicacion",
                "resultado": f"{tiempo_dup_final} {unidad}",
                "pasos": pasos
            }

        else:
            raise ValueError(f"Tipo de cálculo inválido: {tipo_calculo}")

    except (ValueError, KeyError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado: {str(e)}")
