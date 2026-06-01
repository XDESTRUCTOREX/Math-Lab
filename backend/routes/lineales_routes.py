from flask import Blueprint, request, jsonify
from backend.modelos.lineales import resolver_lineales

lineales_bp = Blueprint("lineales", __name__)

@lineales_bp.route("/resolver/lineales", methods=["POST"])
def resolver():
    try:
        datos = request.get_json()
        if not datos:
            return jsonify({
                "error": True,
                "mensaje": "Cuerpo de solicitud vacío o no es JSON válido",
                "pasos": []
            }), 400
        
        resultado = resolver_lineales(datos)
        
        if resultado.get("error"):
            return jsonify(resultado), 400
        
        return jsonify(resultado), 200
    
    except Exception as e:
        return jsonify({
            "error": True,
            "mensaje": f"Error en el servidor: {str(e)}",
            "pasos": []
        }), 500
