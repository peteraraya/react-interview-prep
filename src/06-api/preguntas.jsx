import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function APIPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Cómo se obtienen datos de una API en React?',
      respuesta: 'La forma más común es usar fetch() o axios dentro de useEffect. El patrón es: 1) Declarar estado para data, loading y error. 2) Crear una función async dentro de useEffect que haga la petición. 3) Llamar a la función. 4) Manejar el loading y los errores. 5) Retornar cleanup con AbortController para cancelar peticiones pendientes. Para aplicaciones complejas se usa React Query (TanStack Query) que maneja caché, reintentos, paginación y estados del servidor de forma automática.',
      consejo: 'Nunca hagas fetch directamente en el cuerpo del componente — siempre dentro de useEffect para evitar peticiones infinitas en cada render.'
    },
    {
      pregunta: '¿Qué es el manejo de loading y error en peticiones?',
      respuesta: 'Todo componente que haga una petición debería manejar tres estados: loading (la petición está en curso), error (la petición falló), y data (los datos se recibieron correctamente). El patrón es crear tres variables de estado: [loading, setLoading] = useState(true), [error, setError] = useState(null), [data, setData] = useState(null). En la petición: setLoading(true), try/catch con setError en el catch, setData con los datos, y setLoading(false) en finally. Esto permite mostrar indicadores de carga y mensajes de error al usuario.',
      consejo: 'Menciona que React Query maneja estos tres estados automáticamente y añade caché, reintentos y stale-while-revalidate.'
    },
    {
      pregunta: '¿Cómo se cancelan peticiones pendientes en React?',
      respuesta: 'Con AbortController de la API nativa. Se crea un controller dentro de useEffect, se pasa su signal al fetch, y se retorna controller.abort() como cleanup. Si el componente se desmonta antes de que la petición termine, el abort cancela la conexión. Sin esto, la petición puede completar y intentar actualizar el estado de un componente desmontado, causando memory leaks y warnings en la consola de React. También funciona con axios usando AbortController.',
      consejo: 'Patrón básico: const controller = new AbortController(); fetch(url, { signal: controller.signal }); return () => controller.abort();'
    },
    {
      pregunta: '¿Cuál es la diferencia entre fetch y axios?',
      respuesta: 'fetch es la API nativa del navegador, no necesita dependencias, retorna promises. Axios es una librería externa que ofrece ventajas: interceptors (middleware para requests/responses), manejo automático de JSON (response.data), timeout configurable, cancelación más sencilla, y mejor soporte de errores (lanza error en status codes 4xx/5xx). En React moderno, la mayoría usa fetch nativo o React Query que abstrae la capa de red. Axios es preferido cuando necesitas configuración avanzada como interceptors.',
      consejo: 'fetch no lanza error en respuestas HTTP 4xx/5xx — solo en errores de red. Axios sí lanza error en ambos casos.'
    },
    {
      pregunta: '¿Cómo se implementa paginación en una API?',
      respuesta: 'Depende de la API: 1) Paginación por offset: envías page y limit como query params (GET /api/users?page=2&limit=10). 2) Cursor-based: envías un cursor que indica dónde quedaste (GET /api/users?cursor=abc123&limit=10), es mejor para datasets grandes. 3) Infinite scroll: se carga más contenido cuando el usuario llega al final de la lista usando IntersectionObserver. React Query soporta paginación con useInfiniteQuery que maneja automáticamente la carga de más páginas.',
      consejo: 'Menciona que infinite scroll es más UX-friendly pero hay que tener cuidado con memoria. También menciona que React Query tiene staleTime para controlar cuándo re-fetchear.'
    },
    {
      pregunta: '¿Cómo se hace actualización optimista (optimistic update)?',
      respuesta: 'Es cuando se muestra el cambio en la UI inmediatamente antes de confirmar con el servidor. Patrón: 1) Actualizar el caché local inmediatamente (setQueryData en React Query). 2) Hacer la petición al servidor. 3) Si falla, revertir el cambio con los datos originales. Esto mejora la percepción de velocidad pero hay que manejar errores correctamente. Si la petición falla, el usuario debe ver el cambio revertido sin sorpresas. React Query facilita esto con onMutate y onError.',
      consejo: 'Las optimistic updates son ideales para like, follow, o small edits. Para operaciones destructivas (delete), mejor mostrar un confirm dialog primero.'
    },
    {
      pregunta: '¿Qué es React Query y por qué se usa?',
      respuesta: 'React Query (TanStack Query) es una librería que maneja el estado del servidor: caché, sincronización, actualizaciones, reintentos y freshness de datos. En lugar de manejar data/loading/error manualmente con useState, React Query ofrece useQuery que hace todo automáticamente. Ventajas: caché entre componentes, background refetching, stale-while-revalidate, paginación con useInfiniteQuery, optimistic updates, y cleanup automático. Reduce boilerplate significativamente en comparación con fetch manual.',
      consejo: 'React Query NO reemplaza el estado global (Redux/Zustand) — maneja datos del servidor, mientras que el estado global maneja UI state y datos del cliente.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: API / Data Fetching"
      descripcion="Preguntas frecuentes sobre obtención de datos en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}