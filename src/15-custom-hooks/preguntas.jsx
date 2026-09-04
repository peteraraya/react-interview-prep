import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function CustomHooksPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué son los custom hooks?',
      respuesta: 'Los custom hooks son funciones reutilizables que encapsulan lógica con estado o efectos secundarios. Deben empezar con "use" por convención para que React aplique las reglas de hooks. Pueden usar otros hooks internamente (useState, useEffect, etc.) y retornan valores que los componentes consumidores necesitan. Permiten extraer lógica repetitiva en componentes sin duplicar código.',
      consejo: 'Un custom hook no es un componente — no renderiza nada, solo encapsula lógica reutilizable.'
    },
    {
      pregunta: '¿Cuándo crear un custom hook?',
      respuesta: 'Cuando dos o más componentes tienen la misma lógica de estado o efectos secundarios. Ejemplos: manejo de formularios, fetching de datos, manejo de eventos, persistencia en localStorage, debounce, etc. También cuando la lógica es compleja y quieres aislarla del componente para mayor legibilidad y testabilidad.',
      consejo: 'Un buen indicador es cuando copias y pegas código entre componentes — refactorízalo a un custom hook.'
    },
    {
      pregunta: '¿Qué son las reglas de los hooks?',
      respuesta: '1) Solo se llaman en el nivel superior (nunca dentro de loops, condiciones, funciones anidadas o callbacks). 2) Solo se llaman en componentes de React o en otros custom hooks. Estas reglas existen porque React depende del orden de llamada de los hooks para asociar estado con componentes. Si se violan, React no puede rastrear el estado correctamente.',
      consejo: 'El linter "eslint-plugin-react-hooks" detecta violaciones de estas reglas automáticamente.'
    },
    {
      pregunta: '¿Cómo se crea un custom hook para manejo de localStorage?',
      respuesta: 'Patrón: function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]. Internamente usa useState con lazy initializer para leer de localStorage, y useEffect para sincronizar cambios. Ejemplo: const [name, setName] = useLocalStorage("name", ""). Cuando el usuario cambia name, se guarda automáticamente en localStorage. El hook encapsula la lógica de parse/stringify y manejo de errores.',
      consejo: 'Menciona que el lazy initializer de useState se ejecuta solo una vez, leyendo de localStorage al inicio sin causar re-render.'
    },
    {
      pregunta: '¿Cómo se crea un custom hook de fetching de datos?',
      respuesta: 'Patrón: function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null }. Internamente usa useState para data/loading/error, y useEffect para hacer fetch cuando cambia la url. Retorna un objeto con los tres estados. Se puede mejorar con AbortController para cleanup, y retry logic. Para producción, se recomienda usar React Query en lugar de un hook custom.',
      consejo: 'Un hook custom de fetch es bueno para aprender, pero en producción React Query maneja caché, reintentos y mucho más.'
    },
    {
      pregunta: '¿Cómo se compone un custom hook con otros hooks?',
      respuesta: 'Un custom hook puede llamar a otros hooks internamente, incluyendo otros custom hooks. Ejemplo: function useDebouncedSearch() { const [query, setQuery] = useState(""); const debouncedQuery = useDebounce(query, 500); const results = useFetch(`/search?q=${debouncedQuery}`); return { query, setQuery, results }; }. La composición permite crear hooks de mayor nivel que combinan funcionalidad.',
      consejo: 'La composición de hooks es como la composición de componentes — crea abstracciones escalables y reutilizables.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Custom Hooks"
      descripcion="Preguntas frecuentes sobre custom hooks en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}