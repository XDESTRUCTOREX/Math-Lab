from flask import Blueprint, request, jsonify
from modelos.mezclas import resolver_mezclas

mezclas_bp = Blueprint("mezclas", __name__)

@mezclas_bp.route("/resolver/mezclas", methods=["POST"])
def resolver_mezclas_route():
    try:
        datos = request.get_json()
        if not datos:
            return jsonify({
                "error": True,
                "mensaje": "Cuerpo de solicitud vacío o no es JSON válido",
                "pasos": []
            }), 400
        
        resultado = resolver_mezclas(datos)
        
        if resultado.get("error"):
            return jsonify(resultado), 400
        
        return jsonify(resultado), 200
    
    except Exception as e:
        return jsonify({
            "error": True,
            "mensaje": f"Error en el servidor: {str(e)}",
            "pasos": []
        }), 500