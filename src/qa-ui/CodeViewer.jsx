import React, { useState, useEffect, useMemo } from 'react';
import { MAPA_CODIGO } from './rawSources';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import jsxLang from 'shiki/langs/jsx.mjs';
import darkPlusTheme from 'shiki/themes/dark-plus.mjs';

/**
 * CODE VIEWER - Vista de código fuente (pestaña "Código")
 * 
 * Muestra el código fuente real de la lección actual (Example / Challenge / preguntas)
 * con resaltado de sintaxis exacto de VSCode (Shiki + tema Dark+).
 * 
 * Características:
 * - Selector para alternar entre Example.jsx, Challenge.jsx y preguntas.jsx
 * - Botón para copiar el código al portapapeles
 * - Numeración de líneas y scroll
 * - Colores del lenguaje reconocidos automáticamente (JSX/JS/CSS)
 */

const NOMBRES_ARCHIVO = {
  ejemplo: 'Example',
  desafio: 'Challenge',
  preguntas: 'preguntas'
};

const COLORES = {
  panelBg: '#1e1e1e',
  headerBg: '#252526',
  texto: '#d4d4d4',
  comentario: '#6a9955',
  primary: '#0e639c',
  primaryDark: '#007acc',
  borde: '#3e3e42',
  lineaNum: '#858585',
  lineaNumBg: '#252526'
};

const btnBase = {
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  padding: '8px 14px',
  borderRadius: '4px',
  transition: 'all 0.2s'
};

// ============================================================
// SINGLETON DE SHIKI (se inicializa una sola vez al cargar)
// Configuración fine-grained: solo JSX + tema Dark+ + engine JS
// ============================================================
let highlighterPromise = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [darkPlusTheme],
      langs: [jsxLang],
      engine: createJavaScriptRegexEngine()
    }).catch(err => {
      console.error('[CodeViewer] Error inicializando Shiki:', err);
      highlighterPromise = null;
      throw err;
    });
  }
  return highlighterPromise;
}

export default function CodeViewer({ moduloId, tipoContenido }) {
  const [archivoVisible, setArchivoVisible] = useState('ejemplo');
  const [copiado, setCopiado] = useState(false);
  const [tokensPorLinea, setTokensPorLinea] = useState(null);
  const [listo, setListo] = useState(false);

  // Si vengo de una pestaña (ejemplo/desafio/preguntas), mostrar ese archivo
  useEffect(() => {
    if (['ejemplo', 'desafio', 'preguntas'].includes(tipoContenido)) {
      setArchivoVisible(tipoContenido);
    }
  }, [tipoContenido]);

  // Código crudo de la lección actual
  const codigoActual = useMemo(() => {
    const nombreArchivo = NOMBRES_ARCHIVO[archivoVisible] || 'Example';
    return MAPA_CODIGO[`${moduloId}/${nombreArchivo}`] || '';
  }, [moduloId, archivoVisible]);

  const totalLineas = useMemo(() => {
    if (!codigoActual) return 0;
    return codigoActual.split('\n').length;
  }, [codigoActual]);

  // Resaltado de sintaxis con Shiki (colores de VSCode Dark+)
  useEffect(() => {
    let cancelado = false;
    setTokensPorLinea(null);

    if (!codigoActual) {
      setListo(true);
      return undefined;
    }

    getHighlighter()
      .then(highlighter => {
        if (cancelado) return;
        const tokens = highlighter.codeToTokensBase(codigoActual, {
          lang: 'jsx',
          theme: 'dark-plus'
        });
        if (!cancelado) {
          setTokensPorLinea(tokens);
          setListo(true);
        }
      })
      .catch(err => {
        console.error('[CodeViewer] Error resaltando código:', err);
        if (!cancelado) setListo(true);
      });

    return () => {
      cancelado = true;
    };
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

  // Render del código resaltado
  const renderCodigoResaltado = () => {
    if (!listo) {
      return (
        <div style={{ padding: '30px', textAlign: 'center', color: COLORES.comentario }}>
          Resaltando código…
        </div>
      );
    }

    if (!tokensPorLinea || tokensPorLinea.length === 0) {
      return (
        <div style={{ padding: '30px', textAlign: 'center', color: COLORES.comentario }}>
          No hay código disponible para este archivo.
        </div>
      );
    }

    return tokensPorLinea.map((linea, i) => (
      <div key={i} style={{ display: 'flex', minHeight: '21px' }}>
        {/* Número de línea */}
        <span
          style={{
            display: 'inline-block',
            width: '48px',
            minWidth: '48px',
            flexShrink: 0,
            textAlign: 'right',
            paddingRight: '16px',
            color: COLORES.lineaNum,
            userSelect: 'none',
            backgroundColor: COLORES.lineaNumBg,
            lineHeight: '1.6'
          }}
        >
          {i + 1}
        </span>
        {/* Conteúdo con color de token */}
        <span style={{ flex: 1, paddingLeft: '16px', whiteSpace: 'pre', lineHeight: '1.6' }}>
          {linea.length === 0
            ? ' '
            : linea.map((token, j) => (
                <span
                  key={j}
                  style={{
                    color: token.color || COLORES.texto,
                    ...(token.fontStyle === 1
                      ? { fontStyle: 'italic' }
                      : token.fontStyle === 2
                        ? { fontWeight: 'bold' }
                        : token.fontStyle === 3
                          ? { fontStyle: 'italic', fontWeight: 'bold' }
                          : {})
                  }}
                >
                  {token.content}
                </span>
              ))}
        </span>
      </div>
    ));
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
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        border: `1px solid ${COLORES.borde}`
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
        <span style={{ fontSize: '18px' }}>💻</span>
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
            backgroundColor: copiado ? '#4ec9b0' : COLORES.primary,
            color: 'white'
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
              color: archivoVisible === f ? '#ffffff' : COLORES.comentario,
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
      <div style={{ maxHeight: '650px', overflow: 'auto', padding: '8px 0' }}>
        <pre
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent',
            fontSize: '13px',
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            lineHeight: '1.6'
          }}
        >
          {renderCodigoResaltado()}
        </pre>
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
        <span>Resaltado con Shiki · tema Dark+ (VSCode)</span>
      </div>
    </div>
  );
}