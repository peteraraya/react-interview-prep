import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function ReactQueryPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es React Query (TanStack Query) y por qué se usa?',
      respuesta: 'React Query es una librería para manejar el estado del servidor en React. Resuelve problemas comunes: caché de datos, reintentos automáticos, refetching en foco de ventana, paginación, optimistic updates, y sincronización entre pestañas. Sin React Query, cada componente que fetcha datos necesita manejar manualmente loading, error, data, y caching. React Query abstrae toda esa lógica con hooks como useQuery, useMutation, y useInfiniteQuery.',
      consejo: 'React Query NO es un reemplazo de Redux/Zustand — maneja datos del servidor, no estado de UI global.'
    },
    {
      pregunta: '¿Cómo funciona useQuery?',
      respuesta: 'useQuery recibe un objeto con: queryKey (identificador único para caché, como un array ["users", 1]) y queryFn (función async que retorna los datos). Retorna: data, isLoading, isError, error, refetch, etc. La primera vez ejecuta la query, muestra loading, luego cachea el resultado. En consultas futuras con la misma queryKey, retorna el caché inmediatamente y refetchea en background si está stale. staleTime controla cuándo el caché se considera obsoleto.',
      consejo: 'queryKey es la clave del caché — cambia cuando los parámetros cambian. Ejemplo: ["user", userId] se re-ejecuta cuando userId cambia.'
    },
    {
      pregunta: '¿Qué son las optimistic updates?',
      respuesta: 'Son actualizaciones que modifican el caché local ANTES de confirmar con el servidor, para que la UI responda inmediatamente. En React Query: 1) onMutate: guardar snapshot actual, actualizar caché. 2) onError: revertir el caché al snapshot. 3) onSettled: refetch para sincronizar con servidor. Mejora la percepción de velocidad pero requiere manejo cuidadoso de errores para revertir cambios si la petición falla.',
      consejo: 'Úsalas para operaciones de bajo riesgo (like, follow). Para operaciones destructivas (delete), mejor usa confirmación.'
    },
    {
      pregunta: '¿Cuál es la diferencia entre staleTime y cacheTime?',
      respuesta: 'staleTime: tiempo (en ms) que los datos se consideran "frescos". Mientras estén frescos, no se refetchean al hacer focus o re-montar el componente. Default: 0 (siempre stale). cacheTime: tiempo que los datos permanecen en caché después de que ningún componente los usa. Default: 5 minutos. Cuando expira, se limpian de memoria. staleTime afecta la frescura, cacheTime afecta la persistencia en memoria.',
      consejo: 'Si necesitas que los datos siempre sean frescos (datos en tiempo real), usa staleTime: 0. Si son datos estáticos que cambian poco, usa staleTime alto.'
    },
    {
      pregunta: '¿Qué es useMutation?',
      respuesta: 'useMutation es el hook para operaciones que modifican datos en el servidor (POST, PUT, DELETE). Retorna: mutate/mutateAsync, isLoading, isError, error, isSuccess. Se diferencia de useQuery en que NO se ejecuta automáticamente — se llama manualmente. Soporta optimistic updates a través de onMutate, y puede invalidar queries relacionadas con queryClient.invalidateQueries para refetchear datos después de una mutación exitosa.',
      consejo: 'Patrón común: después de mutación exitosa, invalidar la query relacionada para que React Query refetchee los datos actualizados.'
    },
    {
      pregunta: '¿Qué es useInfiniteQuery?',
      respuesta: 'useInfiniteQuery extiende useQuery para manejar paginación infinita o infinite scroll. Recibe queryKey, queryFn (con pageParam), y getNextPageParam. Retorna: data (con pages y pageParams), fetchNextPage, hasNextPage, isFetchingNextPage. Cuando el usuario hace scroll hasta el final, se llama fetchNextPage para cargar más datos. El caché acumula todas las páginas. Es ideal para listas largas donde se carga contenido dinámicamente.',
      consejo: 'getNextPageParam debe retornar el cursor o página siguiente. Si retorna undefined, se asume que no hay más datos.'
    },
    {
      pregunta: '¿Cómo se invalida el caché de React Query?',
      respuesta: 'Se usa queryClient.invalidateQueries({ queryKey: ["users"] }). Esto marca todas las queries cuya key empiece con ["users"] como stale, y si hay un componente montado que usa esa key, refetchea automáticamente. También se puede invalidar por queryKey específica ["users", 1] o por predicate (función que filtra qué queries invalidar). Es fundamental después de mutaciones para mantener la UI sincronizada con el servidor.',
      consejo: 'invalidateQueries es asíncrono — si necesitas hacer algo después, usa await queryClient.invalidateQueries(...).'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: React Query (TanStack Query)"
      descripcion="Preguntas frecuentes sobre React Query con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}