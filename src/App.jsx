import React, { useState } from 'react';
import CodeViewer from './qa-ui/CodeViewer';
import JSXExamples from './01-jsx/Example';
import JSXChallenge from './01-jsx/Challenge';
import PropsExamples from './02-props/Example';
import PropsChallenge from './02-props/Challenge';
import StateExamples from './03-state/Example';
import StateChallenge from './03-state/Challenge';
import HooksExamples from './04-hooks/Example';
import HooksChallenge from './04-hooks/Challenge';
import LifecycleExamples from './05-lifecycle/Example';
import LifecycleChallenge from './05-lifecycle/Challenge';
import APIExamples from './06-api/Example';
import APIChallenge from './06-api/Challenge';
import ContextExamples from './07-context/Example';
import ContextChallenge from './07-context/Challenge';
import ZustandExamples from './08-zustand/Example';
import ZustandChallenge from './08-zustand/Challenge';
import FormsExamples from './09-forms-zod/Example';
import FormsChallenge from './09-forms-zod/Challenge';
import ReactQueryExamples from './10-react-query/Example';
import ReactQueryChallenge from './10-react-query/Challenge';
import TestingGuide from './11-testing/Example';
import TestingChallenge from './11-testing/Challenge';
import TypeScriptExamples from './12-typescript/Example';
import TypeScriptChallenge from './12-typescript/Challenge';
import RouterExamples from './13-router/Example';
import RouterChallenge from './13-router/Challenge';
import PerformanceExamples from './14-performance/Example';
import PerformanceChallenge from './14-performance/Challenge';
import CustomHooksExamples from './15-custom-hooks/Example';
import CustomHooksChallenge from './15-custom-hooks/Challenge';
import PatternsExamples from './16-patterns/Example';
import PatternsChallenge from './16-patterns/Challenge';

import JSXPreguntas from './01-jsx/preguntas';
import PropsPreguntas from './02-props/preguntas';
import StatePreguntas from './03-state/preguntas';
import HooksPreguntas from './04-hooks/preguntas';
import LifecyclePreguntas from './05-lifecycle/preguntas';
import APIPreguntas from './06-api/preguntas';
import ContextPreguntas from './07-context/preguntas';
import ZustandPreguntas from './08-zustand/preguntas';
import FormsPreguntas from './09-forms-zod/preguntas';
import ReactQueryPreguntas from './10-react-query/preguntas';
import TestingPreguntas from './11-testing/preguntas';
import TypeScriptPreguntas from './12-typescript/preguntas';
import RouterPreguntas from './13-router/preguntas';
import PerformancePreguntas from './14-performance/preguntas';
import CustomHooksPreguntas from './15-custom-hooks/preguntas';
import PatternsPreguntas from './16-patterns/preguntas';

/**
 * APLICACIÓN PRINCIPAL - React Interview Prep
 * 
 * Esta aplicación sirve como guía de estudio interactiva para preparar
 * entrevistas técnicas de React. Contiene 16 módulos con ejemplos y desafíos.
 */

// Estilos globales
const estilosGlobales = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    borderBottom: '4px solid #007bff'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px'
  },
  navSection: {
    marginBottom: '10px'
  },
  navSectionTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '5px',
    textTransform: 'uppercase'
  },
  navButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    minWidth: '100px'
  },
  navButtonActive: {
    backgroundColor: '#007bff',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,123,255,0.3)'
  },
  navButtonInactive: {
    backgroundColor: 'white',
    color: '#007bff',
    border: '2px solid #007bff'
  },
  navButtonAdvanced: {
    backgroundColor: 'white',
    color: '#6f42c1',
    border: '2px solid #6f42c1'
  },
  navButtonAdvancedActive: {
    backgroundColor: '#6f42c1',
    color: 'white'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  tabActive: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  tabInactive: {
    backgroundColor: '#e9ecef',
    color: '#333'
  },
  content: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

// Datos de los módulos básicos
const modulosBasicos = [
  {
    id: '01-jsx',
    titulo: 'JSX',
    descripcion: 'JavaScript XML - Sintaxis para crear UI',
    color: '#e3f2fd'
  },
  {
    id: '02-props',
    titulo: 'Props',
    descripcion: 'Propiedades para comunicación entre componentes',
    color: '#e8f5e8'
  },
  {
    id: '03-state',
    titulo: 'Estado',
    descripcion: 'Manejo de datos que cambian en el tiempo',
    color: '#fff3e0'
  },
  {
    id: '04-hooks',
    titulo: 'Hooks',
    descripcion: 'Funciones para usar estado y efectos',
    color: '#f3e5f5'
  },
  {
    id: '05-lifecycle',
    titulo: 'Ciclo de Vida',
    descripcion: 'Montaje, actualización y desmontaje',
    color: '#ffebee'
  },
  {
    id: '06-api',
    titulo: 'API',
    descripcion: 'Obtención de datos desde servidores',
    color: '#e0f7fa'
  }
];

// Datos de los módulos avanzados
const modulosAvanzados = [
  {
    id: '07-context',
    titulo: 'Context API',
    descripcion: 'Estado global sin prop drilling',
    color: '#fce4ec'
  },
  {
    id: '08-zustand',
    titulo: 'Zustand',
    descripcion: 'State management ligero',
    color: '#e8eaf6'
  },
  {
    id: '09-forms-zod',
    titulo: 'Forms + Zod',
    descripcion: 'Formularios con validación',
    color: '#e0f2f1'
  },
  {
    id: '10-react-query',
    titulo: 'React Query',
    descripcion: 'Estado del servidor',
    color: '#fff8e1'
  },
  {
    id: '11-testing',
    titulo: 'Testing',
    descripcion: 'Jest + React Testing Library',
    color: '#f1f8e9'
  },
  {
    id: '12-typescript',
    titulo: 'TypeScript',
    descripcion: 'Tipado estático para React',
    color: '#e3f2fd'
  },
  {
    id: '13-router',
    titulo: 'React Router',
    descripcion: 'Navegación en SPA',
    color: '#fff3e0'
  },
  {
    id: '14-performance',
    titulo: 'Performance',
    descripcion: 'Optimización de renders y carga',
    color: '#e8f5e8'
  },
  {
    id: '15-custom-hooks',
    titulo: 'Custom Hooks',
    descripcion: 'Reutilización de lógica avanzada',
    color: '#f3e5f5'
  },
  {
    id: '16-patterns',
    titulo: 'Patrones',
    descripcion: 'Error Boundaries y patrones avanzados',
    color: '#ffebee'
  }
];

const todosModulos = [...modulosBasicos, ...modulosAvanzados];

// Componente para el contenido de cada módulo
function ContenidoModulo({ moduloId, tipoContenido }) {
  const componentes = {
    '01-jsx': { ejemplo: JSXExamples, desafio: JSXChallenge, preguntas: JSXPreguntas },
    '02-props': { ejemplo: PropsExamples, desafio: PropsChallenge, preguntas: PropsPreguntas },
    '03-state': { ejemplo: StateExamples, desafio: StateChallenge, preguntas: StatePreguntas },
    '04-hooks': { ejemplo: HooksExamples, desafio: HooksChallenge, preguntas: HooksPreguntas },
    '05-lifecycle': { ejemplo: LifecycleExamples, desafio: LifecycleChallenge, preguntas: LifecyclePreguntas },
    '06-api': { ejemplo: APIExamples, desafio: APIChallenge, preguntas: APIPreguntas },
    '07-context': { ejemplo: ContextExamples, desafio: ContextChallenge, preguntas: ContextPreguntas },
    '08-zustand': { ejemplo: ZustandExamples, desafio: ZustandChallenge, preguntas: ZustandPreguntas },
    '09-forms-zod': { ejemplo: FormsExamples, desafio: FormsChallenge, preguntas: FormsPreguntas },
    '10-react-query': { ejemplo: ReactQueryExamples, desafio: ReactQueryChallenge, preguntas: ReactQueryPreguntas },
    '11-testing': { ejemplo: TestingGuide, desafio: TestingChallenge, preguntas: TestingPreguntas },
    '12-typescript': { ejemplo: TypeScriptExamples, desafio: TypeScriptChallenge, preguntas: TypeScriptPreguntas },
    '13-router': { ejemplo: RouterExamples, desafio: RouterChallenge, preguntas: RouterPreguntas },
    '14-performance': { ejemplo: PerformanceExamples, desafio: PerformanceChallenge, preguntas: PerformancePreguntas },
    '15-custom-hooks': { ejemplo: CustomHooksExamples, desafio: CustomHooksChallenge, preguntas: CustomHooksPreguntas },
    '16-patterns': { ejemplo: PatternsExamples, desafio: PatternsChallenge, preguntas: PatternsPreguntas }
  };
  
  const Componente = componentes[moduloId][tipoContenido];
  return <Componente />;
}

// Componente principal
export default function App() {
  const [moduloActual, setModuloActual] = useState('01-jsx');
  const [tipoContenido, setTipoContenido] = useState('ejemplo');
  
  const moduloSeleccionado = todosModulos.find(m => m.id === moduloActual);
  const esBasico = modulosBasicos.some(m => m.id === moduloActual);
  
  return (
    <div style={estilosGlobales.container}>
      {/* Header */}
      <header style={estilosGlobales.header}>
        <h1 style={estilosGlobales.title}>React Interview Prep</h1>
        <p style={estilosGlobales.subtitle}>
          Guía completa de aprendizaje para entrevistas técnicas de React
        </p>
      </header>
      
      {/* Navegación de módulos básicos */}
      <nav style={estilosGlobales.nav}>
        <div style={estilosGlobales.navSection}>
          <div style={estilosGlobales.navSectionTitle}>Fundamentos</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {modulosBasicos.map(modulo => (
              <button
                key={modulo.id}
                onClick={() => {
                  setModuloActual(modulo.id);
                  setTipoContenido('ejemplo');
                }}
                style={{
                  ...estilosGlobales.navButton,
                  ...(moduloActual === modulo.id 
                    ? estilosGlobales.navButtonActive 
                    : estilosGlobales.navButtonInactive),
                  backgroundColor: moduloActual === modulo.id ? '#007bff' : 'white'
                }}
              >
                {modulo.titulo}
              </button>
            ))}
          </div>
        </div>
        
        <div style={estilosGlobales.navSection}>
          <div style={estilosGlobales.navSectionTitle}>Avanzado / Librerías</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {modulosAvanzados.map(modulo => (
              <button
                key={modulo.id}
                onClick={() => {
                  setModuloActual(modulo.id);
                  setTipoContenido('ejemplo');
                }}
                style={{
                  ...estilosGlobales.navButton,
                  ...(moduloActual === modulo.id 
                    ? estilosGlobales.navButtonAdvancedActive 
                    : estilosGlobales.navButtonAdvanced),
                  backgroundColor: moduloActual === modulo.id ? '#6f42c1' : 'white'
                }}
              >
                {modulo.titulo}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Descripción del módulo actual */}
      <div style={{
        padding: '15px',
        backgroundColor: moduloSeleccionado.color,
        borderRadius: '8px',
        marginBottom: '20px',
        borderLeft: `4px solid ${esBasico ? '#007bff' : '#6f42c1'}`
      }}>
        <h3 style={{ margin: '0 0 5px 0' }}>{moduloSeleccionado.titulo}</h3>
        <p style={{ margin: 0, color: '#666' }}>{moduloSeleccionado.descripcion}</p>
      </div>
      
      {/* Tabs para Ejemplo/Desafío */}
      <div style={estilosGlobales.tabContainer}>
        <button
          onClick={() => setTipoContenido('ejemplo')}
          style={{
            ...estilosGlobales.tab,
            ...(tipoContenido === 'ejemplo' 
              ? estilosGlobales.tabActive 
              : estilosGlobales.tabInactive)
          }}
        >
          Ejemplo Educativo
        </button>
        <button
          onClick={() => setTipoContenido('desafio')}
          style={{
            ...estilosGlobales.tab,
            ...(tipoContenido === 'desafio' 
              ? { ...estilosGlobales.tabActive, backgroundColor: '#dc3545' }
              : estilosGlobales.tabInactive)
          }}
        >
          Desafío de Entrevista
        </button>
        <button
          onClick={() => setTipoContenido('preguntas')}
          style={{
            ...estilosGlobales.tab,
            ...(tipoContenido === 'preguntas' 
              ? { ...estilosGlobales.tabActive, backgroundColor: '#6f42c1' }
              : estilosGlobales.tabInactive)
          }}
        >
          Preguntas de Entrevista
        </button>
      </div>
      
      {/* Contenido */}
      <main style={estilosGlobales.content}>
        <ContenidoModulo 
          moduloId={moduloActual} 
          tipoContenido={tipoContenido} 
        />
      </main>
      
      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #ddd'
      }}>
        <p>
          <strong>React Interview Prep</strong> - Proyecto de aprendizaje interactivo
        </p>
        <p>
          16 módulos con ejemplos documentados y desafíos prácticos de entrevistas técnicas
        </p>
      </footer>

      {/* Visor de código fuente de la lección actual */}
      <CodeViewer
        moduloId={moduloActual}
        tipoContenido={tipoContenido}
      />
    </div>
  );
}