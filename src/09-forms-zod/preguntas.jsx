import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function FormsPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Por qué usar react-hook-form en lugar de formularios controlados?',
      respuesta: 'react-hook-form reduce drásticamente los re-renders porque no usa controlled inputs por defecto (no actualiza el estado en cada keystroke). Internamente usa refs y unегистрация, lo que es mucho más eficiente para formularios grandes con muchos campos. También ofrece: validación integrada, manejo de errores, soporte para field arrays (agregar/eliminar campos dinámicamente), y un API minimalista con useForm(). En formularios controlados, cada tecla dispara un re-render; en react-hook-form, solo se re-renderiza cuando es necesario.',
      consejo: 'Menciona que react-hook-form usa "uncontrolled components" por defecto y solo hace "controlled" cuando lo necesitas (con Controller).'
    },
    {
      pregunta: '¿Qué es Zod y cómo se integra con react-hook-form?',
      respuesta: 'Zod es una librería de validación de esquemas para TypeScript (y JavaScript) que define la forma de tus datos con un esquema declarativo. Se integra con react-hook-form a través del resolver zodResolver: useForm({ resolver: zodResolver(schema) }). Esto conecta la validación de Zod con el sistema de errores de react-hook-form. Ventajas de Zod: inferencia de tipos (Zod.infer<typeof schema>), validaciones encadenadas (.email().min(5)), y mensajes de error personalizables.',
      consejo: 'Con TypeScript, Zod puede inferir el tipo automáticamente: type FormData = z.infer<typeof schema>, eliminando la duplicación de tipos.'
    },
    {
      pregunta: '¿Qué son los Field Arrays y cuándo se usan?',
      respuesta: 'Los Field Arrays permiten manejar listas dinámicas de campos dentro de un formulario (ej: agregar múltiples emails, direcciones, o items). react-hook-form ofrece useFieldArray que retorna: fields (array de items), append (agregar), remove (eliminar), move (reordenar). Cada field tiene un id único para key. Es útil para formularios donde el usuario puede agregar/quitar secciones dinámicamente sin crear un re-render por cada cambio.',
      consejo: 'Usa key={field.id} (no el index) para mantener el estado correcto cuando se eliminan o reordenan items.'
    },
    {
      pregunta: '¿Cómo se maneja la validación asíncrona en formularios?',
      respuesta: 'react-hook-form soporta validación asíncrona a través del resolver de Zod o validaciones personalizadas. Ejemplo: validar que un email no exista en la base de datos. Con Zod, puedes usar .refine() o .superRefine() que soportan funciones async. Con react-hook-form, puedes usar validate en el register. La validación asíncrona se ejecuta después de la síncrona y se muestra como error cuando termina. Es importante mostrar un indicador de loading durante la validación.',
      consejo: 'Evita validaciones asíncronas innecesarias — solo úsalas para validaciones server-side que no se pueden hacer en el cliente.'
    },
    {
      pregunta: '¿Cómo se resetea un formulario con react-hook-form?',
      respuesta: 'El método reset() de useForm permite resetear todos los valores del formulario: reset() para valores vacíos, reset({ name: "default" }) para valores por defecto. También soporta reset con un objeto del servidor (útil para edición). Después de reset, el formulario se marca como "pristine" (no sucio). Se puede combinar con el parámetro keepErrors para mantener errores de validación al resetear. Para resetear un campo específico, usa setValue.',
      consejo: 'reset() también actualiza defaultValues, así que si el usuario hace submit después de resetear, los valores vacíos se envían correctamente.'
    },
    {
      pregunta: '¿Qué es dirty/pristine en formularios?',
      respuesta: 'Un formulario es "dirty" cuando al menos un campo ha sido modificado por el usuario. Es "pristine" cuando ningún campo ha cambiado respecto a sus valores iniciales. react-hook-form expone isDirty y dirtyFields. isDirty se usa para habilitar/deshabilitar el botón de submit, dirtyFields para saber qué campos específicos cambiaron. Esto es útil para: validación condicional, advertir al usuario antes de salir, o enviar solo los campos modificados al servidor (PATCH parcial).',
      consejo: 'isDirty se basa en el valor actual vs defaultValues. Si cambias defaultValues con reset(), isDirty se recalcula automáticamente.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: Formularios + Zod"
      descripcion="Preguntas frecuentes sobre formularios en React con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}