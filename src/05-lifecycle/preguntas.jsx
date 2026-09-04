import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function LifecyclePreguntas() {
  const preguntas = [
    {
      pregunta: '¿Cuáles son las fases del ciclo de vida en React?',
      respuesta: 'El ciclo de vida tiene tres fases: 1) Montaje: el componente se crea y se inserta en el DOM. Equivalente a useEffect(fn, []) o componentDidMount. 2) Actualización: el componente se re-renderiza por cambios en props o estado. Equivalente a useEffect(() => {}, [deps]) o componentDidUpdate. 3) Desmontaje: el componente se elimina del DOM. Equivalente a la función de cleanup de useEffect(fn, []), que equivale a componentWillUnmount. En componentes de función, useEffect cubre todas estas fases.',
      consejo: 'Menciona que los métodos de clase como componentDidMount, componentDidUpdate y componentWillUnmount se usan menos hoy en día, pero es importante conocerlos para entender código legacy.'
    },
    {
      pregunta: '¿Cómo se simula componentDidMount con hooks?',
      respuesta: 'Se usa useEffect(() => { /* código */ }, []), pasando un array vacío como dependencias. Esto hace que el efecto se ejecute una sola vez después del primer render, exactamente como componentDidMount en componentes de clase. Es el lugar ideal para peticiones iniciales de datos, suscripciones o inicialización de librerías externas. Si el efecto retorna una función, esa función se ejecuta al desmontar el componente.',
      consejo: 'En React 18, con Strict Mode en desarrollo, los efectos se ejecutan dos veces para detectar problemas de cleanup. Esto es solo en desarrollo, no en producción.'
    },
    {
      pregunta: '¿Qué es el useEffect de cleanup y por qué es importante?',
      respuesta: 'La función de cleanup se ejecuta antes de que el efecto se vuelva a ejecutar y cuando el componente se desmonta. Es crucial para: cancelar peticiones HTTP pendientes (AbortController), limpiar timers (clearInterval, clearTimeout), eliminar suscripciones a eventos, desconectar WebSocket, y cualquier recurso que pueda causar memory leaks. Sin cleanup, estos recursos pueden permanecer activos aunque el componente ya no exista, causando bugs sutiles.',
      consejo: 'Patrón recomendado: cleanup siempre = función return dentro de useEffect. Ejemplo: return () => controller.abort() o return () => clearInterval(timer).'
    },
    {
      pregunta: '¿Qué es useEffect de dependencias y cómo funciona?',
      respuesta: 'El segundo parámetro de useEffect es un array de dependencias. React compara este array con el del render anterior usando Object.is() para cada elemento. Si alguna dependencia cambia, el efecto se vuelve a ejecutar. Si el array es [], el efecto solo se ejecuta una vez (montaje). Si no se pasa el array, se ejecuta en cada render. Si se omite el array, React advierte que el componente se re-renderizará infinitamente porque el efecto modifica su propia dependencia.',
      consejo: 'Nunca mute las dependencias — siempre crea nuevas referencias. Y asegúrate de incluir todas las variables que el efecto usa dentro del array.'
    },
    {
      pregunta: '¿Qué son los effect sin dependencias?',
      respuesta: 'Son efectos sin el segundo parámetro (sin array de dependencias), que se ejecutan después de cada render del componente. React los llama "sin dependency array" y se ejecutan en cada render. Ejemplo: useEffect(() => { console.log("render") }) se ejecuta cada vez que el componente se renderiza. Usar esto sin tener una razón clara es ineficiente porque ejecuta el efecto innecesariamente. La mayoría de los efectos deberían tener dependencias específicas para ejecutarse solo cuando sea necesario.',
      consejo: 'El lint rule exhaustive-deps te ayuda a evitar dependencias faltantes. Aprender a leer y respetar esta regla es fundamental.'
    },
    {
      pregunta: '¿Qué es useCallback y por qué es importante para el ciclo de vida?',
      respuesta: 'useCallback memoriza una función entre renders para mantener referencias estables. Es importante para el ciclo de vida porque si pasas una función inline como dependencia de useEffect, se crea una nueva referencia en cada render, causando que el efecto se re-ejecute innecesariamente. useCallback evita esto memorizando la función. También es útil con React.memo para evitar re-renders de componentes hijos. Sin embargo, no se debe abusar de useCallback — solo cuando hay un beneficio real de rendimiento medible.',
      consejo: 'useCallback NO es magia — solo memoriza. Si no pasas la función a dependencias de efectos o props de componentes memorizados, no tiene beneficio real.'
    },
    {
      pregunta: '¿Qué es el strict mode y qué hace con el ciclo de vida?',
      respuesta: 'StrictMode es un componente envolvente que activa advertencias y verificaciones adicionales en desarrollo. Con el ciclo de vida, hace que: los componentes se rendericen dos veces para detectar efectos sin cleanup, se ejecuten funciones de cleanup aunque no sea necesario, y se muestren warnings de APIs deprecadas. Esto solo ocurre en desarrollo, no en producción. Su propósito es ayudar a encontrar bugs como memory leaks y efectos no seguros antes de llegar a producción.',
      consejo: 'Si ves que tu useEffect se ejecuta dos veces en desarrollo, no es un bug — es Strict Mode haciendo su trabajo. Verifica que tu cleanup esté bien implementado.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Ciclo de Vida"
      descripcion="Preguntas frecuentes sobre el ciclo de vida de componentes en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}