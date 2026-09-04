import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function PerformancePreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es React.memo y cuándo usarlo?',
      respuesta: 'React.memo es un HOC que memoiza un componente — si sus props no cambian, evita re-renderizarse aunque el padre se re-renderice. Función: const Memoized = memo(Component). Solo vale la pena cuando: el componente es costoso de renderizar, recibe props que cambian raramente, y el padre se re-renderiza frecuentemente. NO usarlo preventivamente porque tiene overhead de comparación de props.',
      consejo: 'React.memo compara props con Object.is() por defecto. Puedes pasar una función de comparación personalizada como segundo argumento.'
    },
    {
      pregunta: '¿Cuándo usar useMemo vs useCallback?',
      respuesta: 'useMemo memoriza un VALOR calculado: const result = useMemo(() => heavyCalc(data), [data]). useCallback memoriza una FUNCIÓN: const fn = useCallback(() => doSomething(), []). useMemo evita recalcular computaciones costosas en cada render. useCallback evita recrear funciones que se pasan como props a componentes memoizados o como dependencias de useEffect. Ambos tienen overhead — solo úsalos cuando hay beneficio medible.',
      consejo: 'Si no pasas la función a un componente memorizado o como dependencia de useEffect, useCallback no tiene beneficio real.'
    },
    {
      pregunta: '¿Qué es React.lazy y Suspense?',
      respuesta: 'React.lazy permite cargar componentes bajo demanda (code splitting): const LazyComponent = lazy(() => import("./HeavyComponent")). Suspense muestra un fallback mientras se carga: <Suspense fallback={<Loading />}> <LazyComponent /> </Suspense>. Esto reduce el bundle inicial — solo se descarga el código cuando el usuario necesita ese componente. Fundamental para apps grandes con muchas páginas.',
      consejo: 'El fallback puede ser cualquier JSX. También se puede usar ErrorBoundary para manejar errores de carga.'
    },
    {
      pregunta: '¿Cómo se optimizan listas grandes en React?',
      respuesta: 'Estrategias: 1) Virtualización: solo renderizar items visibles (react-window, react-virtualized). 2) Keys correctas: usar IDs únicos, nunca índices. 3) React.memo en items para evitar re-renders. 4) Paginación: cargar datos por páginas. 5) Infinite scroll con useInfiniteQuery. 6) React.memo en el contenedor. 7) Debounce en filtros/búsqueda para evitar recalcular en cada tecla.',
      consejo: 'Para listas de más de 1000 items, la virtualización es casi obligatoria para mantener buena performance.'
    },
    {
      pregunta: '¿Qué causa re-renders innecesarios y cómo evitarlos?',
      respuesta: 'Causas: 1) Funciones inline como props (se recrean en cada render). 2) Objetos/arrays inline como props (nueva referencia). 3) Estado compartido que cambia frecuente y afecta muchos componentes. 4) Context que cambia y re-renderiza todos los consumers. Soluciones: useCallback para funciones, useMemo para objetos, selectores en Zustand, dividir Contexts, React.memo en componentes puros.',
      consejo: 'No optimices prematuramente — primero mide con React DevTools Profiler para identificar qué componentes se re-renderizan innecesariamente.'
    },
    {
      pregunta: '¿Qué es la virtualización de listas?',
      respuesta: 'Es una técnica que solo renderiza los items visibles en el viewport, en lugar de renderizar toda la lista. Para 10,000 items, en lugar de crear 10,000 nodos DOM, solo crea ~20-30 (los visibles + buffer). Librerías: react-window (más ligera, recomendada) y react-virtualized (más features). Necesitas: altura del container, altura de cada item, y cuántos items son visibles.',
      consejo: 'react-window es la opción recomendada hoy. react-virtualized es más antiguo y tiene más features pero es más pesado.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Performance"
      descripcion="Preguntas frecuentes sobre optimización de rendimiento en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}