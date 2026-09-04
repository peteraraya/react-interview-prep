import React, { useState, useEffect, useMemo } from 'react';
import { MAPA_CODIGO } from './rawSources';

/**
 * CODE VIEWER - Vista de código fuente (pestaña "Código")
 * 
 * Muestra el código fuente real de la lección actual (Example / Challenge / preguntas)
 * como contenido dentro de la página, usando imports ?raw de Vite (sin dependencias).
 * 
 * Características:
 * - Selector para alternar entre Example.jsx, Challenge.jsx y preguntas.jsx
 * - Botón para copiar el código al portapapeles
 * - Numeración de líneas y scroll
 * - Tema oscuro (Dracula) para máxima legibilidad
 */

const NOMBRES_ARCHIVO = {
  ejemplo: 'Example',
  desafio: 'Challenge',
  preguntas: 'preguntas'
};

const COLORES = {
  panelBg: '#1e1e2e',
  headerBg: '#282a36',
  texto: '#f8f8f2',
  comentario: '#6272a4',
  primary: '#bd93f9',
  primaryDark: '#8be9fd',
  borde: '#44475a'
};

const btnBase = {
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  padding: '8px 14px',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

export default function CodeViewer({ moduloId, tipoContenido }) {
  const [archivoVisible, setArchivoVisible] = useState('ejemplo');
  const [copiado, setCopiado] = useState(false);

  // Si vengo de una pestaña (ejemplo/desafio/preguntas), mostrar ese archivo
  useEffect(() => {
    if (['ejemplo', 'desafio', 'preguntas'].includes(tipoContenido)) {
      setArchivoVisible(tipoContenido);
    }
  }, [tipoContenido]);

  // Fuente del código actual
  const codigoActual = useMemo(() => {
    const nombreArchivo = NOMBRES_ARCHIVO[archivoVisible] || 'Example';
    return MAPA_CODIGO[`${moduloId}/${nombreArchivo}`] || '';
  }, [moduloId, archivoVisible]);

  const totalLineas = useMemo(() => {
    if (!codigoActual) return 0;
    return codigoActual.split('\n').length;
  }, [codigoActual]);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoActual);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const archivosDisponibles = ['ejemplo', 'desafio', 'preguntas'];
  const etiquetas = {
    ejemplo: 'Example',
    desafio: 'Challenge',
    preguntas: 'Preguntas'
  };

  return (
    <div
      style={{
        backgroundColor: COLORES.panelBg,
        color: COLORES.texto,
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ===== Header ===== */}
      <div
        style={{
          backgroundColor: COLORES.headerBg,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: `1px solid ${COLORES.borde}`,
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '18px', color: COLORES.primaryDark }}>💻</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            Código fuente de la lección
          </div>
          <div style={{ fontSize: '12px', color: COLORES.comentario, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            src/{moduloId}/{etiquetas[archivoVisible]}.jsx
          </div>
        </div>
        <button
          onClick={copiarCodigo}
          style={{
            ...btnBase,
            backgroundColor: copiado ? '#50fa7b' : COLORES.primary,
            color: copiado ? '#1e1e2e' : 'white'
          }}
        >
          {copiado ? '✅ Copiado' : '📋 Copiar código'}
        </button>
      </div>

      {/* ===== Selector de archivo ===== */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 16px',
          borderBottom: `1px solid ${COLORES.borde}`,
          flexWrap: 'wrap'
        }}
      >
        {archivosDisponibles.map(f => (
          <button
            key={f}
            onClick={() => setArchivoVisible(f)}
            style={{
              ...btnBase,
              backgroundColor: archivoVisible === f ? COLORES.primaryDark : 'transparent',
              color: archivoVisible === f ? '#1e1e2e' : COLORES.comentario,
              border: `1px solid ${archivoVisible === f ? COLORES.primaryDark : COLORES.borde}`,
              fontSize: '12px',
              padding: '6px 12px'
            }}
          >
            {etiquetas[f]}.jsx
          </button>
        ))}
      </div>

      {/* ===== Contenido del código ===== */}
      <div style={{ maxHeight: '600px', overflow: 'auto', padding: '12px 0', paddingRight: '10px' }}>
        <pre
          style={{
            margin: 0,
            fontSize: '12.5px',
            lineHeight: '1.6',
            fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace"
          }}
        >
          {codigoActual.split('\n').map((linea, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                minHeight: '20px',
                whiteSpace: 'pre'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '44px',
                  minWidth: '44px',
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingRight: '12px',
                  color: COLORES.comentario,
                  userSelect: 'none',
                  backgroundColor: '#242434'
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: COLORES.texto, flex: 1, paddingLeft: '12px' }}>
                {linea || ' '}
              </span>
            </div>
          ))}
        </pre>

        {!codigoActual && (
          <div style={{ padding: '30px', textAlign: 'center', color: COLORES.comentario }}>
            No hay código disponible para este archivo.
          </div>
        )}
      </div>

      {/* ===== Footer ===== */}
      <div
        style={{
          padding: '8px 16px',
          backgroundColor: COLORES.headerBg,
          fontSize: '12px',
          color: COLORES.comentario,
          borderTop: `1px solid ${COLORES.borde}`,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <span>{totalLineas} líneas</span>
        <span>Fuente local · Vite ?raw</span>
      </div>
    </div>
  );
}