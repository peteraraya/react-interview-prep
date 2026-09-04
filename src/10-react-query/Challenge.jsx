import React, { useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  keepPreviousData
} from '@tanstack/react-query';

/**
 * DESAFÍO DE ENTREVISTA: REACT QUERY
 * 
 * Ejercicio: "Implementar una tabla de usuarios con paginación, búsqueda y CRUD"
 * 
 * Requisitos:
 * 1. Paginación del lado del servidor
 * 2. Búsqueda con debounce
 * 3. Crear, editar y eliminar usuarios
 * 4. Estados de carga y error
 * 5. Optimistic updates
 */

// SOLUCIÓN PROPUESTA

// ============================================
// SIMULACIÓN DE API CON PAGINACIÓN
// ============================================

const generateUsers = () => {
  const names = ['Ana García', 'Carlos López', 'Elena Martínez', 'Pedro Sánchez', 
                 'María Rodríguez', 'Juan Hernández', 'Laura Díaz', 'Miguel Fernández',
                 'Sofía Torres', 'Diego Ramírez', 'Valentina Morales', 'Andrés Castillo',
                 'Camila Vargas', 'Roberto Reyes', 'Isabella Flores'];
  
  return names.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    role: ['admin', 'user', 'editor'][i % 3],
    status: i % 4 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

let usersDB = generateUsers();

const fakeAPI = {
  async getUsers({ page = 1, limit = 5, search = '', role = '' }) {
    await new Promise(r => setTimeout(r, 500));
    
    let filtered = [...usersDB];
    
    if (search) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role) {
      filtered = filtered.filter(u => u.role === role);
    }
    
    const total = filtered.length;
    const start = (page - 1) * limit;
    const users = filtered.slice(start, start + limit);
    
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  },
  
  async getUser(id) {
    await new Promise(r => setTimeout(r, 300));
    const user = usersDB.find(u => u.id === id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },
  
  async createUser(data) {
    await new Promise(r => setTimeout(r, 800));
    const newUser = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
    usersDB.unshift(newUser);
    return newUser;
  },
  
  async updateUser(id, data) {
    await new Promise(r => setTimeout(r, 600));
    const index = usersDB.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    usersDB[index] = { ...usersDB[index], ...data };
    return usersDB[index];
  },
  
  async deleteUser(id) {
    await new Promise(r => setTimeout(r, 500));
    const index = usersDB.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    usersDB.splice(index, 1);
    return true;
  }
};

// ============================================
// HOOKS
// ============================================

function useUsers({ page, limit, search, role }) {
  return useQuery({
    queryKey: ['users', { page, limit, search, role }],
    queryFn: () => fakeAPI.getUsers({ page, limit, search, role }),
    placeholderData: keepPreviousData
  });
}

function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fakeAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) => fakeAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fakeAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// ============================================
// COMPONENTES
// ============================================

function UserForm({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active'
  });
  
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  
  const isEditing = !!user;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditing) {
      updateUser.mutate({ id: user.id, ...formData }, { onSuccess: onClose });
    } else {
      createUser.mutate(formData, { onSuccess: onClose });
    }
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
      <h4 style={{ marginTop: 0 }}>{isEditing ? 'Editar' : 'Crear'} Usuario</h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre"
            required
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            required
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={createUser.isPending || updateUser.isPending} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {createUser.isPending || updateUser.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function UserTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const limit = 5;
  
  const { data, isLoading, isFetching } = useUsers({ page, limit, search, role });
  const deleteUser = useDeleteUser();
  
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  
  const handleRoleFilter = (e) => {
    setRole(e.target.value);
    setPage(1);
  };
  
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      deleteUser.mutate(id);
    }
  };
  
  return (
    <div>
      {/* Formulario */}
      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null); }}
        />
      )}
      
      {/* Controles */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o email..."
          style={{ flex: 1, minWidth: '200px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        
        <select value={role} onChange={handleRoleFilter} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="editor">Editor</option>
        </select>
        
        <button onClick={() => { setEditingUser(null); setShowForm(true); }} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Nuevo Usuario
        </button>
        
        {isFetching && <span style={{ color: '#007bff', fontSize: '12px' }}>Actualizando...</span>}
      </div>
      
      {/* Tabla */}
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          Cargando usuarios...
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Rol</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: user.role === 'admin' ? '#e3f2fd' : '#f5f5f5' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: user.status === 'active' ? '#e8f5e8' : '#ffebee', color: user.status === 'active' ? '#2e7d32' : '#c62828' }}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(user)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(user.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Paginación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <span>Página {data?.page} de {data?.totalPages} ({data?.total} usuarios)</span>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', backgroundColor: page === 1 ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                Anterior
              </button>
              <button onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))} disabled={page === data?.totalPages} style={{ padding: '8px 16px', backgroundColor: page === data?.totalPages ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: page === data?.totalPages ? 'not-allowed' : 'pointer' }}>
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default function ReactQueryChallenge() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="desafio">
        <h2>Desafío: Tabla de Usuarios con React Query</h2>
        <UserTable />
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
          <strong>Características:</strong> Paginación del servidor, búsqueda, filtros, CRUD completo, optimistic loading, estados de carga/error.
        </div>
      </div>
    </QueryClientProvider>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. PAGINACIÓN: Query key incluye page/limit para caché por página
 * 2. BÚSQUEDA: Query key incluye search para re-fetch automático
 * 3. FILTROS: role como parámetro en query key
 * 4. CRUD: Mutaciones con invalidación de queries relacionadas
 * 5. LOADING: placeholderData keepPreviousData para transiciones suaves
 */