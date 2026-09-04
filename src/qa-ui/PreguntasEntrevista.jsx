import React, { useState } from 'react';

/**
 * COMPONENTE REUTILIZABLE: PUÑADO DE PREGUNTAS Y RESPUESTAS
 * 
 * Este componente renderiza una lista de preguntas de entrevista con
 * respuestas "sugeridas". Permite mostrar/ocultar cada respuesta.
 * 
 * Props:
 * - titulo: Título de la sección
 * - descripcion: Breve descripción
 * - preguntas: Array de objetos { pregunta, respuesta, consejo }
 */

const colores = {
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #007bff'
};

export default function PreguntasEntrevista({ titulo, descripcion, preguntas }) {
  const [respuestaAbierta, setRespuestaAbierta] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const toggleRespuesta = (index) => {
    setRespuestaAbierta(respuestaAbierta === index ? null : index);
  };

  const toggleTodas = () => {
    setMostrarTodas(!mostrarTodas);
    if (!mostrarTodas) {
      setRespuestaAbierta(null);
    }
  };

  const todasVisibles = mostrarTodas;

  return (
    <div className="modulo">
      <h1>{titulo}</h1>
      {descripcion && (
        <p className="descripcion">
          {descripcion}
          <br />
          <small style={{ color: '#666' }}>
            Haz clic en cada pregunta para ver la respuesta recomendada.
          </small>
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={toggleTodas}
          style={{
            padding: '10px 20px',
            backgroundColor: todasVisibles ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {todasVisibles ? 'Ocultar todas las respuestas' : 'Mostrar todas las respuestas'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {preguntas.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd',
              overflow: 'hidden'
            }}
          >
            {/* Pregunta */}
            <button
              onClick={() => toggleRespuesta(index)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#333', fontSize: '15px' }}>
                <span style={{ color: '#007bff', marginRight: '8px' }}>Q{index + 1}.</span>
                {item.pregunta}
              </span>
              <span
                style={{
                  fontSize: '20px',
                  color: '#007bff',
                  transform: respuestaAbierta === index ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              >
                +
              </span>
            </button>

            {/* Respuesta */}
            {(respuestaAbierta === index || todasVisibles) && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={colores}>
                  <p style={{ margin: '0', padding: '15px', color: '#333', lineHeight: '1.7' }}>
                    {item.respuesta}
                  </p>
                </div>

                {item.consejo && (
                  <div style={{ marginTop: '10px' }}>
                    <p
                      style={{
                        margin: '0',
                        padding: '12px 15px',
                        backgroundColor: '#fff8e1',
                        borderLeft: '4px solid #ff9800',
                        borderRadius: '4px',
                        color: '#555',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                    >
                      <strong>💡 Consejo:</strong> {item.consejo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}