from sympy import *
from sympy import ln
from backend.utils.validacion import (
    validar_numero, validar_positivo, validar_campo_requerido, crear_respuesta_error
)

def resolver_decaimiento(datos):

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

        N0 = validar_positivo(datos["cantidad_inicial"], "Cantidad inicial")
        tipo_calculo = datos["tipo_calculo"]

        # =========================
        # VARIABLES SIMBÓLICAS
        # =========================

        t, k, N = symbols('t k N')

        # =========================
        # MODELO GENERAL
        # =========================

        modelo = N0 * exp(-k*t)

        # =========================
        # MODELO DIFERENCIAL
        # =========================

        pasos.append({
            "titulo": "Modelo diferencial",
            "descripcion": "El decaimiento exponencial se modela mediante:",
            "latex": r"\frac{dN}{dt}=-kN"
        })

        # =========================
        # SOLUCIÓN GENERAL
        # =========================

        pasos.append({
            "titulo": "Solución general",
            "descripcion": "Resolviendo la ecuación diferencial separable:",
            "latex": 
                fr"\begin{{gathered}}"
                fr"\frac{{dN}}{{dt}}=-kN \\[10px]"
                fr"\frac{{dN}}{{N}}=-kdt \\[10px]"
                fr"\int \frac{{dN}}{{N}}=\int -kdt \\[10px]"
                fr"ln|N|=-kt+C_1 \\[10px]"
                fr"N=e^{{-kt+C_1}} \\[10px]"
                fr"\boxed{{N(t)=N_0 e^{{-kt}}}}"
                fr"\end{{gathered}}"
        })

        # =========================
        # CONDICIÓN INICIAL
        # =========================

        pasos.append({
            "titulo": "Condición inicial",
            "descripcion": f"Se sustituye N(0) = {N0}",
            "latex": latex(Eq(N0, N0 * exp(0)))
        })

        # ==================================================
        # DETERMINAR CONSTANTE K Y UNIDAD DE TIEMPO
        # ==================================================
        unidad = datos.get("unidad_tiempo", "").strip() or "unidades de tiempo"
        modo_dos_puntos = datos.get("modo_dos_puntos") in [True, "true"]

        if modo_dos_puntos:
            validar_campo_requerido(datos, "t1")
            validar_campo_requerido(datos, "n1")
            t1_val = validar_positivo(datos["t1"], "Tiempo 1 (t1)")
            n1_val = validar_positivo(datos["n1"], "Cantidad 1 (n1)")
            
            if n1_val >= N0:
                raise ValueError("La cantidad en t1 (n1) debe ser menor que la cantidad inicial para un modelo de decaimiento")
            
            k_val_sym = -ln(n1_val / N0) / t1_val
            k_val = round(float(k_val_sym.evalf()), 4)
            
            pasos.append({
                "titulo": "Cálculo de la constante k",
                "descripcion": f"Dado que en t1 = {t1_val} {unidad} la cantidad es n1 = {n1_val}:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"N({t1_val}) = {N0} \cdot e^{{-k \cdot {t1_val}}} = {n1_val} \\[10px]"
                    fr"e^{{-{t1_val}k}} = \frac{{{n1_val}}}{{{N0}}} \\[10px]"
                    fr"-{t1_val}k = \ln\left(\frac{{{n1_val}}}{{{N0}}}\right) \\[10px]"
                    fr"k = -\frac{{\ln\left({round(float(n1_val/N0), 4)}\right)}}{{{t1_val}}} \\[10px]"
                    fr"\boxed{{k \approx {k_val}}}"
                    fr"\end{{gathered}}"
            })
        else:
            validar_campo_requerido(datos, "constante_decaimiento")
            k_val = validar_positivo(datos["constante_decaimiento"], "Constante de decaimiento")

        # =========================
        # FUNCIÓN FINAL
        # =========================

        funcion_final = modelo
        funcion_visual = N0 * exp(-k*t)

        pasos.append({
            "titulo": "Función de decaimiento",
            "descripcion": "La función de cantidad queda:",
            "latex": latex(Eq(Symbol("N(t)"), funcion_visual))
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
                    fr"N({t_val}) = {N0} \cdot e^{{-{k_val} \cdot {t_val}}} \\[10px]"
                    + latex(Eq(Symbol(f"N({t_val})"), resultado_final))
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Decaimiento Exponencial",
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

            if cantidad_objetivo > N0:
                raise ValueError("La cantidad objetivo no puede ser mayor que la cantidad inicial (decaimiento)")

            ecuacion_tiempo = Eq(cantidad_objetivo, funcion_final.subs(k, k_val))

            pasos.append({
                "titulo": "Planteamiento",
                "descripcion": f"Se sustituye N(t) = {cantidad_objetivo}:",
                "latex": latex(ecuacion_tiempo)
            })

            tiempo_resultado = -ln(cantidad_objetivo / N0) / k_val
            tiempo_final = round(float(tiempo_resultado.evalf()), 4)

            pasos.append({
                "titulo": "Despeje del tiempo",
                "descripcion": "Se despeja t:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"{cantidad_objetivo} = {N0} e^{{-{k_val}t}} \\[10px]"
                    fr"\frac{{{cantidad_objetivo}}}{{{N0}}} = e^{{-{k_val}t}} \\[10px]"
                    fr"ln\left(\frac{{{cantidad_objetivo}}}{{{N0}}}\right) = -{k_val}t \\[10px]"
                    fr"t = -\frac{{1}}{{{k_val}}} ln\left(\frac{{{cantidad_objetivo}}}{{{N0}}}\right) \\[10px]"
                    + fr"t \approx {tiempo_final} \text{{ {unidad}}}"
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Decaimiento Exponencial",
                "tipo": "tiempo",
                "resultado": f"{tiempo_final} {unidad}",
                "pasos": pasos
            }

        # ==================================================
        # CALCULAR VIDA MEDIA
        # ==================================================

        elif tipo_calculo == "vida_media":

            pasos.append({
                "titulo": "Vida media",
                "descripcion": "El tiempo en que la cantidad se reduce a la mitad:",
                "latex": r"\text{Vida media: } t_{1/2} = \frac{\ln(2)}{k}"
            })

            vida_media = ln(2) / k_val
            vida_media_final = round(float(vida_media.evalf()), 4)

            pasos.append({
                "titulo": "Cálculo",
                "descripcion": f"Con k = {k_val}:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"t_{{1/2}} = \frac{{ln(2)}}{{{k_val}}} \\[10px]"
                    fr"t_{{1/2}} \approx {vida_media_final} \text{{ {unidad}}} \\[10px]"
                    fr"\text{{Cantidad en }} t_{{1/2}} = {N0} \cdot e^{{-{k_val} \cdot {vida_media_final}}} = \frac{{{N0}}}{{2}} = {N0/2}"
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Decaimiento Exponencial",
                "tipo": "vida_media",
                "resultado": f"{vida_media_final} {unidad}",
                "pasos": pasos
            }

        else:
            raise ValueError(f"Tipo de cálculo inválido: {tipo_calculo}")

    except (ValueError, KeyError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado: {str(e)}")
