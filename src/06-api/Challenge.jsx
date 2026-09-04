import React, { useState, useEffect, useCallback } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: API DATA FETCHING
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear una aplicación de clima con búsqueda y geolocalización"
 * 
 * Requisitos:
 * 1. Obtener clima de ubicación actual (geolocalización)
 * 2. Buscar clima por ciudad
 * 3. Mostrar forecast de 5 días
 * 4. Manejar estados de carga y error
 * 5. Cachear resultados recientes
 */

// SOLUCIÓN PROPUESTA

// API key de demostración (en producción usar variables de entorno)
const API_KEY = 'demo_key'; // Reemplazar con API key real
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hook personalizado para geolocalización
function useGeolocation() {
  const [ubicacion, setUbicacion] = useState(null);
  const [errorGeolocation, setErrorGeolocation] = useState(null);
  const [cargandoGeo, setCargandoGeo] = useState(false);
  
  const obtenerUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorGeolocation('Geolocalización no soportada por el navegador');
      return;
    }
    
    setCargandoGeo(true);
    setErrorGeolocation(null);
    
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setUbicacion({
          lat: posicion.coords.latitude,
          lon: posicion.coords.longitude
        });
        setCargandoGeo(false);
      },
      (error) => {
        setErrorGeolocation('Error al obtener ubicación: ' + error.message);
        setCargandoGeo(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  }, []);
  
  return {
    ubicacion,
    errorGeolocation,
    cargandoGeo,
    obtenerUbicacion
  };
}

// Hook personalizado para clima
function useClima() {
  const [climaActual, setClimaActual] = useState(null);
  const [pronostico, setPronostico] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());
  
  const obtenerClima = useCallback(async (lat, lon, ciudad = null) => {
    const cacheKey = ciudad || `${lat},${lon}`;
    
    // Verificar cache
    if (cache.has(cacheKey)) {
      const datosCache = cache.get(cacheKey);
      setClimaActual(datosCache.actual);
      setPronostico(datosCache.pronostico);
      return;
    }
    
    setCargando(true);
    setError(null);
    
    try {
      // En producción, esto serían llamadas reales a la API
      // Simulamos datos para demostración
      const datosSimulados = simularDatosClima(ciudad || 'Ubicación actual');
      
      setClimaActual(datosSimulados.actual);
      setPronostico(datosSimulados.pronostico);
      
      // Guardar en cache
      setCache(prev => new Map(prev).set(cacheKey, datosSimulados));
    } catch (err) {
      setError('Error al obtener datos del clima');
    } finally {
      setCargando(false);
    }
  }, [cache]);
  
  return {
    climaActual,
    pronostico,
    cargando,
    error,
    obtenerClima
  };
}

// Función para simular datos de clima (reemplazar con API real)
function simularDatosClima(ciudad) {
  const temperaturas = [18, 22, 25, 28, 30, 15, 12];
  const condiciones = ['Soleado', 'Nublado', 'Lluvioso', 'Parcialmente nublado', 'Tormenta'];
  const iconos = ['☀️', '☁️', '🌧️', '⛅', '⛈️'];
  
  const tempActual = temperaturas[Math.floor(Math.random() * temperaturas.length)];
  const condicion = condiciones[Math.floor(Math.random() * condiciones.length)];
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  
  const pronostico = Array.from({ length: 5 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i + 1);
    
    return {
      fecha: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      tempMax: tempActual + Math.floor(Math.random() * 5),
      tempMin: tempActual - Math.floor(Math.random() * 5),
      condicion: condiciones[Math.floor(Math.random() * condiciones.length)],
      icono: iconos[Math.floor(Math.random() * iconos.length)]
    };
  });
  
  return {
    actual: {
      ciudad,
      temperatura: tempActual,
      condicion,
      icono,
      humedad: Math.floor(Math.random() * 40) + 40,
      viento: Math.floor(Math.random() * 20) + 5,
      sensacionTermica: tempActual + Math.floor(Math.random() * 3) - 1
    },
    pronostico
  };
}

function TarjetaClima({ clima, esPronostico = false }) {
  if (esPronostico) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd',
        textAlign: 'center',
        minWidth: '120px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '5px' }}>{clima.icono}</div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{clima.fecha}</div>
        <div style={{ color: '#666' }}>
          {clima.tempMax}° / {clima.tempMin}°
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
          {clima.condicion}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      padding: '30px',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{clima.ciudad}</h2>
      <div style={{ fontSize: '64px', margin: '10px 0' }}>{clima.icono}</div>
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>
        {clima.temperatura}°C
      </div>
      <div style={{ fontSize: '18px', marginBottom: '20px' }}>{clima.condicion}</div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Sensación térmica</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{clima.sensacionTermica}°C</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Humedad</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{clima.humedad}%</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Viento</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{clima.viento} km/h</div>
        </div>
      </div>
    </div>
  );
}

export default function WeatherChallenge() {
  const { ubicacion, errorGeolocation, cargandoGeo, obtenerUbicacion } = useGeolocation();
  const { climaActual, pronostico, cargando, error, obtenerClima } = useClima();
  const [ciudadBusqueda, setCiudadBusqueda] = useState('');
  const [historial, setHistorial] = useState([]);
  
  // Obtener clima cuando se obtenga la ubicación
  useEffect(() => {
    if (ubicacion) {
      obtenerClima(ubicacion.lat, ubicacion.lon);
    }
  }, [ubicacion, obtenerClima]);
  
  const handleBuscarCiudad = (e) => {
    e.preventDefault();
    if (!ciudadBusqueda.trim()) return;
    
    obtenerClima(null, null, ciudadBusqueda);
    
    // Agregar al historial
    if (!historial.includes(ciudadBusqueda)) {
      setHistorial(prev => [ciudadBusqueda, ...prev.slice(0, 4)]);
    }
    
    setCiudadBusqueda('');
  };
  
  return (
    <div className="desafio">
      <h2>Desafío: Aplicación de Clima con Geolocalización</h2>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Barra de búsqueda */}
        <form onSubmit={handleBuscarCiudad} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={ciudadBusqueda}
              onChange={(e) => setCiudadBusqueda(e.target.value)}
              placeholder="Buscar ciudad..."
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={obtenerUbicacion}
              disabled={cargandoGeo}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: cargandoGeo ? 'not-allowed' : 'pointer'
              }}
            >
              {cargandoGeo ? 'Obteniendo...' : 'Mi Ubicación'}
            </button>
          </div>
        </form>
        
        {/* Historial de búsquedas */}
        {historial.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '10px', color: '#666' }}>Recientes:</span>
            {historial.map(ciudad => (
              <button
                key={ciudad}
                onClick={() => obtenerClima(null, null, ciudad)}
                style={{
                  padding: '5px 10px',
                  margin: '0 5px',
                  backgroundColor: '#e9ecef',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {ciudad}
              </button>
            ))}
          </div>
        )}
        
        {/* Errores */}
        {(error || errorGeolocation) && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error || errorGeolocation}
          </div>
        )}
        
        {/* Cargando */}
        {cargando && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p>Obteniendo datos del clima...</p>
          </div>
        )}
        
        {/* Clima actual */}
        {climaActual && !cargando && (
          <div style={{ marginBottom: '30px' }}>
            <TarjetaClima clima={climaActual} />
          </div>
        )}
        
        {/* Pronóstico */}
        {pronostico.length > 0 && !cargando && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Pronóstico 5 días</h3>
            <div style={{
              display: 'flex',
              gap: '15px',
              overflowX: 'auto',
              padding: '10px 0'
            }}>
              {pronostico.map((dia, index) => (
                <TarjetaClima key={index} clima={dia} esPronostico />
              ))}
            </div>
          </div>
        )}
        
        {/* Instrucciones */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Características implementadas:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Geolocalización:</strong> Obtiene ubicación actual del usuario</li>
            <li><strong>Búsqueda por ciudad:</strong> Busca clima de cualquier ciudad</li>
            <li><strong>Cache:</strong> Almacena resultados para búsquedas repetidas</li>
            <li><strong>Historial:</strong> Muestra búsquedas recientes</li>
            <li><strong>Manejo de errores:</strong> Muestra mensajes claros de error</li>
            <li><strong>Estado de carga:</strong> Indicadores visuales durante carga</li>
          </ul>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. HOOKS PERSONALIZADOS:
 *    - useGeolocation: maneja la geolocalización del navegador
 *    - useClima: encapsula toda la lógica de obtención de clima
 *    - Ambos hooks separan concerns y son reutilizables
 * 
 * 2. GESTIÓN DE ESTADO:
 *    - Estado para datos del clima, carga, errores y cache
 *    - Cache usando Map para búsquedas eficientes
 *    - Historial de búsquedas recientes
 * 
 * 3. EFECTOS SECUNDARIOS:
 *    - useEffect para obtener clima cuando cambia la ubicación
 *    - Geolocalización con callbacks de éxito/error
 *    - Limpieza de timeouts para debounce
 * 
 * 4. PATRONES DE DISEÑO:
 *    - Componentes presentacionales (TarjetaClima)
 *    - Hooks personalizados para lógica compleja
 *    - Separación de datos simulados vs API real
 * 
 * 5. EXPERIENCIA DE USUARIO:
 *    - Feedback visual durante carga
 *    - Mensajes de error claros
 *    - Historial para búsquedas rápidas
 *    - Diseño responsive con grid/flexbox
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Cómo integrarías una API real de clima (OpenWeatherMap)?
 * - ¿Cómo manejarías datos offline con Service Workers?
 * - ¿Cómo optimizarías para uso móvil con geolocalización?
 * - ¿Cómo implementarías notificaciones de cambios de clima?
 */