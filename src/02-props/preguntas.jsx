import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function PropsPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué son las props en React?',
      respuesta: 'Las props (abreviatura de "properties") son el mecanismo que usa React para pasar datos de un componente padre a un componente hijo. Funcionan como argumentos de una función: se declaran como un objeto con propiedades. Las props son de solo lectura (inmutables) — un componente hijo nunca debe modificar sus props directamente. Si necesita comunicar datos al padre, debe usar un callback (una función que el padre pasa como prop y el hijo ejecuta).',
      consejo: 'Destaca la analogía: los componentes son como funciones, las props son como los parámetros, y el valor retornado es lo que se renderiza.'
    },
    {
      pregunta: '¿Por qué las props son inmutables?',
      respuesta: 'Las props son inmutables porque React implementa un patrone unidireccional de datos: la información fluye de arriba hacia abajo (padre → hijo). Si un componente pudiera modificar sus props, violaría este flujo y crearía bugs difíciles de depurar. Además, React compara props con Object.is() en cada render para decidir si re-renderizar un componente. Si una prop mutara, React no podría hacer esta comparación eficientemente. Este patrón también hace que el código sea más predecible, testeable y fácil de razonar.',
      consejo: 'Si necesitas estado modificable, menciona que se usa useState y que los callbacks de actualización se pasan como props (ej. onChange, onDelete).'
    },
    {
      pregunta: '¿Qué es el children prop?',
      respuesta: 'children es un prop especial que contiene lo que se escribe entre las etiquetas de apertura y cierre de un componente. Permite crear componentes de "envoltorio" (wrapper) altamente reutilizables. Se puede acceder a él como props.children, o en React 18+ se puede recibir directamente como parámetro destructurado. Un caso de uso común es crear componentes de layout, cards, modales o cualquier componente que necesite encapsular contenido dinámico.',
      consejo: 'Menciona que children puede ser un string, un número, un JSX element, un array o incluso una función (render props pattern).'
    },
    {
      pregunta: '¿Cómo se definen valores por defecto en props?',
      respuesta: 'Hay dos formas: 1) Usando destructuring con valores por defecto directamente en los parámetros de la función: function Component({ name = "Default", count = 0 }) {}. 2) Usando defaultProps (legacy, ya deprecated en componentes de función). La forma recomendada es la primera porque es más explícita, funciona con TypeScript y no requiere configuración adicional. En componentes de clase, defaultProps sigue siendo válido pero no es preferido.',
      consejo: 'En entrevistas también menciona que propTypes (librería) ya no se usa tanto hoy en día porque TypeScript cubre esta necesidad de forma estática.'
    },
    {
      pregunta: '¿Cómo se comunican componentes padre e hijo?',
      respuesta: 'En React, la comunicación es unidireccional: el padre pasa datos al hijo a través de props, y el hijo se comunica con el padre a través de callbacks (funciones que el padre define y pasa como props). Por ejemplo, un componente hijo puede llamar a una prop llamada onAdd(item) para notificar al padre que se agregó algo. Esta bidireccionalidad lograda con callbacks mantiene el patrone de datos unidireccional que React promueve.',
      consejo: 'Si te preguntan por comunicación entre componentes hermanos, explica que se hace a través del componente común más cercano, o se usa Context/Zustand.'
    },
    {
      pregunta: '¿Qué es prop drilling y cómo se evita?',
      respuesta: 'El prop drilling ocurre cuando necesitas pasar una prop a través de varios niveles de componentes intermedios que no la usan, solo porque un componente más profundo la necesita. Es un problema porque acopla componentes innecesariamente y hace el código difícil de mantener. Se evita usando: Context API (para estados que necesitan muchos componentes), Zustand u otros state managers (para estados complejos), o reestructurando los componentes para minimizar la profundidad de la jerarquía.',
      consejo: 'Prop drilling no siempre es un problema — para 1-2 niveles es completamente aceptable. Menciona que Context tiene el costo de re-renders cuando el valor cambia.'
    },
    {
      pregunta: '¿Cómo se validan las props de un componente?',
      respuesta: 'Históricamente se usaba la librería PropTypes con propTypes: { name: PropTypes.string.isRequired }, pero hoy en día la forma más recomendada es TypeScript, que ofrece tipado estático. Con TypeScript se define la interfaz del componente: interface Props { name: string; age?: number }, y el compilador verifica que se pasen las props correctas tanto en desarrollo como en build time, antes de que el código llegue al navegador.',
      consejo: 'Menciona que PropTypes verifica en runtime (solo en desarrollo) mientras que TypeScript lo hace en compile-time (siempre), lo que es mucho más robusto.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Props"
      descripcion="Preguntas frecuentes sobre props en React con respuestas recomendadas para entrevistas técnicas."
      preguntas={preguntas}
    />
  );
}