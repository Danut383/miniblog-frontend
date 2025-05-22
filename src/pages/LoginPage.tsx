import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { signIn, signUp, loading } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        await signUp(email, password, name);
        setSuccess('Cuenta creada con éxito. Ahora inicia sesión.');
        setIsRegister(false);
        setPassword('');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Ocurrió un error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-16">
      <h1 className="text-2xl font-bold mb-6 text-center">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-10">
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4 text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {isRegister ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setSuccess('');
            setPassword('');
          }}
        >
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión aquí'
            : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
