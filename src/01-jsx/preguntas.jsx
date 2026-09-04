import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function JSXPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es JSX y por qué se usa en React?',
      respuesta: 'JSX (JavaScript XML) es una extensión de sintaxis que permite escribir marcado de tipo HTML dentro de JavaScript. Se usa porque hace que el código sea más legible y facilita la creación de interfaces de usuario. Internamente, el compilador de React transforma JSX en llamadas a React.createElement(), por lo que cada elemento JSX se convierte en un objeto que React puede renderizar. La gran ventaja es que puedes "ver" la UI directamente en tu código de componente.',
      consejo: 'Menciona que JSX no es obligatorio — podrías usar React.createElement() directamente, pero JSX mejora la legibilidad y reduce errores.'
    },
    {
      pregunta: '¿Por qué se usa className en lugar de class?',
      respuesta: 'Porque JSX se compila a JavaScript y "class" es una palabra reservada en JavaScript. React decidió usar className para evitar conflictos. Esto es solo aplicable al atributo HTML "class"; el resto de atributos de HTML funcionan igual en JSX, aunque por convención usan camelCase, como onClick, onSubmit o htmlFor.',
      consejo: 'También menciona que algunos atributos cambian su nombre en React, como htmlFor en lugar de for, o style recibe un objeto.'
    },
    {
      pregunta: '¿Cómo se renderizan listas en JSX? ¿Y por qué se necesita un key?',
      respuesta: 'Para renderizar listas en JSX se usa el método map() de JavaScript, que transforma cada elemento de un array en un elemento JSX. El atributo key es esencial porque le ayuda a React a identificar qué elementos han cambiado, se han agregado o se han eliminado. Sin una key estable, React puede re-crear elementos innecesariamente o producir errores al actualizar la interfaz, lo que además degrada el rendimiento.',
      consejo: 'Añade que la key debería ser un identificador único y estable (como un id de la base de datos), y NO el índice del array, porque si los items cambian de posición, React pierde el seguimiento correcto y puede causar bugs de estado.'
    },
    {
      pregunta: '¿Cómo funciona el renderizado condicional en JSX?',
      respuesta: 'En JSX hay varias formas de hacer renderizado condicional. Las principales son: el operador ternario (condicion ? valorA : valorB), el operador lógico && (condicion && elemento, que muestra el elemento solo si la condición es verdadera), y la declaración if/else fuera del return. El ternario y el && se usan dentro del JSX, mientras que if/else se usa antes del return para calcular qué renderizar.',
      consejo: 'Explica que el && muestra el elemento solo si la condición es true, y en JS "0 && x" devuelve "0", lo que puede renderizar el número 0 accidentalmente. Es un bug común a mencionar.'
    },
    {
      pregunta: '¿Qué son los Fragmentos (Fragments) y cuándo usarlos?',
      respuesta: 'Los Fragmentos permiten agrupar varios elementos JSX sin agregar un nodo extra al DOM. Se escriben como <>...</> o <Fragment>. Se usan cuando necesitas retornar múltiples elementos pero no quieres envolverlos en un <div>, lo cual es clave para: mantener el HTML válido (por ejemplo, dentro de tablas donde solo se permiten ciertas etiquetas), evitar divs innecesarios que ensucian el DOM y afectan el CSS/layout.',
      consejo: 'Menciona que React Fragment también acepta una key, a diferencia de la sintaxis corta <>...</>.'
    },
    {
      pregunta: '¿Cuál es la diferencia entre JSX y HTML?',
      respuesta: 'Aunque visualmente son similares, hay diferencias clave: 1) JSX se escribe dentro de JavaScript y usa camelCase para los atributos (onClick, className, htmlFor); 2) El contenido dinámico se inserta con llaves {}; 3) style en JSX es un objeto JavaScript con propiedades en camelCase (por ejemplo { backgroundColor: "red" } en lugar de background-color); 4) En JSX deben cerrarse todas las etiquetas incluso las auto-cerrables (<img />); 5) las funciones de evento se pasan como props y el objeto event es sintético de React.',
      consejo: 'Un detalle que destaca: en HTML no puedes mezclar lógica, en JSX sí, porque es JavaScript.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: JSX"
      descripcion="Preguntas frecuentes sobre JSX con respuestas recomendadas para responder en una entrevista técnica."
      preguntas={preguntas}
    />
  );
}