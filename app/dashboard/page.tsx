'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFeedbackHub, useFeedbackHubAutoOpen } from '@/hooks/useFeedbackHub';
import { getCurrentUser } from '@/lib/auth-client';

// TypeScript declaration for FeedbackHub global
declare global {
  interface Window {
    FeedbackHub?: {
      identify: (user: { id: string; email: string; name: string; avatar?: string }) => void;
      clearIdentity: () => void;
      open?: () => void;
    };
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  company?: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // Identify user with FeedbackHub when logged in
  useFeedbackHub(user);
  
  // Auto-open widget if ?feedbackhub=open is in URL
  useFeedbackHubAutoOpen();

  // In TaskFlow - after user logs in or on page load if user exists
  useEffect(() => {
    const identifyUser = async () => {
      const currentUser = await getCurrentUser(); // Your auth function
      
      if (currentUser && window.FeedbackHub?.identify) {
        window.FeedbackHub.identify({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name
        });
      }
    };
    
    identifyUser();
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        // User not logged in - that's okay, they can still view todos
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Clear FeedbackHub identity before logout
    if (window.FeedbackHub && window.FeedbackHub.clearIdentity) {
      window.FeedbackHub.clearIdentity();
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null); // Clear user state immediately
    router.push('/login');
    router.refresh();
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    // Check if user is logged in
    if (!user) {
      // Redirect to login, then come back to dashboard
      router.push(`/login?redirect=/dashboard`);
      return;
    }
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };


  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>TaskFlow</h1>
          {user ? (
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Welcome, {user.name} ({user.plan})
              {user.company && ` • ${user.company}`}
            </p>
          ) : (
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Please login to create notes
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push(`/login?redirect=/dashboard`)}
              style={{
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>My Todos</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder={user ? "Add a new todo..." : "Login to add todos..."}
              disabled={!user}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: user ? 1 : 0.6,
              }}
            />
            <button
              onClick={addTodo}
              disabled={!user}
              style={{
                padding: '0.75rem 1.5rem',
                background: user ? '#667eea' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: user ? 'pointer' : 'not-allowed',
              }}
            >
              Add
            </button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
                <li
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: todo.completed ? '#f0f0f0' : 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#999' : '#333',
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Delete
                  </button>
                </li>
            ))}
            {todos.length === 0 && (
                <li style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                  No todos yet. Add one above!
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
  );
}
