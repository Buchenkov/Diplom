
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Успешный ответ от сервера:', data);
//         const { token, tokenExpire } = data;
//         await login(token, tokenExpire);
//         navigate('/home');
//       } else {
//         const errorData = await response.json();
//         console.error('Ошибка авторизации:', errorData);
//         setError(errorData.message || 'Ошибка авторизации');
//       }
//     } catch (error) {
//       console.error('Ошибка при отправке запроса на вход', error);
//       setError('Ошибка при отправке запроса на вход');
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Логин:</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             autoComplete="username"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Пароль:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//           />
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         <button type="submit">Войти</button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, login, logout } = useContext(AuthContext);

    useEffect(() => {
        // Получение CSRF токена из cookies
        const getCSRFToken = () => {
            let csrfToken = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.startsWith('csrftoken=')) {
                        csrfToken = decodeURIComponent(cookie.split('=')[1]);
                        break;
                    }
                }
            }
            return csrfToken;
        };

        const csrfToken = getCSRFToken();
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    }, []);

      const handleLogin = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            username,
            password,
          });
          localStorage.setItem('token', response.data.token);
          login(response.data.token);
          window.location.href = '/dashboard';
        } catch (error) {
          setError('Invalid credentials, please try again.');
        }
      };

    return (
        <div>
            <h2>{isAuthenticated ? 'Welcome!' : 'Login'}</h2>
            {isAuthenticated ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            )}
            </div>
    );
}

export default Login;