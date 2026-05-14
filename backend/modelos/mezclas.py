from sympy import *
from sympy import ln
from backend.utils.validacion import (
    validar_numero, validar_positivo, validar_no_negativo, 
    validar_campo_requerido, crear_respuesta_error
)

def resolver_mezclas(datos):

    pasos = []

    try:

        # =====================================================
        # VALIDAR CAMPOS REQUERIDOS
        # =====================================================
        validar_campo_requerido(datos, "volumen")
        validar_campo_requerido(datos, "caudal_entrada")
        validar_campo_requerido(datos, "concentracion_entrada")
        validar_campo_requerido(datos, "caudal_salida")
        validar_campo_requerido(datos, "tipo_calculo")

        # =====================================================
        # DATOS
        # =====================================================

        V = validar_positivo(datos["volumen"], "Volumen")

        # ENTRADA
        re = validar_positivo(datos["caudal_entrada"], "Caudal de entrada")
        ce = validar_no_negativo(datos["concentracion_entrada"], "Concentración de entrada")

        # SALIDA
        rs = validar_positivo(datos["caudal_salida"], "Caudal de salida")

        tipo_calculo = datos["tipo_calculo"]

        # =====================================================
        # CANTIDAD INICIAL (Manejo de Concentración vs Cantidad)
        # =====================================================
        if datos.get("cantidad_inicial") not in ["", None]:
            Q0 = validar_no_negativo(datos["cantidad_inicial"], "Cantidad inicial")
        elif datos.get("concentracion_inicial") not in ["", None]:
            conc_inicial = validar_no_negativo(datos["concentracion_inicial"], "Concentración inicial")
            Q0 = conc_inicial * V
        else:
            Q0 = 0.0

    # =====================================================
    # VARIABLES SIMBÓLICAS
    # =====================================================

        t, A = symbols('t A')
    
        # =====================================================
        # VOLUMEN VARIABLE
        # =====================================================
    
        volumen_variable = datos.get("volumen_variable", "")
    
        if volumen_variable == "" or volumen_variable is None:
            volumen_variable = False
        else:
            volumen_variable = True
    
        # =====================================================
        # CASO 1: VOLUMEN CONSTANTE
        # =====================================================
    
        if volumen_variable == False:
        
            # =====================================================
            # MODELO DIFERENCIAL
            # =====================================================
    
            pasos.append({
                "titulo": "Modelo diferencial",
                "descripcion": "El modelo general de mezclas establece que el cambio de la cantidad de sustancia es igual a lo que entra menos lo que sale:",
                "latex": r"\frac{dQ}{dt}=\text{Entrada} - \text{Salida}"
            })
    
            # =====================================================
            # ENTRADA Y SALIDA
            # =====================================================
    
            entrada = re * ce
            k = rs / V
    
            pasos.append({
                "titulo": "Tasas del sistema",
                "descripcion": "Se calculan las tasas de entrada (E) y la constante de proporcionalidad de salida (k):",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"E = r_e \cdot c_e = ({re})({ce}) = {round(entrada,4)} \\[10px]"
                    fr"k = \frac{{r_s}}{{V}} = \frac{{{rs}}}{{{V}}} = {round(k,4)}"
                    fr"\end{{gathered}}"
    
            })
    
            # =====================================================
            # ECUACION DIFERENCIAL
            # =====================================================
    
            pasos.append({
                "titulo": "Ecuación diferencial",
                "descripcion": "Sustituyendo las tasas, la salidad es kQ. La ecuación queda:",
                "latex": 
                    fr"\frac{{dQ}}{{dt}} = {round(entrada,4)} - {round(k,4)}Q"
            })
    
            # =====================================================
            # SOLUCION GENERAL (Paso a paso)
            # =====================================================
    
            equilibrio = entrada / k
    
            pasos.append({
                "titulo": "Solución general",
                "descripcion": "Resolviendo la ecuación diferencial lineal de primer orden mediante factor integrante:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"\frac{{dQ}}{{dt}} + {round(k,4)}Q = {round(entrada,4)} \\[10px]"
                    fr"\mu(t) = e^{{\int {round(k,4)} dt}} = e^{{{round(k,4)}t}} \\[10px]"
                    fr"e^{{{round(k,4)}t}} \frac{{dQ}}{{dt}} + {round(k,4)}e^{{{round(k,4)}t}}Q = {round(entrada,4)}e^{{{round(k,4)}t}} \\[10px]"
                    fr"\frac{{d}}{{dt}}(Qe^{{{round(k,4)}t}}) = {round(entrada,4)}e^{{{round(k,4)}t}} \\[10px]"
                    fr"\int \frac{{d}}{{dt}}(Qe^{{{round(k,4)}t}}) dt = \int {round(entrada,4)}e^{{{round(k,4)}t}} dt \\[10px]"
                    fr"Qe^{{{round(k,4)}t}} = \frac{{{round(entrada,4)}}}{{{round(k,4)}}}e^{{{round(k,4)}t}} + A \\[10px]"
                    fr"Qe^{{{round(k,4)}t}} = {round(equilibrio,4)}e^{{{round(k,4)}t}} + A \\[10px]"
                    fr"\boxed{{Q(t) = {round(equilibrio,4)} + Ae^{{-{round(k,4)}t}}}}"
                    fr"\end{{gathered}}"
            })
    
            # =====================================================
            # CALCULAR A
            # =====================================================
    
            ecuacion_A = Eq(Q0, equilibrio + A)
    
            pasos.append({
                "titulo": "Condición inicial",
                "descripcion": f"Se sustituye t=0 y Q(0)={Q0}:",
                "latex": latex(ecuacion_A)
            })
    
            valor_A = solve(ecuacion_A, A)[0]
    
            pasos.append({
                "titulo": "Despeje de A",
                "descripcion": "Se despeja la constante A:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"A = {Q0} - {round(equilibrio,4)} \\[10px]"
                    fr"A = {round(float(valor_A),4)}"
                    fr"\end{{gathered}}"
            })
    
            # =====================================================
            # FUNCION FINAL
            # =====================================================
    
            modelo = equilibrio + A*exp(-k*t)
            funcion_final = modelo.subs({A: valor_A})
            funcion_visual = modelo.subs({A: round(float(valor_A),4)})
    
            pasos.append({
                "titulo": "Función final",
                "descripcion": "Sustituyendo A en la ecuación, la función de Cantidad Q(t) queda:",
                "latex": latex(Eq(Symbol("Q(t)"), funcion_visual))
            })
    
            # =====================================================
            # CALCULAR CANTIDAD / CONCENTRACION EN UN TIEMPO
            # =====================================================
    
            if tipo_calculo == "cantidad":
            
                if "tiempo_buscar" not in datos:
                    raise ValueError("Campo requerido 'tiempo_buscar' no encontrado")
                
                t_buscar = validar_no_negativo(datos["tiempo_buscar"], "Tiempo a buscar")
    
                resultado = funcion_final.subs(t, t_buscar)
                resultado_final = round(float(resultado.evalf()), 4)
                concentracion_final = round(resultado_final / V, 6)
    
                pasos.append({
                    "titulo": "Evaluación final",
                    "descripcion": f"Se evalúa la función en t={t_buscar}:",
                    "latex": 
                        fr"\begin{{gathered}}"
                        fr"Q({t_buscar}) = {round(equilibrio,4)} + ({round(float(valor_A),4)})e^{{-{round(k,4)}({t_buscar})}} \\[10px]"
                        + latex(Eq(Symbol(f"Q({t_buscar})"), resultado_final))
                        + fr"\\[10px]"
                        + fr"\text{{Concentración: }} C = \frac{{Q}}{{V}} = \frac{{{resultado_final}}}{{{V}}} = {concentracion_final}"
                        + fr"\end{{gathered}}"
                })
    
                return {
                    "modelo": "Mezclas",
                    "tipo": "cantidad",
                    "resultado": resultado_final,
                    "concentracion": concentracion_final,
                    "pasos": pasos
                }
    
            # =====================================================
            # CALCULAR TIEMPO
            # =====================================================
    
            elif tipo_calculo == "tiempo":
            
                if datos.get("cantidad_objetivo") not in ["", None]:
                    cantidad_objetivo = validar_no_negativo(datos["cantidad_objetivo"], "Cantidad objetivo")
                elif datos.get("concentracion_objetivo") not in ["", None]:
                    conc_objetivo = validar_no_negativo(datos["concentracion_objetivo"], "Concentración objetivo")
                    cantidad_objetivo = conc_objetivo * V
                else:
                    raise ValueError("Debe proporcionar cantidad_objetivo o concentracion_objetivo")
    
                pasos.append({
                    "titulo": "Planteamiento",
                    "descripcion": f"Se sustituye Q(t)={cantidad_objetivo}:",
                    "latex": 
                        fr"{cantidad_objetivo} = {round(equilibrio,4)} + ({round(float(valor_A),4)})e^{{-{round(k,4)}t}}"
                })
    
                # Validación de valores inalcanzables
                objetivo_alcanzable = True
                if abs(cantidad_objetivo - equilibrio) < 1e-9:
                    tiempo_final = float('inf')
                elif (cantidad_objetivo - equilibrio) / valor_A <= 0:
                    objetivo_alcanzable = False
                    tiempo_final = None
                else:
                    tiempo_resultado = -ln((cantidad_objetivo - equilibrio) / valor_A) / k
                    tiempo_final = round(float(tiempo_resultado.evalf()), 2)
    
                if not objetivo_alcanzable:
                    pasos.append({
                        "titulo": "Valor inalcanzable",
                        "descripcion": "La cantidad/concentración objetivo es inalcanzable según las condiciones del problema.",
                        "latex": r"\text{El sistema tiende a } " + str(round(equilibrio, 4)) + r", \text{ por lo tanto el objetivo nunca se alcanzará.}"
                    })
                    return {
                        "modelo": "Mezclas",
                        "tipo": "tiempo",
                        "resultado": "Inalcanzable",
                        "pasos": pasos
                    }
    
                pasos.append({
                    "titulo": "Despeje del tiempo",
                    "descripcion": "Se despeja el valor de t paso a paso:",
                    "latex": 
                        fr"\begin{{gathered}}"
                        fr"{cantidad_objetivo} = {round(equilibrio,4)} + ({round(float(valor_A),4)})e^{{-{round(k,4)}t}} \\[10px]"
                        fr"{round(cantidad_objetivo-round(equilibrio,4),4)} = ({round(float(valor_A),4)})e^{{-{round(k,4)}t}} \\[10px]"
                        fr"e^{{-{round(k,4)}t}} = \frac{{{round(cantidad_objetivo-round(equilibrio,4),4)}}}{{{round(float(valor_A),4)}}} \\[10px]"
                        fr"ln\left( \frac{{{round(cantidad_objetivo-round(equilibrio,4),4)}}}{{{round(float(valor_A),4)}}} \right) = -{round(k,4)}t \\[10px]"
                        fr"t = \frac{{ln\left( \frac{{{round(cantidad_objetivo-round(equilibrio,4),4)}}}{{{round(float(valor_A),4)}}} \right)}}{{-{round(k,4)}}} \\[10px]"
                        + latex(Eq(Symbol("t"), tiempo_final))
                        + fr"\end{{gathered}}"
                })
    
                return {
                    "modelo": "Mezclas",
                    "tipo": "tiempo",
                    "resultado": tiempo_final,
                    "pasos": pasos
                }
    
            # =====================================================
            # LIMITE
            # =====================================================
    
            elif tipo_calculo == "infinito":
            
                limite = limit(funcion_final, t, oo)
                limite_final = round(float(limite), 4)
                concentracion_limite = round(limite_final / V, 6)
    
                pasos.append({
                    "titulo": "Límite cuando t tiende a infinito",
                    "descripcion": "Se calcula el comportamiento del sistema cuando el tiempo crece indefinidamente:",
                    "latex": 
                        fr"\begin{{gathered}}"
                        fr"Q(t) = {round(equilibrio,4)} + ({round(float(valor_A),4)})e^{{-{round(k,4)}t}} \\[10px]"
                        fr"\lim_{{t\to\infty}} e^{{-{round(k,4)}t}} = 0 \\[10px]"
                        fr"\lim_{{t\to\infty}} Q(t) = {round(equilibrio,4)} \\[10px]"
                        fr"\boxed{{\lim_{{t\to\infty}} Q(t) = {limite_final}}} \\[10px]"
                        fr"\text{{Concentración límite: }} C = \frac{{{limite_final}}}{{{V}}} = {concentracion_limite}"
                        fr"\end{{gathered}}"
                })
    
                return {
                    "modelo": "Mezclas",
                    "tipo": "infinito",
                    "resultado": limite_final,
                    "concentracion": concentracion_limite,
                    "pasos": pasos
                }
    
        # =====================================================
        # CASO 2: VOLUMEN VARIABLE
        # =====================================================
    
        else:
        
            Vt = V + (re - rs)*t
    
            pasos.append({
                "titulo": "Volumen variable",
                "descripcion": "El volumen cambia con el tiempo:",
                "latex": fr"V(t) = {V} + ({re}-{rs})t"
            })
    
            pasos.append({
                "titulo": "Modelo diferencial",
                "descripcion": "La ecuación diferencial queda:",
                "latex": fr"\frac{{dQ}}{{dt}} = {round(re*ce,4)} - \frac{{{rs}Q}}{{{V}+({re}-{rs})t}}"
            })
    
            return {
                "modelo": "Mezclas",
                "tipo": "volumen_variable",
                "resultado": "Modelo con volumen variable detectado",
                "pasos": pasos
            }

    except (ValueError, KeyError, ZeroDivisionError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado: {str(e)}")