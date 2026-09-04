import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function TestingPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es React Testing Library (RTL)?',
      respuesta: 'RTL es una librería de testing para componentes React que promueve probar la interfaz de usuario como la vería un usuario final, en lugar de testear la implementación interna. Se basa en ReactDOM y no expone APIs internas de React, lo que fomenta tests más robustos que no se rompen al refactorizar.',
      consejo: 'Enfatiza que RTL se enfoca en comportamiento visible, no en implementación interna.'
    },
    {
      pregunta: '¿Cuál es la diferencia entre getByRole y getByText?',
      respuesta: 'getByRole busca elementos por su rol ARIA (botón, enlace, input, etc.), lo que es más accesible y refleja cómo un usuario de lectura de pantalla interactúa con la UI. getByText busca por contenido de texto visible. Preferir getByRole porque es más cercano a la experiencia real del usuario y promueve buenas prácticas de accesibilidad.',
      consejo: 'Menciona que RTL sugiere usar getByRole primero porque es más resiliente ante cambios de estilos o estructura.'
    },
    {
      pregunta: '¿Cómo se testean componentes asíncronos?',
      respuesta: 'Usando findBy queries (que esperan a que el elemento aparezca), act() para envolver actualizaciones de estado, y waitFor para esperar condiciones. Ejemplo: const element = await screen.findByText("Loaded"). También se puede usar userEvent para simular interacciones asíncronas. El patrón es: render, act/interact, await resultado, asertar.',
      consejo: 'Evita usar waitFor innecesariamente — findBy ya hace eso internamente.'
    },
    {
      pregunta: '¿Qué es un mock y cómo se usa en React?',
      respuesta: 'Un mock es una implementación falsa de una dependencia (API, función, módulo) que se usa para aislar el componente que se está testeando. Jest ofrece jest.mock() para mockear módulos, jest.fn() para crear funciones mock, y jest.spyOn() para espiar llamadas. En RTL, se mockean fetch, servicios, o contextos para controlar el entorno de testing.',
      consejo: 'Menciona que los mocks deben ser lo más simples posibles y solo mockear lo que es necesario para la prueba.'
    },
    {
      pregunta: '¿Cómo se testean formularios?',
      respuesta: 'Usando userEvent para simular escritura y clicks: await userEvent.type(input, "texto"), await userEvent.click(button). Luego se aserta el resultado: expect(input).toHaveValue("texto"), expect(screen.getByText("Mensaje de éxito")).toBeInTheDocument(). Para errores de validación, se envía el formulario y se verifica que aparezca el mensaje de error.',
      consejo: 'Usa userEvent en lugar de fireEvent porque simula mejor el comportamiento real del teclado/mouse.'
    },
    {
      pregunta: '¿Qué es un snapshot test?',
      respuesta: 'Un snapshot test guarda la salida renderizada de un componente en un archivo .snap y lo compara con futuros renders. Si el componente cambia, el test falla y muestra la diferencia. Es útil para detectar cambios no intencionados en la UI. Sin embargo, se recomienda no abusar de ellos porque pueden volverse difíciles de mantener y no validan comportamiento.',
      consejo: 'Los snapshots son útiles como complemento, no como único tipo de test. Combínalos con tests de comportamiento.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Testing"
      descripcion="Preguntas frecuentes sobre testing en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}