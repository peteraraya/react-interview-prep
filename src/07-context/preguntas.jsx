import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function ContextPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es Context API y para qué sirve?',
      respuesta: 'Context API es una herramienta nativa de React que permite compartir datos entre componentes sin prop drilling. Se compone de: createContext (crea el contexto), Provider (envuelve la parte del árbol que necesita acceso), y useContext (consume el contexto). Es ideal para datos que muchos componentes necesitan simultáneamente como tema (dark/light), idioma, autenticación, o carrito de compras.',
      consejo: 'Context no es un reemplazo de Zustand o Redux — es más ligero pero tiene limitaciones como la falta de selectores y el re-render de todos los consumers cuando cambia el valor.'
    },
    {
      pregunta: '¿Cuándo usar Context vs un state manager como Zustand?',
      respuesta: 'Context es suficiente para: datos que cambian poco frecuentemente (tema, idioma), datos que muchos componentes necesitan, y prototipos simples. Usa Zustand/Redux cuando: el estado cambia frecuentemente, necesitas selectores para evitar re-renders innecesarios, tienes lógica de estado compleja, necesitas herramientas de debugging (devtools), o quieres persistencia automática. Zustand es más ligero que Redux y ofrece mejor rendimiento que Context con selectores.',
      consejo: 'Context tiene el problema de que cuando el valor cambia, TODOS los consumers se re-renderizan, incluso si no usan la parte del valor que cambió.'
    },
    {
      pregunta: '¿Cómo evitar re-renders innecesarios con Context?',
      respuesta: 'Estrategias: 1) Dividir contextos: tener un contexto para datos y otro para funciones, para que los componentes que solo necesitan funciones no se re-rendericen. 2) Usar useMemo para el valor del Provider. 3) Extraer el Provider a un componente separado. 4) Usar Zustand en lugar de Context (tiene selectores built-in). 5) React.memo en componentes hijos. 6) La más efectiva: si el estado cambia frecuentemente, Considera reemplazar Context con un state manager ligero.',
      consejo: 'La forma más común es dividir el contexto: ValueContext y DispatchContext, para que los componentes que solo dispatch no re-rendericen con cambios de valor.'
    },
    {
      pregunta: '¿Cómo funciona useContext?',
      respuesta: 'useContext es un hook que consume un contexto creado con createContext. Retorna el valor más cercano del Provider en el árbol de componentes. Si el contexto tiene un valor por defecto y no hay Provider encima, retorna ese valor. Si hay varios Providers del mismo contexto, el más cercano al componente que llama a useContext "gana". Es importante que useContext cause re-render cuando el valor del Provider cambia, por lo que se debe usar con cuidado para evitar re-renders en cadena.',
      consejo: 'Un error común es usar useContext dentro de un useEffect sin incluirlo como dependencia. Aunque useCallback no es necesario para useContext, las dependencias deben mantenerse actualizadas.'
    },
    {
      pregunta: '¿Qué es useReducer y cómo se relaciona con Context?',
      respuesta: 'useReducer es un hook que implementa el patrón reducer (similar a Redux): recibe un reducer (función pura con estado actual + acción, retorna nuevo estado) y un estado inicial. Retorna [state, dispatch]. Se relaciona con Context porque frecuentemente se combinan: Context para proveer state y dispatch al árbol, y useReducer para manejar la lógica de actualización del estado de forma centralizada. Esta combinación crea un mini-Redux sin dependencias externas.',
      consejo: 'useReducer es preferido sobre useState cuando el estado tiene transiciones complejas, múltiples valores relacionados, o quieres testear la lógica de actualización de forma aislada.'
    },
    {
      pregunta: '¿Cómo se implementa un Theme Context (dark/light mode)?',
      respuesta: 'Patrón: 1) Crear contexto: ThemeContext = createContext(). 2) Crear Provider con useState para el tema actual. 3) Proveer valor { theme, toggleTheme }. 4) Los hijos consumen con useContext(ThemeContext). 5) El Provider aplica clase CSS al body o al wrapper principal. 6) Persistir en localStorage para que el tema se mantenga al recargar. 7) Usar CSS variables o class toggling para cambiar estilos. Este es un caso de uso clásico de Context porque el tema cambia poco y muchos componentes lo necesitan.',
      consejo: 'Para persistir el tema, guarda en localStorage en el Provider y lee al inicializar. También menciona prefers-color-scheme para respetar la preferencia del sistema operativo.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Context API"
      descripcion="Preguntas frecuentes sobre Context API en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}