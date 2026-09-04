import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function ZustandPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es Zustand y por qué se usa?',
      respuesta: 'Zustand es un state manager ligero para React (y vanilla JS) creado por el equipo de/pmndrs. Permite crear stores globales de estado con una API minimalista: create() retorna un hook personalizado que expone el estado y acciones. Ventajas: sin boilerplate (a diferencia de Redux), sin Providers necesarios, soporte de selectores built-in para evitar re-renders innecesarios, persistencia automática con middleware, y funciona fuera de componentes React.',
      consejo: 'Zustand tiene ~1KB gzipped vs Redux+Toolkit ~11KB. Para apps pequeñas/medianas es la opción más práctica.'
    },
    {
      pregunta: '¿Cómo funciona la API de Zustand?',
      respuesta: 'La API es simple: const useStore = create((set, get) => ({ count: 0, increment: () => set(state => ({ count: state.count + 1 })) })). Dentro del componente: const count = useStore(state => state.count). El primer parámetro es el initial state + acciones, set actualiza el estado (merge automático), get permite leer el estado actual. Los selectores (la función que pasas al hook) son la clave del rendimiento — solo re-renderizan cuando el valor seleccionado cambia.',
      consejo: 'set() hace merge automático como setState de clase. Si necesitas reemplazar completamente, usa set(newState, true) como segundo argumento.'
    },
    {
      pregunta: '¿Qué son los selectores en Zustand?',
      respuesta: 'Los selectores son funciones que especifican qué parte del estado necesita un componente. Ejemplo: const name = useStore(state => state.user.name). Esto es crucial para el rendimiento porque Zustand compara el resultado del selector con Object.is() y solo re-renderiza si cambió. Sin selector (usando useStore()), el componente se re-renderiza con cualquier cambio del store. Los selectores evitan este problema permitiendo que componentes solo consuman lo que necesitan.',
      consejo: 'Si el selector retorna un objeto nuevo cada vez ({ name, age }), usa shallow comparison: useStore(state => ({ name: state.name }), shallow) para evitar re-renders innecesarios.'
    },
    {
      pregunta: '¿Cómo funciona la persistencia en Zustand?',
      respuesta: `Zustand ofrece un middleware persist que guarda automáticamente el store en localStorage (o sessionStorage). Se usa con: import { persist } from 'zustand/middleware'; const useStore = create(persist((set) => ({...}), { name: 'store-key' })). Al recargar la página, Zustand lee de localStorage y restaura el estado. Se pueden configurar: nombre de la key, storage personalizado (sessionStorage), y un whitelisting/blacklisting de qué propiedades persistir.`,
      consejo: 'Persist funciona con JSON.parse/JSON.stringify, así que no puedes persistir funciones o valores no serializables. Menciona esto en entrevistas.'
    },
    {
      pregunta: '¿Cuándo usar Zustand vs Context API?',
      respuesta: 'Usa Zustand cuando: el estado cambia frecuentemente (evita re-renders innecesarios con selectores), necesitas herramientas de debugging (devtools middleware), quieres persistencia automática, el estado se accede desde múltiples componentes no relacionados, o necesitas mutate el estado fuera de componentes React. Context es mejor para: estados que cambian muy poco (tema, idioma), prototipos rápidos sin dependencias, o cuando ya tienes un Provider anidado.',
      consejo: 'Zustand puede reemplazar Context completamente, pero Context sigue siendo útil para dependencias nativas sin necesidad de npm install.'
    },
    {
      pregunta: '¿Cómo se maneja el estado asíncrono en Zustand?',
      respuesta: `Las acciones dentro del store pueden ser async. Ejemplo: const useStore = create((set) => ({ users: [], fetchUsers: async () => { set({ loading: true }); const data = await fetch('/api/users'); const json = await data.json(); set({ users: json, loading: false }); } })). También puedes usar el middleware devtools para debugging y combine para combinar múltiples stores. Para estado del servidor (data fetching con caché), Zustand NO reemplaza a React Query — son complementarios.`,
      consejo: 'Menciona que Zustand maneja estado del cliente/global, mientras React Query maneja estado del servidor. Usar ambos juntos es el patrón más común.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Zustand"
      descripcion="Preguntas frecuentes sobre Zustand con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}