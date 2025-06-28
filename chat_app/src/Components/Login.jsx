import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from'axios'
import {useAuth} from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
    const {setAuthUser} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            {
              email,
              password
            },
            {
              headers: {
                'Content-Type': 'application/json',
                
              },
              withCredentials: true 
            }
          );
      
  
      const data = response.data;
        
      if (data.success === false) {
        setIsLoading(false);
        console.log(data.message);
        toast.error(data.message);
        return;
      }
      
      setAuthUser(data);
      toast.success(data.message);
      localStorage.setItem('chat-app', JSON.stringify(data));
      setIsLoading(false);
      navigate('/')
  
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card animate-pop-in">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please enter your details</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input peer"
              placeholder=" "
            />
            <label htmlFor="login-email" className="auth-label">Email</label>
            <div className="input-highlight"></div>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input peer"
              placeholder=" "
            />
            <label htmlFor="login-password" className="auth-label">Password</label>
            <div className="input-highlight"></div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-gray-600">Don't have an account? <Link to='/register'> Sign Up </Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;