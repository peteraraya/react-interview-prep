import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * DESAFÍO DE ENTREVISTA: FORMULARIOS + ZOD
 * 
 * Ejercicio: "Crear un formulario de registro de empresa con múltiples pasos"
 * 
 * Requisitos:
 * 1. Wizard de múltiples pasos
 * 2. Validación por pasos
 * 3. Campos dinámicos (direcciones, contactos)
 * 4. Resumen antes de enviar
 * 5. Manejo de errores complejos
 */

// SOLUCIÓN PROPUESTA

// Schema completo
const companySchema = z.object({
  // Paso 1: Info básica
  nombreEmpresa: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  nit: z.string().regex(/^\d{8,12}$/, 'NIT inválido (8-12 dígitos)'),
  tipoEmpresa: z.enum(['sa', 'srl, sc', 'eirl', 'otro'], {
    errorMap: () => ({ message: 'Selecciona un tipo' })
  }),
  
  // Paso 2: Dirección
  direcciones: z.array(z.object({
    tipo: z.enum(['fiscal', 'operativa', 'otro']),
    ciudad: z.string().min(1, 'Ciudad requerida'),
    calle: z.string().min(1, 'Calle requerida'),
    numero: z.string().min(1, 'Número requerido')
  })).min(1, 'Agrega al menos una dirección'),
  
  // Paso 3: Contactos
  contactos: z.array(z.object({
    nombre: z.string().min(2, 'Nombre requerido'),
    cargo: z.string().min(2, 'Cargo requerido'),
    email: z.string().email('Email inválido'),
    telefono: z.string().regex(/^\d{8,10}$/, 'Teléfono inválido')
  })).min(1, 'Agrega al menos un contacto'),
  
  // Paso 4: Configuración
  empleado: z.number().min(1, 'Mínimo 1 empleado'),
  aceptaPoliticas: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar las políticas' })
  })
});

const steps = ['Información Básica', 'Direcciones', 'Contactos', 'Configuración'];

function StepIndicator({ currentStep }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: index <= currentStep ? '#007bff' : '#e9ecef',
            color: index <= currentStep ? 'white' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span style={{
            marginLeft: '8px',
            marginRight: '20px',
            color: index <= currentStep ? '#007bff' : '#666',
            fontWeight: index === currentStep ? 'bold' : 'normal',
            fontSize: '14px'
          }}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div style={{
              width: '50px',
              height: '2px',
              backgroundColor: index < currentStep ? '#007bff' : '#e9ecef',
              marginRight: '20px'
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MultiStepFormChallenge() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombreEmpresa: '',
      nit: '',
      tipoEmpresa: undefined,
      direcciones: [{ tipo: 'fiscal', ciudad: '', calle: '', numero: '' }],
      contactos: [{ nombre: '', cargo: '', email: '', telefono: '' }],
      empleado: 1,
      aceptaPoliticas: false
    }
  });
  
  const { fields: dirFields, append: addDir, remove: removeDir } = useFieldArray({
    control,
    name: 'direcciones'
  });
  
  const { fields: contactFields, append: addContact, remove: removeContact } = useFieldArray({
    control,
    name: 'contactos'
  });
  
  const allValues = watch();
  
  const validateStep = async () => {
    let fieldsToValidate = [];
    
    switch (step) {
      case 0:
        fieldsToValidate = ['nombreEmpresa', 'nit', 'tipoEmpresa'];
        break;
      case 1:
        fieldsToValidate = ['direcciones'];
        break;
      case 2:
        fieldsToValidate = ['contactos'];
        break;
      case 3:
        fieldsToValidate = ['empleado', 'aceptaPoliticas'];
        break;
    }
    
    const result = await trigger(fieldsToValidate);
    return result;
  };
  
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && step < steps.length - 1) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const onSubmit = (data) => {
    console.log('Empresa registrada:', data);
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div className="desafio">
        <h2>¡Empresa Registrada!</h2>
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', margin: 0 }}>La empresa "{allValues.nombreEmpresa}" ha sido registrada exitosamente.</p>
          <button 
            onClick={() => { setSubmitted(false); setStep(0); }}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Registrar otra empresa
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="desafio">
      <h2>Desafío: Registro de Empresa Multi-Paso</h2>
      
      <StepIndicator currentStep={step} />
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Paso 0: Info Básica */}
        {step === 0 && (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Información Básica</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la Empresa *</label>
              <input
                {...register('nombreEmpresa')}
                style={{ width: '100%', padding: '10px', border: `2px solid ${errors.nombreEmpresa ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
              />
              {errors.nombreEmpresa && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.nombreEmpresa.message}</p>}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>NIT *</label>
                <input
                  {...register('nit')}
                  placeholder="12345678"
                  style={{ width: '100%', padding: '10px', border: `2px solid ${errors.nit ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
                />
                {errors.nit && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.nit.message}</p>}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Empresa *</label>
                <select
                  {...register('tipoEmpresa')}
                  style={{ width: '100%', padding: '10px', border: `2px solid ${errors.tipoEmpresa ? '#dc3545' : '#ddd'}`, borderRadius: '4px', boxSizing: 'border-box' }}
                >
                  <option value="">Seleccionar...</option>
                  <option value="sa">Sociedad Anónima (SA)</option>
                  <option value="srl, sc">SRL / SC</option>
                  <option value="eirl">EIRL</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.tipoEmpresa && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.tipoEmpresa.message}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Paso 1: Direcciones */}
        {step === 1 && (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Direcciones</h4>
            
            {dirFields.map((field, index) => (
              <div key={field.id} style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Dirección {index + 1}</strong>
                  {dirFields.length > 1 && (
                    <button type="button" onClick={() => removeDir(index)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <select {...register(`direcciones.${index}.tipo`)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="fiscal">Fiscal</option>
                    <option value="operativa">Operativa</option>
                    <option value="otro">Otra</option>
                  </select>
                  <input {...register(`direcciones.${index}.ciudad`)} placeholder="Ciudad" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input {...register(`direcciones.${index}.calle`)} placeholder="Calle" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input {...register(`direcciones.${index}.numero`)} placeholder="Número" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={() => addDir({ tipo: 'operativa', ciudad: '', calle: '', numero: '' })} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Agregar Dirección
            </button>
            {errors.direcciones && <p style={{ color: '#dc3545', margin: '10px 0 0', fontSize: '12px' }}>{errors.direcciones.message}</p>}
          </div>
        )}
        
        {/* Paso 2: Contactos */}
        {step === 2 && (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Contactos</h4>
            
            {contactFields.map((field, index) => (
              <div key={field.id} style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Contacto {index + 1}</strong>
                  {contactFields.length > 1 && (
                    <button type="button" onClick={() => removeContact(index)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input {...register(`contactos.${index}.nombre`)} placeholder="Nombre" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input {...register(`contactos.${index}.cargo`)} placeholder="Cargo" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input {...register(`contactos.${index}.email`)} placeholder="Email" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input {...register(`contactos.${index}.telefono`)} placeholder="Teléfono" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={() => addContact({ nombre: '', cargo: '', email: '', telefono: '' })} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Agregar Contacto
            </button>
            {errors.contactos && <p style={{ color: '#dc3545', margin: '10px 0 0', fontSize: '12px' }}>{errors.contactos.message}</p>}
          </div>
        )}
        
        {/* Paso 3: Configuración + Resumen */}
        {step === 3 && (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Configuración Final</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Número de Empleados *</label>
              <input
                {...register('empleado', { valueAsNumber: true })}
                type="number"
                min="1"
                style={{ width: '200px', padding: '10px', border: `2px solid ${errors.empleado ? '#dc3545' : '#ddd'}`, borderRadius: '4px' }}
              />
              {errors.empleado && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.empleado.message}</p>}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input {...register('aceptaPoliticas')} type="checkbox" style={{ width: '18px', height: '18px' }} />
                Acepto las políticas de privacidad y tratamiento de datos *
              </label>
              {errors.aceptaPoliticas && <p style={{ color: '#dc3545', margin: '5px 0 0', fontSize: '12px' }}>{errors.aceptaPoliticas.message}</p>}
            </div>
            
            {/* Resumen */}
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h5 style={{ marginTop: 0 }}>Resumen</h5>
              <p><strong>Empresa:</strong> {allValues.nombreEmpresa}</p>
              <p><strong>NIT:</strong> {allValues.nit}</p>
              <p><strong>Direcciones:</strong> {allValues.direcciones?.length || 0}</p>
              <p><strong>Contactos:</strong> {allValues.contactos?.length || 0}</p>
              <p><strong>Empleados:</strong> {allValues.empleado}</p>
            </div>
          </div>
        )}
        
        {/* Navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button type="button" onClick={prevStep} disabled={step === 0} style={{ padding: '12px 24px', backgroundColor: step === 0 ? '#ccc' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
            Anterior
          </button>
          
          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep} style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Siguiente
            </button>
          ) : (
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Registrar Empresa
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. MULTI-STEP: Validación por pasos con trigger()
 * 2. USE FIELD ARRAY: Campos dinámicos (direcciones, contactos)
 * 3. ZOD SCHEMA: Validación compleja con refines
 * 4. RESUMEN: Muestra valores watch() antes de enviar
 * 5. NAVEGACIÓN: Validar paso actual antes de avanzar
 */