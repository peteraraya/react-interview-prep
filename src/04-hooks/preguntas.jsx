import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function HooksPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué son los hooks y por qué se usan?',
      respuesta: 'Los hooks son funciones especiales que permiten "engancharte" al ciclo de vida de React y al estado desde componentes de función. Antes de los hooks, solo los componentes de clase tenían acceso a estado (this.state) y ciclo de vida (componentDidMount, etc.). Los hooks fueron introducidos en React 16.8 para eliminar esta diferencia y permitir escribir componentes con estado y efectos secundarios de forma más simple, reutilizable y testeable. Solo se pueden usar en componentes de función o en otros hooks personalizados.',
      consejo: 'Las reglas de hooks: solo se llaman en el nivel superior (nunca dentro de loops, condiciones o funciones anidadas), y solo se usan en componentes de función o custom hooks.'
    },
    {
      pregunta: '¿Qué hace useEffect y cuándo se usa?',
      respuesta: 'useEffect ejecuta efectos secundarios en componentes: peticiones HTTP, suscripciones, manipulación del DOM, timers, etc. Se ejecuta después del renderizado. El segundo argumento (array de dependencias) controla cuándo se ejecuta: sin array se ejecuta en cada render; con array vacío [] una sola vez al montar; con dependencias [dep1, dep2] cada vez que esas dependencias cambien. La función que retorna se usa como cleanup: se ejecuta antes del siguiente efecto o al desmontar.',
      consejo: 'Un error común es olvidar las dependencias en el array. React tiene lint rules (exhaustive-deps) que te avisan. Explica que incluir todas las dependencias es fundamental para consistencia.'
    },
    {
      pregunta: '¿Cuál es la diferencia entre useEffect y useMemo?',
      respuesta: 'useEffect ejecuta efectos secundarios después del render (fetch, subscriptions, DOM updates). useMemo MEMORIZA un valor calculado para evitar recalcularlo en cada render. useEffect no tiene retorno visible — ejecuta algo. useMemo retorna un valor. Ejemplo: useMemo(() => items.filter(...), [items]) memoriza el resultado del filtro; useEffect(() => fetchData(), []) ejecuta una petición. Otro diferencia: useMemo bloquea el render (ejecuta durante el render), useEffect es asíncrono (ejecuta después).',
      consejo: 'No uses useMemo para todo — solo cuando el cálculo es costoso (miles de items, operaciones matemáticas pesadas). El overhead de useMemo no vale la pena para cálculos simples.'
    },
    {
      pregunta: '¿Qué hace useRef y cuándo se usa?',
      respuesta: 'useRef crea una referencia mutable que persiste durante todo el ciclo de vida del componente sin causar re-render al cambiar. Tiene dos usos principales: 1) Acceder a elementos del DOM (similar a document.getElementById pero más seguro y declarativo). 2) Guardar valores que necesitan persistir entre renders sin desencadenar re-renderizaciones, como timers, valores anteriores, o flags. El valor se accede con .current. A diferencia de useState, cambiar ref.current NO re-renderiza el componente.',
      consejo: 'Cuando necesites leer un valor que no debe causar re-render, useRef es la herramienta correcta. Ejemplo: saber si es el primer render o no.'
    },
    {
      pregunta: '¿Qué hace useCallback y cuándo usarlo?',
      respuesta: 'useCallback memoriza una función para que no se cree una nueva referencia en cada render. Es útil cuando una función se pasa como prop a un componente que usa React.memo — si la función se recrea en cada render, memo no tiene efecto porque la referencia de la función cambió. Sin embargo, si no se pasa a componentes hijos memorizados, useCallback no tiene beneficio real. En muchos casos, crear una nueva función en cada render es eficiente y no causa problemas de rendimiento medibles.',
      consejo: 'La regla de oro: no uses useCallback preventivamente en toda función. Solo cuando necesitas estabilidad de referencia real, como en dependencias de useEffect o props de componentes memorizados.'
    },
    {
      pregunta: '¿Qué son los custom hooks?',
      respuesta: 'Los custom hooks son funciones reutilizables que encapsulan lógica con estado o efectos secundarios. Deben empezar con "use" por convención para que React aplique las reglas de hooks. Pueden usar otros hooks internamente (useState, useEffect, etc.) y retornan valores que los componentes consumidores necesitan. Permiten extraer lógica repetitiva en componentes sin duplicar código. Ejemplo: useLocalStorage(), useFetch(), useDebounce(). Un custom hook no es un componente — no renderiza nada, solo encapsula lógica.',
      consejo: 'Un buen indicador de que necesitas un custom hook es cuando dos o más componentes tienen la misma lógica de efecto o estado.'
    },
    {
      pregunta: '¿Qué pasa si olvidas el cleanup de useEffect?',
      respuesta: 'Si olvidas el cleanup, puedes causar memory leaks, conexiones abiertas, timers que siguen ejecutándose, o suscripciones duplicadas. Ejemplo: si te suscribes a un evento en useEffect sin limpiarlo al desmontar, la función sigue ejecutándose en memoria. Para peticiones HTTP, AbortController permite cancelar peticiones pendientes al desmontar. En desarrollo, React tiene warnings en la consola cuando detecta posibles memory leaks.',
      consejo: 'Patrón recomendado: crear un AbortController en useEffect y retornar controller.abort() en el cleanup.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Hooks"
      descripcion="Preguntas frecuentes sobre los hooks de React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}