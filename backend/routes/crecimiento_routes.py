from flask import Blueprint, request, jsonify
from modelos.crecimiento import resolver_crecimiento

crecimiento_bp = Blueprint("crecimiento", __name__)

@crecimiento_bp.route("/resolver/crecimiento", methods=["POST"])
def resolver():
    try:
        datos = request.get_json()
        if not datos:
            return jsonify({
                "error": True,
                "mensaje": "Cuerpo de solicitud vacío o no es JSON válido",
                "pasos": []
            }), 400
        
        resultado = resolver_crecimiento(datos)
        
        if resultado.get("error"):
            return jsonify(resultado), 400
        
        return jsonify(resultado), 200
    
    except Exception as e:
        return jsonify({
            "error": True,
            "mensaje": f"Error en el servidor: {str(e)}",
            "pasos": []
        }), 500
