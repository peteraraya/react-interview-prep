import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * MÓDULO 04: HOOKS
 * 
 * Los hooks son funciones que permiten usar el estado y otras características de React
 * en componentes funcionales. Fueron introducidos en React 16.8.
 * 
 * Conceptos clave:
 * - useState: manejar estado local
 * - useEffect: efectos secundarios (sincronización, suscripciones, timers)
 * - useRef: referencias mutables que persisten entre renderizados
 * - useMemo: memorizar valores calculados
 * - useCallback: memorizar funciones
 * - Reglas de los hooks: solo en componentes funcionales, nivel superior, sin condiciones
 */

// Ejemplo 1: useState y useEffect combinados
function RelojDigital() {
  const [hora, setHora] = useState(new Date());
  const [formato, setFormato] = useState('24h'); // '24h' o '12h'
  
  useEffect(() => {
    // Efecto secundario: actualizar hora cada segundo
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);
    
    // Función de limpieza: cancelar intervalo cuando el componente se desmonte
    return () => {
      clearInterval(intervalo);
    };
  }, []); // Array de dependencias vacío = solo ejecutar una vez
  
  const formatearHora = (fecha) => {
    if (formato === '12h') {
      return fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
    }
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 1: Reloj con useState y useEffect</h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        padding: '20px',
        backgroundColor: '#1a1a2e',
        color: '#00ff41',
        borderRadius: '8px',
        fontFamily: 'monospace'
      }}>
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>
          {formatearHora(hora)}
        </span>
        
        <button
          onClick={() => setFormato(formato === '24h' ? '12h' : '24h')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#00ff41',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cambiar a {formato === '24h' ? '12h' : '24h'}
        </button>
      </div>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Formato actual: {formato === '24h' ? '24 horas' : '12 horas (AM/PM)'}
      </p>
    </div>
  );
}

// Ejemplo 2: useRef para acceder a elementos del DOM
function InputFoco() {
  const inputRef = useRef(null);
  const contadorRef = useRef(0);
  const [valor, setValor] = useState('');
  
  useEffect(() => {
    // Enfocar input al montar el componente
    inputRef.current.focus();
  }, []);
  
  const handleInputChange = (e) => {
    setValor(e.target.value);
    contadorRef.current += 1;
  };
  
  const handleFoco = () => {
    inputRef.current.focus();
    alert(`El input ha sido modificado ${contadorRef.current} veces`);
  };
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 2: useRef para Referencias</h3>
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          value={valor}
          onChange={handleInputChange}
          placeholder="Escribe algo aquí..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #007bff',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleFoco}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Enfocar Input
          </button>
          
          <span style={{ 
            padding: '10px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px',
            alignSelf: 'center'
          }}>
            Cambios realizados: {contadorRef.current}
          </span>
        </div>
        
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          <strong>Nota:</strong> useRef permite mantener valores que persisten entre renderizados
          sin causar re-renderizados cuando cambian.
        </p>
      </div>
    </div>
  );
}

// Ejemplo 3: useMemo para optimización
function CalculadoraCostos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', precio: 100, cantidad: 2 },
    { id: 2, nombre: 'Producto B', precio: 200, cantidad: 1 },
    { id: 3, nombre: 'Producto C', precio: 50, cantidad: 5 }
  ]);
  const [descuento, setDescuento] = useState(10);
  const [calculosRealizados, setCalculosRealizados] = useState(0);
  
  // Sin useMemo: se recalcularía en cada renderizado
  const totalSinMemo = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  
  // Con useMemo: solo se recalcula cuando cambian las dependencias
  const totalConMemo = useMemo(() => {
    setCalculosRealizados(prev => prev + 1);
    console.log('Recalculando total...');
    return productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  }, [productos]); // Solo se recalcula cuando cambian los productos
  
  const totalConDescuento = useMemo(() => {
    return totalConMemo * (1 - descuento / 100);
  }, [totalConMemo, descuento]); // Se recalcula cuando cambian total o descuento
  
  const actualizarCantidad = (id, nuevaCantidad) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, cantidad: Math.max(0, nuevaCantidad) } : p
    ));
  };
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 3: useMemo para Optimización</h3>
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Descuento (%): </label>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
            min="0"
            max="100"
            style={{ 
              width: '80px', 
              padding: '8px', 
              marginLeft: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        {productos.map(producto => (
          <div 
            key={producto.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <span style={{ flex: 1 }}>{producto.nombre}</span>
            <span style={{ flex: 1, textAlign: 'center' }}>${producto.precio}</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              
              <span style={{ minWidth: '30px', textAlign: 'center' }}>
                {producto.cantidad}
              </span>
              
              <button
                onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            
            <span style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
              ${producto.precio * producto.cantidad}
            </span>
          </div>
        ))}
        
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <p>Subtotal: <strong>${totalConMemo}</strong></p>
          <p>Descuento: <strong>{descuento}%</strong></p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
            Total: <strong>${totalConDescuento.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Cálculos realizados: {calculosRealizados}
          </p>
        </div>
      </div>
    </div>
  );
}

// Ejemplo 4: useCallback para funciones memorizadas
function ListaTareasOptimizada() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Tarea 1', completada: false },
    { id: 2, texto: 'Tarea 2', completada: true },
    { id: 3, texto: 'Tarea 3', completada: false }
  ]);
  const [filtro, setFiltro] = useState('todas');
  const [renderCount, setRenderCount] = useState(0);
  
  // useCallback memoriza la función para evitar re-creaciones
  const toggleTarea = useCallback((id) => {
    setTareas(tareasActuales => 
      tareasActuales.map(tarea =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    );
  }, []); // Sin dependencias = función estable
  
  const eliminarTarea = useCallback((id) => {
    setTareas(tareasActuales => 
      tareasActuales.filter(tarea => tarea.id !== id)
    );
  }, []);
  
  const tareasFiltradas = useMemo(() => {
    return tareas.filter(tarea => {
      if (filtro === 'completadas') return tarea.completada;
      if (filtro === 'pendientes') return !tarea.completada;
      return true;
    });
  }, [tareas, filtro]);
  
  // Incrementar contador de renderizados para demostración
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 4: useCallback y useMemo Juntos</h3>
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            {['todas', 'completadas', 'pendientes'].map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                style={{
                  padding: '8px 16px',
                  margin: '0 5px',
                  backgroundColor: filtro === f ? '#007bff' : '#e9ecef',
                  color: filtro === f ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          
          <span style={{ 
            padding: '8px 16px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            Renderizados: {renderCount}
          </span>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tareasFiltradas.map(tarea => (
            <li 
              key={tarea.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                margin: '8px 0',
                backgroundColor: 'white',
                borderRadius: '4px',
                borderLeft: `4px solid ${tarea.completada ? '#28a745' : '#007bff'}`
              }}
            >
              <span 
                onClick={() => toggleTarea(tarea.id)}
                style={{ 
                  cursor: 'pointer',
                  textDecoration: tarea.completada ? 'line-through' : 'none',
                  flex: 1
                }}
              >
                {tarea.completada ? '✓' : '○'} {tarea.texto}
              </span>
              
              <button
                onClick={() => eliminarTarea(tarea.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Componente principal
export default function HooksExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 04: Hooks</h1>
      <p className="descripcion">
        Los hooks permiten usar estado y otras características de React en componentes funcionales.
      </p>
      
      <div className="ejemplos">
        <RelojDigital />
        <InputFoco />
        <CalculadoraCostos />
        <ListaTareasOptimizada />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>useState:</strong> Para estado local, retorna [valor, setter]</li>
          <li><strong>useEffect:</strong> Para efectos secundarios, con cleanup function</li>
          <li><strong>useRef:</strong> Para referencias mutables sin re-renderizados</li>
          <li><strong>useMemo:</strong> Para memorizar valores calculados costosos</li>
          <li><strong>useCallback:</strong> Para memorizar funciones y evitar re-creaciones</li>
          <li><strong>Reglas:</strong> Solo en componentes funcionales, nivel superior, sin condiciones</li>
        </ul>
      </div>
    </div>
  );
}