import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function TypeScriptPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es TypeScript y por qué se usa con React?',
      respuesta: 'TypeScript es un superset de JavaScript que añade tipado estático. Se usa con React para: detectar errores en compile-time en lugar de runtime, mejorar la experiencia de desarrollo con autocompletado y documentación, hacer el código más legible y mantenible, y facilitar refactorizaciones. Con React, TypeScript tipa props, estado, eventos, hooks y más.',
      consejo: 'Menciona que TypeScript NO cambia el comportamiento del código — solo añade verificación estática que se elimina en el build final.'
    },
    {
      pregunta: '¿Cómo se tipan las props de un componente?',
      respuesta: 'Definiendo una interfaz o tipo: interface UserProps { name: string; age: number; isActive?: boolean }. Luego se usa como tipo del parámetro: function User({ name, age, isActive }: UserProps). Los props opcionales se marcan con ?. También se puede usar type en lugar de interface. Para componentes que exportan很多 props, se pueden extraer tipos con Omit, Pick o Partial.',
      consejo: 'Prefiere interface para componentes (puede extenderse) y type para uniones o tipados complejos.'
    },
    {
      pregunta: '¿Qué son los generics en TypeScript?',
      respuesta: 'Los generics permiten crear componentes o funciones reutilizables que funcionan con múltiples tipos sin perder la seguridad de tipos. Ejemplo: function List<T>({ items }: { items: T[] }). El tipo T se infiere del uso. En React, los generics son útiles para componentes genéricos, hooks personalizados, y API wrappers. Ejemplo: useState<number>(0) fuerza un tipo específico.',
      consejo: 'Un ejemplo clásico es un componente Table<T> donde T es el tipo de fila, permitiendo reutilizarlo con diferentes tipos de datos.'
    },
    {
      pregunta: '¿Cómo se tipa useState en TypeScript?',
      respuesta: 'useState soporta un parámetro genérico: const [count, setCount] = useState<number>(0). El tipo se infiere del valor inicial, así que useState(0) infiere number automáticamente. Para objetos complejos: interface User { id: number; name: string }; const [user, setUser] = useState<User | null>(null). El tipo | null es útil cuando el estado puede ser undefined inicialmente.',
      consejo: 'Si el valor inicial es null pero el tipo final no lo incluye, usa useState<Type | null>(null) explícitamente.'
    },
    {
      pregunta: '¿Cómo se tipa useEffect en TypeScript?',
      respuesta: 'El efecto mismo no necesita tipado explícito porque no recibe parámetros. Lo que sí se tipa es la función del efecto si es async, y las dependencias. Ejemplo: useEffect(() => { const fetchData = async () => { const res = await fetch(url); const data: DataType = await res.json(); setData(data); }; fetchData(); }, [url]). Para el cleanup, la función retornada no necesita tipo.',
      consejo: 'Menciona que las dependencias de useEffect deben ser tipadas correctamente para que TypeScript detecte dependencias faltantes.'
    },
    {
      pregunta: '¿Cómo se tipa un custom hook?',
      respuesta: 'El custom hook se tipa como una función que retorna un tipo específico. Ejemplo: function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]. Los generics permiten que el hook funcione con cualquier tipo. Para hooks que retornan objetos: interface UseFetchResult<T> { data: T | null; loading: boolean; error: string | null }; function useFetch<T>(url: string): UseFetchResult<T>.',
      consejo: 'Exporta los tipos de los hooks para que los consumidores puedan usarlos: export type { UseFetchResult }.'
    },
    {
      pregunta: '¿Qué son los Type Guards y cuándo se usan?',
      respuesta: 'Los Type Guards son funciones que reducen el tipo de una variable en un bloque de código. Ejemplo: function isString(value: unknown): value is string { return typeof value === "string" }. Esto permite usar el valor como string dentro del if sin errores de tipo. Son útiles para: manejar union types, validar datos de APIs externas, y manejar props polimórficas.',
      consejo: 'Menciona que typeof, instanceof, y "in" operator también actúan como type guards automáticos en TypeScript.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: TypeScript"
      descripcion="Preguntas frecuentes sobre TypeScript en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}