import React, { useState, useMemo } from 'react';

/**
 * CODE VIEWER - Panel de visualización de código fuente
 * 
 * Muestra el código fuente real de la lección actual (Example / Challenge / preguntas)
 * en un panel lateral, usando import.meta.glob + ?raw de Vite (sin dependencias).
 * 
 * Características:
 * - Botón flotante para abrir/cerrar el panel
 * - Copia el código al portapapeles
 * - Conteo de líneas y scroll
 * - Cambia automáticamente según el módulo/pestaña activa
 */

// ============================================================
// IMPORTAR TODOS LOS ARCHIVOS .jsx COMO TEXTO BRUTO (?raw)
// ============================================================
// Vite devuelve el contenido del archivo como string.
// Las claves quedan así: ../01-jsx/Example.jsx?raw
const rawFiles = import.meta.glob('../*/{Example,Challenge,preguntas}.jsx?raw', {
  eager: true,
  import: 'default'
});

// Normalizar las claves: ../01-jsx/Example.jsx?raw → { modulo: '01-jsx', archivo: 'Example' }
const NOMBRES_ARCHIVO = {
  ejemplo: 'Example',
  desafio: 'Challenge',
  preguntas: 'preguntas'
};

function normalizarClave(clave) {
  const match = clave.match(/\.\.\/(\d+-(?:[a-z-]+))\/(\w+)\.jsx\?raw$/);
  if (!match) return null;
  return { modulo: match[1], archivo: match[2] };
}

// Construir mapa hash → contenido crudo
const MAPA_CODIGO = {};
Object.entries(rawFiles).forEach(([clave, contenido]) => {
  const info = normalizarClave(clave);
  if (info) {
    MAPA_CODIGO[`${info.modulo}/${info.archivo}`] = contenido;
  }
});

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
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [archivoVisible, setArchivoVisible] = useState(tipoContenido);

  // Fuente del código actual (basada en la pestaña activa)
  const codigoActual = useMemo(() => {
    const nombreArchivo = NOMBRES_ARCHIVO[archivoVisible] || 'Example';
    return MAPA_CODIGO[`${moduloId}/${nombreArchivo}`] || '';
  }, [moduloId, archivoVisible]);

  // Número de líneas
  const totalLineas = useMemo(() => {
    if (!codigoActual) return 0;
    return codigoActual.split('\n').length;
  }, [codigoActual]);

  // Copiar al portapapeles
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

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          ...btnBase,
          backgroundColor: COLORES.primary,
          color: 'white',
          boxShadow: '0 4px 14px rgba(189,147,249,0.4)',
          padding: '12px 20px',
          fontSize: '14px'
        }}
      >
        💻 Ver código
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(560px, 100vw)',
        zIndex: 9999,
        backgroundColor: COLORES.panelBg,
        color: COLORES.texto,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ===== Header del panel ===== */}
      <div
        style={{
          backgroundColor: COLORES.headerBg,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: `2px solid ${COLORES.borde}`
        }}
      >
        <span style={{ fontSize: '18px', color: COLORES.primaryDark }}>💻</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            Código fuente
          </div>
          <div style={{ fontSize: '12px', color: COLORES.comentario, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            src/{moduloId}/{etiquetas[archivoVisible]}.jsx
          </div>
        </div>

        {/* Botón copiar */}
        <button
          onClick={copiarCodigo}
          style={{
            ...btnBase,
            backgroundColor: copiado ? '#50fa7b' : COLORES.primary,
            color: copiado ? '#1e1e2e' : 'white'
          }}
        >
          {copiado ? '✅ Copiado' : '📋 Copiar'}
        </button>

        {/* Botón cerrar */}
        <button
          onClick={() => setAbierto(false)}
          style={{ ...btnBase, backgroundColor: '#ff5555', color: 'white', padding: '8px 10px' }}
          aria-label="Cerrar"
        >
          ✕
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
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            overflow: 'auto',
            padding: '12px 0',
            paddingRight: '10px'
          }}
        >
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
                    userSelect: 'none'
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ color: COLORES.texto, flex: 1 }}>
                  {linea || ' '}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Overlay si no hay código */}
        {!codigoActual && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORES.comentario
            }}
          >
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
          justifyContent: 'space-between'
        }}
      >
        <span>{totalLineas} líneas</span>
        <span>Fuente local · Vite ?raw</span>
      </div>
    </div>
  );
}