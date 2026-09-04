import React from 'react';
import PreguntasEntrevista from '../qa-ui/PreguntasEntrevista';

export default function RouterPreguntas() {
  const preguntas = [
    {
      pregunta: '¿Qué es React Router?',
      respuesta: 'React Router es la librería estándar para navegación en aplicaciones React SPA (Single Page Application). Permite mapear URLs a componentes sin recargar la página. Componentes principales: BrowserRouter (envuelve la app), Routes/Route (definen rutas), Link/NavLink (navegación declarativa), useParams/useNavigate/useLocation (hooks para interactuar con la URL).',
      consejo: 'Menciona que React Router v6 simplificó la API significativamente vs v5, con mejor soporte de rutas anidadas.'
    },
    {
      pregunta: '¿Qué son las rutas anidadas y cómo funcionan?',
      respuesta: 'Las rutas anidadas permiten que una ruta padre renderice un layout y las rutas hijas se rendericen dentro usando Outlet. Ejemplo: <Route path="/dashboard" element={<Layout />}> <Route path="settings" element={<Settings />} /> </Route>. El componente Layout renderiza <Outlet /> donde aparecerá Settings. Esto permite layouts compartidos sin duplicar código de navegación.',
      consejo: 'Con React Router v6, las rutas anidadas son el patrón principal — siempre busca layouts compartidos.'
    },
    {
      pregunta: '¿Cuándo usar Navigate vs useNavigate?',
      respuesta: 'Navigate es un componente declarativo que redirjeta al renderizarse: <Navigate to="/login" replace />. Útil para: rutas protegidas que redirijan si no hay auth, rutas catch-all para 404. useNavigate es un hook para navegación programática: navigate("/home") dentro de handlers o useEffect. Usa Navigate cuando la redirección es parte del renderizado, y useNavigate cuando depende de una acción del usuario.',
      consejo: 'Navigate con replace evita que el usuario pueda volver atrás con el botón del navegador.'
    },
    {
      pregunta: '¿Cómo se implementan rutas protegidas?',
      respuesta: 'Creando un componente ProtectedRoute que verifique autenticación: si hay usuario, renderiza <Outlet /> o children; si no, <Navigate to="/login" replace />. Se usa como wrapper: <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}. Alternativa: un componente que recibe el componente como prop y lo renderiza condicionalmente. Lo importante es que la lógica de auth esté en un solo lugar.',
      consejo: 'También se puede usar un wrapper: <ProtectedRoute> <Dashboard /> </ProtectedRoute> que renderiza children o redirige.'
    },
    {
      pregunta: '¿Cómo se obtiene el ID de un usuario desde la URL?',
      respuesta: 'Con el hook useParams de React Router. Primero se define la ruta con parámetro: <Route path="/users/:id" element={<UserDetail />} />. Dentro del componente: const { id } = useParams(). El parámetro :id se extrae automáticamente. Si la URL es /users/123, useParams retorna { id: "123" } (siempre string). Se debe convertir a número si es necesario: Number(id).',
      consejo: 'useParams retorna strings siempre, incluso si el parámetro es numérico. Menciona la conversión en entrevistas.'
    },
    {
      pregunta: '¿Cómo funcionan los query params con React Router?',
      respuesta: 'Se usa useSearchParams: const [searchParams, setSearchParams] = useSearchParams(). searchParams.get("page") lee el parámetro, setSearchParams({ page: "2" }) lo actualiza. Esto sincroniza los query params con la URL: /users?page=2&sort=name. Es útil para filtros, paginación, y estado que debe persistir en la URL para que se pueda compartir.',
      consejo: 'Los query params son ideales para estado que el usuario debería poder guardar como bookmark.'
    }
  ];

  return (
    <PreguntasEntrevista
      titulo="Preguntas de Entrevista: React Router"
      descripcion="Preguntas frecuentes sobre React Router con respuestas recomendadas."
      preguntas={preguntas}
    />
  );
}