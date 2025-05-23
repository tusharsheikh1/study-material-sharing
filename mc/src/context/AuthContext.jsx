import { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; // ✅ centralized axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching user:', error.response?.data?.message || error.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // ✅ Register using studentId instead of phone
  const register = async ({ fullName, email, studentId, password, phoneNumber, role, semester, batch }) => {
    try {
      if (role === 'faculty') {
        throw new Error("Faculty role is not allowed.");
      }

      const registrationData = {
        fullName,
        email,
        password,
        phoneNumber,
        role,
        semester,
        batch,
      };

      if (role !== "faculty" && studentId) {
        registrationData.studentId = studentId.toLowerCase();
      }

      await api.post('/auth/register', registrationData);
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // ✅ Login with email or studentId
  const login = async (emailOrId, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        emailOrId,
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // ✅ Verify OTP using email only
const verifyOtp = async ({ email, otp }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', {
      email,
      otp,
    });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return true;
  } catch (error) {
    console.error('OTP verification error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

  // ✅ Send OTP via email only
  const sendOtp = async ({ email }) => {
    try {
      await api.post('/auth/send-otp', { email });
      return true;
    } catch (error) {
      console.error('Send OTP error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  // ✅ Reset password using email only
  const resetPassword = async ({ email, otp, newPassword }) => {
    try {
      const { data } = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Reset password error:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Role-based access helpers
  const isAdmin = () => user?.role === 'admin';
  const isCr = () => user?.role === 'cr';
  const isStudent = () => user?.role === 'student';
  const isAuthenticated = () => !!user;
  const isApproved = () => user?.approved === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        verifyOtp,
        sendOtp,
        resetPassword,
        logout,
        loading,
        isAdmin,
        isCr,
        isStudent,
        isAuthenticated,
        isApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
