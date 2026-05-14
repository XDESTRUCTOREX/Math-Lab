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

            // =====================================
            // TANQUE
            // =====================================

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

            // =====================================
            // ENTRADA
            // =====================================

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
                label: "Constante de crecimiento (k)",
                id: "constante_crecimiento",
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
                label: "Constante de decaimiento (k)",
                id: "constante_decaimiento",
                type: "number"
            }
        ]
    }
};