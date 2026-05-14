from sympy import (
    symbols, exp, Eq, solve,
    Symbol, Function, latex
)
from sympy import ln
from backend.utils.validacion import (
    validar_numero, validar_campo_requerido, crear_respuesta_error
)

def resolver_enfriamiento(datos):

    pasos = []

    try:
        # =========================
        # VALIDAR CAMPOS REQUERIDOS
        # =========================

        validar_campo_requerido(datos, "ambiente")
        validar_campo_requerido(datos, "inicial")
        validar_campo_requerido(datos, "medida")
        validar_campo_requerido(datos, "tiempo_medida")
        validar_campo_requerido(datos, "tipo_calculo")

        # =========================
        # DATOS
        # =========================

        Ta = validar_numero(datos["ambiente"], "Temperatura ambiente")
        T0 = validar_numero(datos["inicial"], "Temperatura inicial")
        Tm = validar_numero(datos["medida"], "Temperatura medida")
        tm = validar_numero(datos["tiempo_medida"], "Tiempo medido")

        # Validaciones físicas
        if tm <= 0:
            raise ValueError("El tiempo medido debe ser positivo")
        
        if Ta >= T0:
            raise ValueError("La temperatura ambiente debe ser menor a la temperatura inicial (para enfriamiento)")

        # =========================
        # TIPO DE CÁLCULO
        # =========================

        tipo_calculo = datos["tipo_calculo"]

        # =========================
        # VARIABLES SIMBÓLICAS
        # =========================

        t, k, C = symbols('t k C')

        # =========================
        # MODELO GENERAL
        # =========================

        modelo = Ta + C * exp(-k*t)

        # =========================
        # MODELO DIFERENCIAL
        # =========================

        pasos.append({
            "titulo": "Modelo diferencial",
            "descripcion": "La ley de enfriamiento de Newton se modela mediante:",
            "latex": r"\frac{dT}{dt}=-k(T-Ta)"
        })

        # =========================
        # SOLUCIÓN GENERAL
        # =========================

        pasos.append({
            "titulo": "Solución general",
            "descripcion": "Resolviendo la ecuación diferencial:",
            "latex": 
                fr"\begin{{gathered}}"
                fr"\frac{{dT}}{{dt}}=-k(T-{Ta}) \\[10px]"
                fr"\frac{{dT}}{{T-{Ta}}}=-kdt \\[10px]"
                fr"\int \frac{{dT}}{{T-{Ta}}}=\int -kdt \\[10px]"
                fr"\ln|T-{Ta}|=-kt+C_1 \\[10px]"
                fr"T-{Ta}=e^{{-kt+C_1}} \\[10px]"
                fr"T-{Ta}=Ce^{{-kt}} \\[10px]"
                fr"\boxed{{T(t)={Ta}+Ce^{{-kt}}}}"
                fr"\end{{gathered}}"
        })

        # =========================
        # CALCULAR C
        # =========================

        ecuacion_C = Eq(T0, Ta + C)

        pasos.append({
            "titulo": "Condición inicial",
            "descripcion": f"Se sustituye T(0) = {T0}",
            "latex": latex(ecuacion_C)
        })

        valor_C = solve(ecuacion_C, C)[0]

        pasos.append({
            "titulo": "Despeje de C",
            "descripcion": "Se despeja la constante C:",
            "latex": 
                fr"\begin{{gathered}}"
                fr"C = {T0} - {Ta} \\[10px]"
                + latex(Eq(Symbol("C"), round(float(valor_C.evalf()), 4)))
                + fr"\end{{gathered}}"
        })

        # =========================
        # CALCULAR K
        # =========================

        ecuacion_k = Eq(Tm, Ta + valor_C * exp(-k*tm))

        pasos.append({
            "titulo": "Sustitución para encontrar k",
            "descripcion": f"Se sustituye T({tm}) = {Tm}",
            "latex": latex(ecuacion_k)
        })

        solucion_k = solve(ecuacion_k, k)

        if not solucion_k:
            raise ValueError("No se pudo calcular k")

        valor_k = solucion_k[0]

        pasos.append({
            "titulo": "Despeje de k",
            "descripcion": "Se despeja la constante de enfriamiento:",
            "latex": 
                fr"\begin{{gathered}}"
                fr"{Tm} = {Ta} + ({round(float(valor_C),4)})e^{{-k({tm})}} \\[10px]"
                fr"{Tm-Ta} = ({round(float(valor_C),4)})e^{{-k({tm})}} \\[10px]"
                fr"e^{{-k({tm})}}=\frac{{{Tm-Ta}}}{{{round(float(valor_C),4)}}} \\[10px]"
                fr"-k({tm})=ln\left(\frac{{{Tm-Ta}}}{{{round(float(valor_C),4)}}}\right) \\[10px]"
                fr"k=-\frac{{1}}{{{tm}}}"
                fr"ln\left(\frac{{{Tm-Ta}}}{{{round(float(valor_C),4)}}}\right) \\[10px]"
                + latex(Eq(Symbol("k"), round(float(valor_k.evalf()), 4)))
                + fr"\end{{gathered}}"
        })

        # =========================
        # FUNCIÓN FINAL
        # =========================

        funcion_final = modelo.subs({C: valor_C, k: valor_k})
        funcion_visual = modelo.subs({
            C: round(float(valor_C.evalf()), 4),
            k: round(float(valor_k.evalf()), 4)
        })

        pasos.append({
            "titulo": "Función final",
            "descripcion": "La función de temperatura queda:",
            "latex": latex(Eq(Function('T')(t), funcion_visual))
        })

        # ==================================================
        # CALCULAR TEMPERATURA
        # ==================================================

        if tipo_calculo == "temperatura":

            if "tiempo_buscar" not in datos:
                raise ValueError("Campo requerido 'tiempo_buscar' no encontrado")
            
            t_buscar = validar_numero(datos["tiempo_buscar"], "Tiempo a buscar")
            
            if t_buscar < 0:
                raise ValueError("El tiempo a buscar no puede ser negativo")

            resultado = funcion_final.subs(t, t_buscar)
            resultado_final = round(float(resultado.evalf()), 2)

            pasos.append({
                "titulo": "Evaluación final",
                "descripcion": f"Se evalúa la función en t = {t_buscar}",
                "latex": latex(Eq(Function('T')(t_buscar), resultado_final))
            })

            return {
                "modelo": "Ley de Enfriamiento",
                "tipo": "temperatura",
                "resultado": resultado_final,
                "pasos": pasos
            }

        # ==================================================
        # CALCULAR TIEMPO
        # ==================================================

        elif tipo_calculo == "tiempo":

            if "temperatura_objetivo" not in datos:
                raise ValueError("Campo requerido 'temperatura_objetivo' no encontrado")
            
            temperatura_objetivo = validar_numero(
                datos["temperatura_objetivo"],
                "Temperatura objetivo"
            )

            if temperatura_objetivo <= Ta:
                raise ValueError("La temperatura objetivo debe ser mayor que la temperatura ambiente")

            if temperatura_objetivo >= T0:
                raise ValueError("La temperatura objetivo debe ser menor que la temperatura inicial (enfriamiento)")

            ecuacion_tiempo = Eq(temperatura_objetivo, funcion_final)

            pasos.append({
                "titulo": "Planteamiento",
                "descripcion": f"Se sustituye T(t) = {temperatura_objetivo}",
                "latex": latex(ecuacion_tiempo)
            })

            tiempo_resultado = (
                -ln((temperatura_objetivo - Ta) / valor_C) / valor_k
            )
        
            tiempo_final = round(float(tiempo_resultado.evalf()), 2)

            pasos.append({
                "titulo": "Despeje del tiempo",
                "descripcion": "Se despeja el valor de t:",
                "latex": 
                    fr"\begin{{gathered}}"
                    fr"{temperatura_objetivo} = "
                    fr"{round(float(Ta),4)} + "
                    fr"{round(float(valor_C),4)}"
                    fr"e^{{-{round(float(valor_k),4)}t}} \\[10px]"
                    fr"{temperatura_objetivo-Ta}="
                    fr"{round(float(valor_C),4)}"
                    fr"e^{{-{round(float(valor_k),4)}t}} \\[10px]"
                    fr"\frac{{{temperatura_objetivo-Ta}}}"
                    fr"{{{round(float(valor_C),4)}}}"
                    fr"=e^{{-{round(float(valor_k),4)}t}} \\[10px]"
                    fr"ln\left("
                    fr"\frac{{{temperatura_objetivo-Ta}}}"
                    fr"{{{round(float(valor_C),4)}}}"
                    fr"\right)"
                    fr"=-{round(float(valor_k),4)}t \\[10px]"
                    fr"t="
                    fr"\frac{{ln\left("
                    fr"\frac{{{temperatura_objetivo-Ta}}}"
                    fr"{{{round(float(valor_C),4)}}}"
                    fr"\right)}}"
                    fr"{{-{round(float(valor_k),4)}}}"
                    fr"\\[10px]"
                    + latex(Eq(Symbol("t"), tiempo_final))
                    + fr"\end{{gathered}}"
            })

            return {
                "modelo": "Ley de Enfriamiento",
                "tipo": "tiempo",
                "resultado": tiempo_final,
                "pasos": pasos
            }

        else:
            raise ValueError(f"Tipo de cálculo inválido: {tipo_calculo}")

    except (ValueError, KeyError) as e:
        return crear_respuesta_error(str(e))
    except Exception as e:
        return crear_respuesta_error(f"Error inesperado: {str(e)}")
