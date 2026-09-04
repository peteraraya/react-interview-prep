import React, { useState, useEffect, useRef } from 'react';

/**
 * MÓDULO 05: CICLO DE VIDA DE LOS COMPONENTES
 * 
 * El ciclo de vida describe las fases por las que pasa un componente:
 * 1. Montaje: cuando se crea y se inserta en el DOM
 * 2. Actualización: cuando cambian props o estado
 * 3. Desmontaje: cuando se elimina del DOM
 * 
 * En componentes funcionales, useEffect maneja estas fases:
 * - Montaje: useEffect(() => {}, [])
 * - Actualización: useEffect(() => {}, [dependencias])
 * - Desmontaje: return () => {} dentro de useEffect
 * - Limpieza: función de retorno en useEffect
 */

// Ejemplo 1: Montaje y desmontaje
function MonitorConexiones() {
  const [conectado, setConectado] = useState(false);
  const [tiempoConectado, setTiempoConectado] = useState(0);
  const intervaloRef = useRef(null);
  
  // Montaje: establecer conexión
  useEffect(() => {
    console.log('Componente montado - Estableciendo conexión');
    setConectado(true);
    
    // Desmontaje: limpiar recursos
    return () => {
      console.log('Componente desmontado - Limpiando conexión');
      setConectado(false);
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);
  
  // Efecto secundario: contar tiempo cuando está conectado
  useEffect(() => {
    if (conectado) {
      intervaloRef.current = setInterval(() => {
        setTiempoConectado(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [conectado]);
  
  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 1: Monitor de Conexiones</h3>
      <div style={{ 
        padding: '20px', 
        backgroundColor: conectado ? '#e8f5e8' : '#ffebee',
        borderRadius: '8px',
        border: `2px solid ${conectado ? '#4CAF50' : '#f44336'}`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: conectado ? '#4CAF50' : '#f44336',
            boxShadow: conectado ? '0 0 10px #4CAF50' : 'none'
          }}></div>
          
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: conectado ? '#2e7d32' : '#c62828'
          }}>
            {conectado ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        
        {conectado && (
          <div style={{ 
            textAlign: 'center',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>
              Tiempo de conexión:
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: '#2e7d32'
            }}>
              {formatTiempo(tiempoConectado)}
            </p>
          </div>
        )}
      </div>
      
      <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
        <strong>Nota:</strong> Al desmontar este componente, se limpiará el intervalo automáticamente.
      </p>
    </div>
  );
}

// Ejemplo 2: Actualización basada en dependencias
function SeguidorMouse() {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [seguirActivo, setSeguirActivo] = useState(true);
  const contenedorRef = useRef(null);
  
  useEffect(() => {
    if (!seguirActivo) return;
    
    const handleMouseMove = (e) => {
      if (contenedorRef.current) {
        const rect = contenedorRef.current.getBoundingClientRect();
        setPosicion({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    const contenedor = contenedorRef.current;
    if (contenedor) {
      contenedor.addEventListener('mousemove', handleMouseMove);
    }
    
    // Limpieza: remover event listener
    return () => {
      if (contenedor) {
        contenedor.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [seguirActivo]); // Solo se ejecuta cuando cambiar seguirActivo
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 2: Seguidor de Mouse</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div
          ref={contenedorRef}
          style={{
            width: '300px',
            height: '200px',
            backgroundColor: '#f0f0f0',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'crosshair'
          }}
        >
          <div style={{
            position: 'absolute',
            left: posicion.x - 10,
            top: posicion.y - 10,
            width: '20px',
            height: '20px',
            backgroundColor: seguirActivo ? '#007bff' : '#ccc',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'background-color 0.2s',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            x: {posicion.x}, y: {posicion.y}
          </div>
        </div>
        
        <div>
          <button
            onClick={() => setSeguirActivo(!seguirActivo)}
            style={{
              padding: '10px 20px',
              backgroundColor: seguirActivo ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {seguirActivo ? 'Desactivar' : 'Activar'} Seguimiento
          </button>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Estado:</strong> {seguirActivo ? 'Activo' : 'Inactivo'}
            </p>
            <p style={{ margin: 0, color: '#666' }}>
              Mueve el mouse sobre el área gris
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ejemplo 3: Temporizador con cleanup
function Temporizador({ duracion, onComplete }) {
  const [tiempoRestante, setTiempoRestante] = useState(duracion);
  const [activo, setActivo] = useState(false);
  const intervaloRef = useRef(null);
  
  useEffect(() => {
    if (activo && tiempoRestante > 0) {
      intervaloRef.current = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(intervaloRef.current);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [activo, tiempoRestante, onComplete]);
  
  const reiniciar = () => {
    setTiempoRestante(duracion);
    setActivo(false);
  };
  
  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const porcentaje = (tiempoRestante / duracion) * 100;
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '48px', 
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: tiempoRestante <= 10 ? '#dc3545' : '#28a745',
        marginBottom: '20px'
      }}>
        {formatTiempo(tiempoRestante)}
      </div>
      
      {/* Barra de progreso */}
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: `${porcentaje}%`,
          height: '100%',
          backgroundColor: tiempoRestante <= 10 ? '#dc3545' : '#28a745',
          transition: 'width 1s linear'
        }}></div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setActivo(!activo)}
          disabled={tiempoRestante === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: activo ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: tiempoRestante === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {activo ? 'Pausar' : 'Iniciar'}
        </button>
        
        <button
          onClick={reiniciar}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

// Componente principal
export default function LifecycleExamples() {
  const [mostrarTemporizador, setMostrarTemporizador] = useState(true);
  const [duracionTemporizador, setDuracionTemporizador] = useState(30);
  
  return (
    <div className="modulo">
      <h1>Módulo 05: Ciclo de Vida de los Componentes</h1>
      <p className="descripcion">
        useEffect maneja las fases del ciclo de vida: montaje, actualización y desmontaje.
      </p>
      
      <div className="ejemplos">
        <MonitorConexiones />
        <SeguidorMouse />
        
        <div className="ejemplo">
          <h3>Ejemplo 3: Temporizador con Cleanup</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label>Duración (segundos): </label>
            <select
              value={duracionTemporizador}
              onChange={(e) => setDuracionTemporizador(Number(e.target.value))}
              style={{ 
                padding: '8px', 
                marginLeft: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value={10}>10 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={60}>1 minuto</option>
              <option value={120}>2 minutos</option>
            </select>
          </div>
          
          <button
            onClick={() => setMostrarTemporizador(!mostrarTemporizador)}
            style={{
              padding: '10px 20px',
              backgroundColor: mostrarTemporizador ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            {mostrarTemporizador ? 'Ocultar' : 'Mostrar'} Temporizador
          </button>
          
          {mostrarTemporizador && (
            <Temporizador 
              duracion={duracionTemporizador}
              onComplete={() => alert('¡Tiempo terminado!')}
            />
          )}
        </div>
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>Montaje:</strong> useEffect con array vacio [] - se ejecuta una vez al montar</li>
          <li><strong>Actualizacion:</strong> useEffect con dependencias [dep] - se ejecuta cuando cambian</li>
          <li><strong>Desmontaje:</strong> return function dentro de useEffect - limpieza al desmontar</li>
          <li><strong>Limpieza:</strong> siempre limpiar intervalos, timers y suscripciones</li>
          <li><strong>Dependencias:</strong> incluir todas las variables usadas dentro del efecto</li>
        </ul>
      </div>
    </div>
  );
}