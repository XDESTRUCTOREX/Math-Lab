# backend/app.py

from flask import Flask, render_template
from flask_cors import CORS

from backend.routes.enfriamiento_routes import enfriamiento_bp
from backend.routes.mezclas_routes import mezclas_bp
from backend.routes.crecimiento_routes import crecimiento_bp
from backend.routes.decaimiento_routes import decaimiento_bp

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

CORS(app)

# =========================================
# FRONTEND
# =========================================

@app.route("/")
def inicio():
    return render_template("index.html")


# =========================================
# RUTAS API
# =========================================

app.register_blueprint(enfriamiento_bp)
app.register_blueprint(mezclas_bp)
app.register_blueprint(crecimiento_bp)
app.register_blueprint(decaimiento_bp)

# =========================================
# INICIAR SERVIDOR
# =========================================

if __name__ == "__main__":
    app.run(debug=True)