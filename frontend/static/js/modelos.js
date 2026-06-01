const modelos = {

    // =========================================
    // ENFRIAMIENTO
    // =========================================

    enfriamiento: {

        titulo: "Ley de Enfriamiento",

        tipos: [
            {
                value: "temperatura",
                texto: "Calcular temperatura"
            },
            {
                value: "tiempo",
                texto: "Calcular tiempo"
            }
        ],

        campos: [
            {
                label: "Temperatura ambiente",
                id: "ambiente",
                type: "number"
            },
            {
                label: "Temperatura inicial",
                id: "inicial",
                type: "number"
            },
            {
                label: "Temperatura medida",
                id: "medida",
                type: "number"
            },
            {
                label: "Tiempo medido",
                id: "tiempo_medida",
                type: "number"
            },
            {
                label: "Unidad de tiempo (ej. minutos, horas)",
                id: "unidad_tiempo_enfriamiento",
                type: "text"
            }
        ]
    },

    // =========================================
    // MEZCLAS
    // =========================================

    mezclas: {

        titulo: "Modelo de Mezclas - volumen constante",

        tipos: [
            {
                value: "infinito",
                texto: "Tiempo infinito"
            },
            {
                value: "cantidad",
                texto: "Calcular cantidad"
            },
            {
                value: "tiempo",
                texto: "Calcular tiempo"
            }
        ],

        campos: [
            {
                label: "Volumen inicial del tanque",
                id: "volumen",
                type: "number"
            },
            {
                label: "Cantidad inicial de sustancia (opcional)",
                id: "cantidad_inicial",
                type: "number"
            },
            {
                label: "Concentración inicial (opcional)",
                id: "concentracion_inicial",
                type: "number"
            },
            {
                label: "Caudal de entrada",
                id: "caudal_entrada",
                type: "number"
            },
            {
                label: "Concentración de entrada",
                id: "concentracion_entrada",
                type: "number"
            },
            {
                label: "Caudal de salida",
                id: "caudal_salida",
                type: "number"
            },
            {
                label: "Unidad de tiempo (ej. minutos, segundos)",
                id: "unidad_tiempo_mezclas",
                type: "text"
            }
        ]
    },

    // =========================================
    // CRECIMIENTO
    // =========================================

    crecimiento: {

        titulo: "Crecimiento Exponencial",

        tipos: [
            {
                value: "cantidad",
                texto: "Calcular cantidad"
            },
            {
                value: "tiempo",
                texto: "Calcular tiempo"
            },
            {
                value: "duplicacion",
                texto: "Tiempo de duplicación"
            }
        ],

        campos: [
            {
                label: "Cantidad inicial",
                id: "cantidad_inicial",
                type: "number"
            },
            {
                label: "Unidad de tiempo (ej. horas, días)",
                id: "unidad_tiempo_crecimiento",
                type: "text"
            },
            {
                label: "Modo para constante k",
                id: "modo_k",
                type: "radio",
                opciones: [
                    { value: "directo", label: "Ingresar k directamente" },
                    { value: "dos_puntos", label: "Calcular k desde dos mediciones" }
                ],
                default: "directo"
            },
            {
                label: "Constante de crecimiento (k)",
                id: "constante_crecimiento",
                type: "number"
            },
            {
                label: "Tiempo de la medición (t1)",
                id: "t1",
                type: "number"
            },
            {
                label: "Población en t1 (p1)",
                id: "p1",
                type: "number"
            }
        ]
    },

    // =========================================
    // DECAIMIENTO
    // =========================================

    decaimiento: {

        titulo: "Decaimiento Exponencial",

        tipos: [
            {
                value: "cantidad",
                texto: "Calcular cantidad"
            },
            {
                value: "tiempo",
                texto: "Calcular tiempo"
            },
            {
                value: "vida_media",
                texto: "Vida media"
            }
        ],

        campos: [
            {
                label: "Cantidad inicial",
                id: "cantidad_inicial",
                type: "number"
            },
            {
                label: "Unidad de tiempo (ej. años, días)",
                id: "unidad_tiempo_decaimiento",
                type: "text"
            },
            {
                label: "Modo para constante k",
                id: "modo_k",
                type: "radio",
                opciones: [
                    { value: "directo", label: "Ingresar k directamente" },
                    { value: "dos_puntos", label: "Calcular k desde dos mediciones" }
                ],
                default: "directo"
            },
            {
                label: "Constante de decaimiento (k)",
                id: "constante_decaimiento",
                type: "number"
            },
            {
                label: "Tiempo de la medición (t1)",
                id: "t1",
                type: "number"
            },
            {
                label: "Cantidad en t1 (n1)",
                id: "n1",
                type: "number"
            }
        ]
    },

    // =========================================
    // LINEALES
    // =========================================

    lineales: {

        titulo: "Ecuaciones Diferenciales Lineales (y' + P(x)y = Q(x))",

        tipos: [
            {
                value: "general",
                texto: "Solución general"
            },
            {
                value: "particular",
                texto: "Solución particular"
            }
        ],

        campos: [
            {
                label: "Coeficiente P(x)",
                id: "p_expr",
                type: "text"
            },
            {
                label: "Término Q(x)",
                id: "q_expr",
                type: "text"
            }
        ]
    },

    // =========================================
    // EXACTAS
    // =========================================

    exactas: {

        titulo: "Ecuaciones Diferenciales Exactas (M(x,y)dx + N(x,y)dy = 0)",

        tipos: [
            {
                value: "general",
                texto: "Solución general"
            },
            {
                value: "particular",
                texto: "Solución particular"
            }
        ],

        campos: [
            {
                label: "Función M(x, y)",
                id: "m_expr",
                type: "text"
            },
            {
                label: "Función N(x, y)",
                id: "n_expr",
                type: "text"
            }
        ]
    }
};