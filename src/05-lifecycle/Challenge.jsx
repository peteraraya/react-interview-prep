import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: CICLO DE VIDA
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear un chat en tiempo real con gestión de conexiones"
 * 
 * Requisitos:
 * 1. Simular conexión/desconexión de usuarios
 * 2. Manejar mensajes en tiempo real
 * 3. Mostrar estado de conexión
 * 4. Limpiar recursos al desmontar
 * 5. Manejar reconexiones automáticas
 */

// SOLUCIÓN PROPUESTA

// Simulación de WebSocket
class ChatSimulado {
  constructor(onMessage, onConnect, onDisconnect) {
    this.onMessage = onMessage;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.conectado = false;
    this.usuarios = ['Ana', 'Carlos', 'Elena', 'Pedro'];
    this.mensajes = [];
  }
  
  connect() {
    this.conectado = true;
    this.onConnect();
    
    // Simular mensajes aleatorios
    this.intervalo = setInterval(() => {
      if (this.conectado && Math.random() > 0.7) {
        const usuario = this.usuarios[Math.floor(Math.random() * this.usuarios.length)];
        const mensajes = [
          'Hola a todos!',
          '¿Cómo están?',
          'Estoy trabajando en React',
          '¡Excelente día para programar!',
          '¿Alguien ha usado hooks personalizados?'
        ];
        const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
        
        this.onMessage({
          id: Date.now(),
          usuario,
          mensaje,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 3000);
  }
  
  disconnect() {
    this.conectado = false;
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    this.onDisconnect();
  }
  
  sendMessage(mensaje, usuario) {
    if (!this.conectado) return false;
    
    this.onMessage({
      id: Date.now(),
      usuario,
      mensaje,
      timestamp: new Date().toLocaleTimeString(),
      propio: true
    });
    
    return true;
  }
}

// Hook personalizado para manejar el chat
function useChatSimulado() {
  const [conectado, setConectado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);
  const [intentosReconexion, setIntentosReconexion] = useState(0);
  const chatRef = useRef(null);
  const reconexionRef = useRef(null);
  
  const handleMessage = useCallback((mensaje) => {
    setMensajes(prev => [...prev.slice(-49), mensaje]); // Mantener últimos 50 mensajes
  }, []);
  
  const handleConnect = useCallback(() => {
    setConectado(true);
    setIntentosReconexion(0);
    setUsuariosEnLinea(['Ana', 'Carlos', 'Elena', 'Pedro']);
    
    // Agregar mensaje del sistema
    setMensajes(prev => [...prev, {
      id: Date.now(),
      usuario: 'Sistema',
      mensaje: 'Te has conectado al chat',
      timestamp: new Date().toLocaleTimeString(),
      sistema: true
    }]);
  }, []);
  
  const handleDisconnect = useCallback(() => {
    setConectado(false);
    setUsuariosEnLinea([]);
    
    // Agregar mensaje del sistema
    setMensajes(prev => [...prev, {
      id: Date.now(),
      usuario: 'Sistema',
      mensaje: 'Te has desconectado del chat',
      timestamp: new Date().toLocaleTimeString(),
      sistema: true
    }]);
  }, []);
  
  const conectar = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.disconnect();
    }
    
    chatRef.current = new ChatSimulado(handleMessage, handleConnect, handleDisconnect);
    chatRef.current.connect();
  }, [handleMessage, handleConnect, handleDisconnect]);
  
  const desconectar = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.disconnect();
    }
    
    if (reconexionRef.current) {
      clearTimeout(reconexionRef.current);
    }
  }, []);
  
  const reconectar = useCallback(() => {
    setIntentosReconexion(prev => prev + 1);
    
    reconexionRef.current = setTimeout(() => {
      conectar();
    }, 2000); // Esperar 2 segundos antes de reconectar
  }, [conectar]);
  
  const enviarMensaje = useCallback((mensaje, usuario) => {
    if (chatRef.current) {
      return chatRef.current.sendMessage(mensaje, usuario);
    }
    return false;
  }, []);
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }
      if (reconexionRef.current) {
        clearTimeout(reconexionRef.current);
      }
    };
  }, []);
  
  // Detectar desconexión y reconectar
  useEffect(() => {
    if (!conectado && intentosReconexion < 3) {
      const timer = setTimeout(() => {
        reconectar();
      }, 5000); // Intentar reconectar después de 5 segundos
      
      return () => clearTimeout(timer);
    }
  }, [conectado, intentosReconexion, reconectar]);
  
  return {
    conectado,
    mensajes,
    usuariosEnLinea,
    intentosReconexion,
    conectar,
    desconectar,
    enviarMensaje
  };
}

function MensajeChat({ mensaje }) {
  if (mensaje.sistema) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '5px',
        margin: '5px 0',
        color: '#666',
        fontStyle: 'italic',
        fontSize: '12px'
      }}>
        [{mensaje.timestamp}] {mensaje.mensaje}
      </div>
    );
  }
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: mensaje.propio ? 'flex-end' : 'flex-start',
      margin: '5px 0'
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 15px',
        borderRadius: mensaje.propio ? '15px 15px 0 15px' : '15px 15px 15px 0',
        backgroundColor: mensaje.propio ? '#007bff' : '#e9ecef',
        color: mensaje.propio ? 'white' : '#333'
      }}>
        {!mensaje.propio && (
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '12px',
            marginBottom: '3px',
            color: mensaje.propio ? 'rgba(255,255,255,0.8)' : '#666'
          }}>
            {mensaje.usuario}
          </div>
        )}
        <div style={{ margin: 0 }}>{mensaje.mensaje}</div>
        <div style={{ 
          fontSize: '10px', 
          marginTop: '5px',
          opacity: 0.7,
          textAlign: 'right'
        }}>
          {mensaje.timestamp}
        </div>
      </div>
    </div>
  );
}

export default function ChatChallenge() {
  const {
    conectado,
    mensajes,
    usuariosEnLinea,
    intentosReconexion,
    conectar,
    desconectar,
    enviarMensaje
  } = useChatSimulado();
  
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [usuario, setUsuario] = useState('Tú');
  const mensajesRef = useRef(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);
  
  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !conectado) return;
    
    enviarMensaje(nuevoMensaje, usuario);
    setNuevoMensaje('');
  };
  
  return (
    <div className="desafio">
      <h2>Desafío: Chat en Tiempo Real con Gestión de Conexiones</h2>
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Header del chat */}
        <div style={{
          padding: '15px',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>Chat en Tiempo Real</h3>
            <small>
              {conectado ? 'Conectado' : 'Desconectado'} | 
              {usuariosEnLinea.length} usuarios en línea
            </small>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={conectar}
              disabled={conectado}
              style={{
                padding: '8px 16px',
                backgroundColor: conectado ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: conectado ? 'not-allowed' : 'pointer'
              }}
            >
              Conectar
            </button>
            
            <button
              onClick={desconectar}
              disabled={!conectado}
              style={{
                padding: '8px 16px',
                backgroundColor: !conectado ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !conectado ? 'not-allowed' : 'pointer'
              }}
            >
              Desconectar
            </button>
          </div>
        </div>
        
        {/* Estado de reconexión */}
        {intentosReconexion > 0 && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            Intento de reconexión {intentosReconexion}/3...
          </div>
        )}
        
        {/* Área de mensajes */}
        <div 
          ref={mensajesRef}
          style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          {mensajes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666',
              padding: '40px',
              fontStyle: 'italic'
            }}>
              No hay mensajes. {conectado ? '¡Envía el primero!' : 'Conéctate para empezar'}
            </div>
          ) : (
            mensajes.map(mensaje => (
              <MensajeChat key={mensaje.id} mensaje={mensaje} />
            ))
          )}
        </div>
        
        {/* Input de mensajes */}
        <form 
          onSubmit={handleEnviarMensaje}
          style={{
            padding: '15px',
            borderTop: '1px solid #ddd',
            backgroundColor: 'white',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Tu nombre"
            style={{
              width: '120px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder={conectado ? "Escribe un mensaje..." : "Conéctate para enviar mensajes"}
            disabled={!conectado}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          
          <button
            type="submit"
            disabled={!conectado || !nuevoMensaje.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: conectado && nuevoMensaje.trim() ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: conectado && nuevoMensaje.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Enviar
          </button>
        </form>
      </div>
      
      {/* Información adicional */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Características implementadas:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Gestión de conexiones:</strong> Conectar/desconectar manualmente</li>
          <li><strong>Reconexión automática:</strong> Intenta reconectar después de desconexiones</li>
          <li><strong>Limpieza de recursos:</strong> Limpia intervalos y timeouts al desmontar</li>
          <li><strong>Mensajes del sistema:</strong> Muestra eventos de conexión/desconexión</li>
          <li><strong>Auto-scroll:</strong> Se desplaza automáticamente al último mensaje</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. CLASE ChatSimulado:
 *    - Simula un WebSocket con métodos connect/disconnect/sendMessage
 *    - Genera mensajes aleatorios de usuarios simulados
 *    - Maneja callbacks para eventos de conexión y mensajes
 * 
 * 2. HOOK useChatSimulado:
 *    - Encapsula toda la lógica del chat
 *    - Maneja estado de conexión, mensajes y usuarios
 *    - Implementa reconexión automática con límite de intentos
 *    - Limpia todos los recursos al desmontar
 * 
 * 3. GESTIÓN DEL CICLO DE VIDA:
 *    - Montaje: conectar al chat si se desea
 *    - Desmontaje: desconectar y limpiar todos los intervalos/timeouts
 *    - Actualización: detectar cambios de conexión para reconectar
 * 
 * 4. EFECTOS SECUNDARIOS:
 *    - useEffect para auto-scroll cuando cambian los mensajes
 *    - useEffect para manejar reconexión automática
 *    - useEffect para limpiar recursos al desmontar
 * 
 * 5. PATRONES DE DISEÑO:
 *    - Separación de concerns: lógica del chat vs presentación
 *    - Hooks personalizados para reutilización
 *    - Componentes pequeños y especializados
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Cómo implementarías un WebSocket real en lugar de la simulación?
 * - ¿Cómo manejarías mensajes offline y sincronización?
 * - ¿Cómo optimizarías el rendimiento con muchos usuarios/mensajes?
 * - ¿Cómo implementarías typing indicators (indicadores de escritura)?
 */