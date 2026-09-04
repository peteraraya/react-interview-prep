import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function PatternsPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es un Error Boundary?',
      respuesta: 'Un Error Boundary es un componente que captura errores de JavaScript de sus componentes hijos durante el renderizado, ciclos de vida y constructores, y muestra un fallback UI en lugar de crashear toda la aplicación. Solo funciona con class components (tiene getDerivedStateFromError y componentDidCatch). Se coloca estratégicamente en la UI para aislar secciones que podrían fallar sin afectar el resto.',
      consejo: 'Los Error Boundaries NO capturan errores en eventos handlers, código asíncrono, ni server-side rendering.'
    },
    {
      pregunta: '¿Qué es un Higher-Order Component (HOC)?',
      respuesta: 'Un HOC es una función que recibe un componente y retorna un nuevo componente con funcionalidad adicional. Ejemplo: withAuth(Component) retorna una versión del componente que verifica autenticación. Es un patrón de composición que permite reutilizar lógica sin herencia. Aunque es un patrón clásico de React, hoy en día los custom hooks son preferidos para reutilizar lógica con estado.',
      consejo: 'Los HOCs siguen siendo útiles para lógica que no depende de estado (wrapping, logging, acceso a contexto).'
    },
    {
      pregunta: '¿Qué son los Render Props?',
      respuesta: 'Los Render Props son un patrón donde un componente recibe una función como prop (usualmente "render" o "children") y la ejecuta con datos que quiere compartir. Ejemplo: <DataFetcher render={(data) => <List items={data} />}>. El componente DataFetcher maneja la lógica de fetching y pasa los datos al render prop. Permite reutilizar lógica sin HOCs ni hooks, aunque hoy en día los hooks son más comunes.',
      consejo: 'Los render props son un patrón legacy — los custom hooks los reemplazaron para la mayoría de casos, pero es bueno conocerlos.'
    },
    {
      pregunta: '¿Qué son los Compound Components?',
      respuesta: 'Son un grupo de componentes relacionados que trabajan juntos y comparten estado implícito (a través de React Context). Ejemplo: <Select> <Option>...</Option> </Select> donde Select provee el contexto y Option lo consume. El usuario no necesita pasar props manualmente entre ellos — el estado fluye internamente. Crea APIs de componentes elegantes y fáciles de usar.',
      consejo: 'Ejemplos en la práctica: Accordion/Panel, Tabs/Tab, Menu/MenuItem. Mencionar este patrón demuestra conocimiento profundo de React.'
    },
    {
      pregunta: '¿Cuándo usar Controlled vs Uncontrolled components?',
      respuesta: 'Controlled: React controla el valor del input a través de useState. Ideal para: formularios con validación en tiempo real, valores que dependen de otros campos, o submit personalizado. Uncontrolled: el DOM mantiene el valor, se accede con useRef. Ideal para: campos simples, integración con librerías de terceros, o cuando no necesitas controlar el valor en cada render.',
      consejo: 'react-hook-form combina ambos enfoques: usa uncontrolled por defecto y controlled solo cuando es necesario (Controller).'
    },
    {
      pregunta: '¿Qué es la composición vs herencia en React?',
      respuesta: 'React promueve la composición sobre la herencia. En lugar de crear clases base que se extienden, se crean componentes pequeños que se componen. Ejemplo: en lugar de ButtonBase con todas las variantes, crear Button que recibe variant como prop, o componer <IconButton><Icon /> <Text /></IconButton>. La composición es más flexible, testeable, y mantiene los componentes simples y con responsabilidad única.',
      consejo: 'Menciona que React no tiene herencia de clases de componentes (a diferencia de frameworks como Angular). La composición es el patrón nativo.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Patrones y Arquitectura"
      descripcion="Preguntas frecuentes sobre patrones de diseño en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}