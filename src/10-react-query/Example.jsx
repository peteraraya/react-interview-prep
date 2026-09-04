import React, { useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery 
} from '@tanstack/react-query';

/**
 * MÓDULO 10: TANSTACK QUERY (REACT QUERY)
 * 
 * TanStack Query es una librería para manejar estado del servidor.
 * Maneja caché, re-fetching, optimistic updates, y más.
 * 
 * Conceptos clave:
 * - QueryClient: cliente que maneja caché
 * - useQuery: para obtener datos
 * - useMutation: para modificar datos
 * - Query Keys: identificadores únicos para queries
 * - Stale Time: tiempo antes de que datos se consideren obsoletos
 * - Invalidación: re-fetch después de mutaciones
 */

// Crear cliente de query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
    }
  }
});

// ============================================
// SIMULACIÓN DE API
// ============================================

const fakeDB = {
  posts: [
    { id: 1, title: 'Aprender React', content: 'React es genial', author: 'Ana', likes: 15 },
    { id: 2, title: 'Hooks Avanzados', content: 'useEffect y más', author: 'Carlos', likes: 23 },
    { id: 3, title: 'TanStack Query', content: 'Manejo de estado del servidor', author: 'María', likes: 42 },
    { id: 4, title: 'TypeScript con React', content: 'Tipos seguros', author: 'Pedro', likes: 18 },
    { id: 5, title: 'Testing en React', content: 'Jest y RTL', author: 'Laura', likes: 31 }
  ],
  
  async getPosts() {
    await new Promise(r => setTimeout(r, 800));
    return [...this.posts];
  },
  
  async getPost(id) {
    await new Promise(r => setTimeout(r, 500));
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new Error('Post no encontrado');
    return { ...post };
  },
  
  async createPost(data) {
    await new Promise(r => setTimeout(r, 1000));
    const newPost = { id: Date.now(), likes: 0, ...data };
    this.posts.push(newPost);
    return newPost;
  },
  
  async updatePost(id, data) {
    await new Promise(r => setTimeout(r, 800));
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post no encontrado');
    this.posts[index] = { ...this.posts[index], ...data };
    return this.posts[index];
  },
  
  async deletePost(id) {
    await new Promise(r => setTimeout(r, 600));
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post no encontrado');
    this.posts.splice(index, 1);
    return true;
  },
  
  async likePost(id) {
    await new Promise(r => setTimeout(r, 300));
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new Error('Post no encontrado');
    post.likes += 1;
    return post;
  }
};

// ============================================
// HOOKS PERSONALIZADOS
// ============================================

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fakeDB.getPosts(),
    select: (data) => data.sort((a, b) => b.likes - a.likes)
  });
}

function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => fakeDB.getPost(id),
    enabled: !!id
  });
}

function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost) => fakeDB.createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}

function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) => fakeDB.updatePost(id, data),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (old) => 
        old?.map(post => post.id === updatedPost.id ? updatedPost : post)
      );
    }
  });
}

function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => fakeDB.deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['posts'], (old) => 
        old?.filter(post => post.id !== deletedId)
      );
    }
  });
}

function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => fakeDB.likePost(id),
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      const previousPosts = queryClient.getQueryData(['posts']);
      
      queryClient.setQueryData(['posts'], (old) => 
        old?.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        )
      );
      
      return { previousPosts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
}

// ============================================
// COMPONENTES
// ============================================

function PostCard({ post, onSelect, onDelete, onLike }) {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onClick={() => onSelect(post.id)}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <h4 style={{ margin: '0 0 10px', color: '#333' }}>{post.title}</h4>
      <p style={{ margin: '0 0 10px', color: '#666', fontSize: '14px' }}>{post.content}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#888' }}>Por {post.author}</span>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ❤️ {post.likes}
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function PostDetail({ postId, onBack }) {
  const { data: post, isLoading, error } = usePost(postId);
  
  if (isLoading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando post...</div>;
  if (error) return <div style={{ padding: '20px', color: '#dc3545' }}>Error: {error.message}</div>;
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <button onClick={onBack} style={{ marginBottom: '15px', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        ← Volver
      </button>
      
      <h3 style={{ margin: '0 0 10px' }}>{post.title}</h3>
      <p style={{ color: '#666', marginBottom: '15px' }}>{post.content}</p>
      <p style={{ fontSize: '14px', color: '#888' }}>Por {post.author} | ❤️ {post.likes} likes</p>
    </div>
  );
}

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  
  const createPost = useCreatePost();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost.mutate(
      { title, content, author },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setAuthor('');
        }
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4 style={{ marginTop: 0 }}>Crear Nuevo Post</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido"
          required
          rows={3}
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Autor"
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>
      
      <button
        type="submit"
        disabled={createPost.isPending}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: createPost.isPending ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: createPost.isPending ? 'not-allowed' : 'pointer'
        }}
      >
        {createPost.isPending ? 'Creando...' : 'Crear Post'}
      </button>
      
      {createPost.isError && (
        <p style={{ color: '#dc3545', marginTop: '10px' }}>Error: {createPost.error.message}</p>
      )}
    </form>
  );
}

function PostsApp() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  
  const { data: posts, isLoading, error, isFetching } = usePosts();
  const deletePost = useDeletePost();
  const likePost = useLikePost();
  
  if (selectedPostId) {
    return <PostDetail postId={selectedPostId} onBack={() => setSelectedPostId(null)} />;
  }
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ margin: 0 }}>Posts ({posts?.length || 0})</h4>
        {isFetching && <span style={{ fontSize: '12px', color: '#007bff' }}>Actualizando...</span>}
      </div>
      
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ 
            width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007bff',
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px'
          }}></div>
          Cargando posts...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          Error: {error.message}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {posts?.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={setSelectedPostId}
              onDelete={(id) => deletePost.mutate(id)}
              onLike={(id) => likePost.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente principal
export default function ReactQueryExamples() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="modulo">
        <h1>Módulo 10: TanStack Query (React Query)</h1>
        <p className="descripcion">
          TanStack Query maneja estado del servidor con caché, re-fetching y optimización automática.
        </p>
        
        <div className="ejemplos">
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 2fr' }}>
            <CreatePostForm />
            <PostsApp />
          </div>
        </div>
        
        <div className="explicacion">
          <h3>Conceptos Clave:</h3>
          <ul>
            <li><strong>useQuery:</strong> Obtiene datos con caché automático</li>
            <li><strong>useMutation:</strong> Modifica datos con invalidación</li>
            <li><strong>Query Keys:</strong> Identificadores únicos para cada query</li>
            <li><strong>Stale Time:</strong> Tiempo antes de re-fetch automático</li>
            <li><strong>Optimistic Updates:</strong> Actualizar UI antes de confirmar</li>
            <li><strong>Invalidación:</strong> Re-fetch después de mutaciones</li>
            <li><strong>Error Handling:</strong> Estados de error y retry automático</li>
          </ul>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </QueryClientProvider>
  );
}