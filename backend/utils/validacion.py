# utils/validacion.py
"""Utilidades de validación para los modelos"""

import re

def validar_numero(valor, nombre_campo):
    """
    Valida que un valor pueda convertirse a float.
    Lanza ValueError si no es posible.
    """
    try:
        if valor is None or valor == "":
            raise ValueError(f"{nombre_campo} no puede estar vacío")
        num = float(valor)
        return num
    except (ValueError, TypeError) as e:
        raise ValueError(f"{nombre_campo} debe ser un número válido: {str(e)}")


def validar_positivo(valor, nombre_campo):
    """Valida que un número sea positivo"""
    num = validar_numero(valor, nombre_campo)
    if num <= 0:
        raise ValueError(f"{nombre_campo} debe ser positivo (recibido: {num})")
    return num


def validar_no_negativo(valor, nombre_campo):
    """Valida que un número sea no negativo"""
    num = validar_numero(valor, nombre_campo)
    if num < 0:
        raise ValueError(f"{nombre_campo} no puede ser negativo (recibido: {num})")
    return num


def validar_campo_requerido(datos, campo):
    """Valida que un campo exista en el diccionario"""
    if campo not in datos:
        raise ValueError(f"Campo requerido '{campo}' no encontrado")
    return datos[campo]


def normalizar_expresion_simbolica(expresion):
    """Convierte multiplicación implícita a multiplicación explícita para SymPy."""
    if expresion is None:
        return expresion
    expresion = expresion.replace(" ", "")
    expresion = re.sub(r'(?<=[0-9])(?=[A-Za-z\(])', '*', expresion)
    expresion = re.sub(r'(?<=[A-Za-z\)])(?=[A-Za-z\(0-9])', '*', expresion)
    return expresion


def crear_respuesta_error(mensaje):
    """Crea una respuesta de error estructurada"""
    return {
        "error": True,
        "mensaje": mensaje,
        "pasos": []
    }
