import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function StatePreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es el estado (state) en React?',
      respuesta: 'El estado es un objeto que contiene datos específicos de un componente que pueden cambiar con el tiempo. Cuando el estado cambia, React re-renderiza el componente para reflejar esos cambios en la interfaz. Se crea con useState() en componentes de función, que retorna el valor actual y una función para actualizarlo. El estado es privado e interno al componente — ningún componente externo puede leer ni modificar el estado de otro directamente.',
      consejo: 'Distingue claramente: props son datos del padre, estado son datos internos del componente que el componente mismo gestiona.'
    },
    {
      pregunta: '¿Por qué el estado debe ser inmutable?',
      respuesta: 'El estado debe ser inmutable porque React compara el estado anterior con el nuevo usando Object.is() para decidir si re-renderizar. Si mutas un objeto o array directamente, React detecta que la referencia es la misma y NO actualiza la UI, causando bugs sutiles. Al crear nuevos objetos/arrays (con spread operator o métodos que retornan nuevos arrays), React ve una nueva referencia y re-renderiza correctamente. Esta inmutabilidad también facilita el "time-travel debugging" y el undo/redo.',
      consejo: 'Para objetos usa { ...obj, prop: newVal }, para arrays usa filter/map/slice (nunca push/splice directamente). Nunca mutes el state directamente como state.x = 1.'
    },
    {
      pregunta: '¿Cómo se actualiza el estado en React?',
      respuesta: 'Se usa la función setState (el segundo valor retornado por useState): setState(nuevoValor). Hay dos formas: 1) Directo: setState(5) — reemplaza el valor. 2) Función updater: setState(prev => prev + 1) — usa el valor anterior. La forma funcional es preferida cuando el nuevo estado depende del anterior, porque garantiza que siempre trabaja con el valor más reciente, especialmente en actualizaciones agrupadas y dentro de setTimeout/callbacks.',
      consejo: 'Explica que setState es asíncrono (batching), por eso puedes ver un estado "stale" si intentas leerlo justo después de actualizarlo.'
    },
    {
      pregunta: '¿Cuándo usar useState vs useReducer?',
      respuesta: 'useState es ideal para estados simples: un string, un boolean, un número, o un objeto con 2-3 propiedades. useReducer es mejor cuando: el estado tiene múltiples sub-valores relacionados, las transiciones de estado son complejas (requieren lógica de varias líneas), el estado siguiente depende del anterior de formas no triviales, o quieres centralizar la lógica de actualización para mayor testabilidad. useReducer se inspira en Redux pero sin la dependencia externa.',
      consejo: 'Un indicador práctico: si tu componente tiene más de 2 useState que siempre se actualizan juntos, probablemente should useReducer sea mejor.'
    },
    {
      pregunta: '¿Qué es el batching de actualizaciones en React?',
      respuesta: 'El batching es el comportamiento donde React agrupa múltiples llamadas a setState en una sola re-renderización en lugar de re-renderizar después de cada una. Esto es crucial para el rendimiento porque evita re-renders innecesarios. En React 18, el batching ocurre automáticamente en todos los contextos, incluyendo promesas, timeouts y event handlers nativos. Ejemplo: sin batching, 3 llamadas a setState harían 3 renders; con batching, solo 1.',
      consejo: 'Si necesitas forzar una actualización síncrona fuera del batching, usa flushSync de React, aunque es raro necesitarlo.'
    },
    {
      pregunta: '¿Qué es el estado elevado (lifting state up)?',
      respuesta: 'Es un patrón donde se mueve el estado de un componente hijo a su componente padre común más cercano, para que varios componentes hermanos puedan compartir y sincronizar los mismos datos. El padre mantiene el estado y lo pasa a los hijos como props, recibiendo callbacks para actualizarlo. Esto es fundamental en React porque no hay forma directa de que dos componentes hermanos compartan estado sin un padre intermedio.',
      consejo: 'Menciona que este patrón es la razón por la cual a veces se necesita un componente "layout" o "container" que coordine varios componentes "presentacionales".'
    },
    {
      pregunta: '¿Cómo se manejan formularios en React?',
      respuesta: 'Los formularios se manejan con "controlled components": el valor del input se almacena en el estado del componente, se pasa como prop value, y se actualiza con onChange usando setState. Esto da control total sobre los inputs. También existen los "uncontrolled components" donde el DOM mantiene el estado y se accede con ref, que es más rápido para casos simples. Para formularios complejos, se usa react-hook-form que combina ambos enfoques.',
      consejo: 'Menciona que react-hook-form es más performático porque reduce re-renders al no usar controlled inputs para cada campo.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Estado (State)"
      descripcion="Preguntas frecuentes sobre el manejo de estado en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}