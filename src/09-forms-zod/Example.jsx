import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * MÓDULO 09: FORMULARIOS + ZOD VALIDATION
 * 
 * react-hook-form: Librería para manejar formularios de forma eficiente
 * zod: Schema validation (validación de esquemas)
 * 
 * Conceptos clave:
 * - register: registrar inputs
 * - handleSubmit: manejar envío del formulario
 * - errors: errores de validación
 * - watch: observar valores en tiempo real
 * - control: para componentes controlados
 * - zod schemas: definir reglas de validación
 */

// ============================================
// EJEMPLO 1: Formulario Básico con Validación
// ============================================

// Definir schema con Zod
const basicSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  
  confirmPassword: z.string(),
  
  edad: z.number()
    .min(18, 'Debes ser mayor de 18 años')
    .max(120, 'Edad inválida'),
  
  aceptaTerminos: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

function FormularioBasico() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      edad: 18,
      aceptaTerminos: false
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Datos enviados:', data);
    alert('¡Formulario enviado!\n\n' + JSON.stringify(data, null, 2));
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Formulario Básico con Zod</h4>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        {/* Nombre */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre *
          </label>
          <input
            {...register('nombre')}
            style={{
              width: '100%',
              padding: '10px',
              border: `2px solid ${errors.nombre ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errors.nombre && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.nombre.message}
            </p>
          )}
        </div>
        
        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            style={{
              width: '100%',
              padding: '10px',
              border: `2px solid ${errors.email ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errors.email && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.email.message}
            </p>
          )}
        </div>
        
        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña *
          </label>
          <input
            {...register('password')}
            type="password"
            style={{
              width: '100%',
              padding: '10px',
              border: `2px solid ${errors.password ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errors.password && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.password.message}
            </p>
          )}
          
          {/* Indicador de fortaleza */}
          {password && (
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              <div style={{ color: password.length >= 8 ? '#28a745' : '#dc3545' }}>
                ✓ Mínimo 8 caracteres
              </div>
              <div style={{ color: /[A-Z]/.test(password) ? '#28a745' : '#dc3545' }}>
                ✓ Una mayúscula
              </div>
              <div style={{ color: /[0-9]/.test(password) ? '#28a745' : '#dc3545' }}>
                ✓ Un número
              </div>
            </div>
          )}
        </div>
        
        {/* Confirm Password */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirmar Contraseña *
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            style={{
              width: '100%',
              padding: '10px',
              border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errors.confirmPassword && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        {/* Edad */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Edad *
          </label>
          <input
            {...register('edad', { valueAsNumber: true })}
            type="number"
            style={{
              width: '100%',
              padding: '10px',
              border: `2px solid ${errors.edad ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errors.edad && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.edad.message}
            </p>
          )}
        </div>
        
        {/* Términos */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              {...register('aceptaTerminos')}
              type="checkbox"
              style={{ width: '18px', height: '18px' }}
            />
            Acepto los términos y condiciones *
          </label>
          {errors.aceptaTerminos && (
            <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>
              {errors.aceptaTerminos.message}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// EJEMPLO 2: Formulario de Producto con Campos Dinámicos
// ============================================

const productSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  precio: z.number().positive('El precio debe ser positivo'),
  descripcion: z.string().optional(),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  colores: z.array(z.string()).min(1, 'Selecciona al menos un color'),
  especificaciones: z.array(z.object({
    clave: z.string().min(1, 'Clave requerida'),
    valor: z.string().min(1, 'Valor requerido')
  })).optional()
});

const categorias = ['Electrónica', 'Ropa', 'Hogar', 'Deportes'];
const coloresDisponibles = ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco'];

function FormularioProducto() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: '',
      precio: 0,
      descripcion: '',
      categoria: '',
      colores: [],
      especificaciones: [{ clave: '', valor: '' }]
    }
  });
  
  const coloresSeleccionados = watch('colores') || [];
  
  const toggleColor = (color) => {
    const current = coloresSeleccionados;
    if (current.includes(color)) {
      setValue('colores', current.filter(c => c !== color), { shouldValidate: true });
    } else {
      setValue('colores', [...current, color], { shouldValidate: true });
    }
  };
  
  const onSubmit = (data) => {
    console.log('Producto:', data);
    alert('¡Producto creado!\n\n' + JSON.stringify(data, null, 2));
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Formulario de Producto</h4>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre *</label>
          <input
            {...register('nombre')}
            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.nombre ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
          />
          {errors.nombre && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.nombre.message}</p>}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio *</label>
            <input
              {...register('precio', { valueAsNumber: true })}
              type="number"
              step="0.01"
              style={{ width: '100%', padding: '10px', border: `2px solid ${errors.precio ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
            />
            {errors.precio && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.precio.message}</p>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoría *</label>
            <select
              {...register('categoria')}
              style={{ width: '100%', padding: '10px', border: `2px solid ${errors.categoria ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
            >
              <option value="">Seleccionar...</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.categoria.message}</p>}
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción</label>
          <textarea
            {...register('descripcion')}
            rows={3}
            style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Colores *</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {coloresDisponibles.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: coloresSeleccionados.includes(color) ? '#007bff' : '#e9ecef',
                  color: coloresSeleccionados.includes(color) ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {color}
              </button>
            ))}
          </div>
          {errors.colores && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.colores.message}</p>}
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
}

// Componente principal
export default function FormsExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 09: Formularios + Zod Validation</h1>
      <p className="descripcion">
        react-hook-form optimiza el rendimiento de formularios. Zod proporciona validación basada en esquemas.
      </p>
      
      <div className="ejemplos">
        <FormularioBasico />
        <FormularioProducto />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>register:</strong> Registra inputs y aplica validación</li>
          <li><strong>handleSubmit:</strong> Maneja el envío y validación</li>
          <li><strong>errors:</strong> Objeto con errores de validación</li>
          <li><strong>watch:</strong> Observa valores en tiempo real</li>
          <li><strong>setValue:</strong> Actualiza valores programáticamente</li>
          <li><strong>zodResolver:</strong> Integra Zod con react-hook-form</li>
          <li><strong>Schemas:</strong> Definen reglas de validación reutilizables</li>
          <li><strong>Refine:</strong> Validaciones cruzadas entre campos</li>
        </ul>
      </div>
    </div>
  );
}