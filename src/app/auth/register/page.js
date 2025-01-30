'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = userData;
      await register(registerData);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Simple password strength calculation
    if (e.target.name === 'password') {
      const strength = calculatePasswordStrength(e.target.value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Large top right gradient circle */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        
        {/* Large bottom left gradient circle */}
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400/20 via-green-400/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        
        {/* Center floating circle */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        
        {/* Small decorative elements */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-blue-400/20 rounded-full blur-sm" />
        <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-purple-400/20 rounded-full blur-sm" />
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-green-400/20 rounded-full blur-sm" />
        <div className="absolute top-1/4 left-1/3 w-5 h-5 bg-pink-400/20 rounded-full blur-sm" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
          <div className="flex flex-col md:flex-row">
            {/* Left panel - Branding */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 p-8 py-12 md:py-16 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-md transform rotate-45" />
                    </div>
                    <h1 className="text-white text-2xl font-bold">Dev-Book</h1>
                  </div>
                  <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Begin Your Developer Journey
                  </h2>
                  <p className="text-blue-100 text-lg mb-8">
                    Join thousands of developers learning through AI-curated content.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Feature cards */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-white/90 text-sm">Personalized learning paths tailored to your goals</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-white/90 text-sm">AI-powered book recommendations based on your level</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-white/90 text-sm">Join a community of passionate developers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - Registration form */}
            <div className="md:w-1/2 p-8 md:p-12 bg-white">
              <div className="max-w-md mx-auto">
                <Link 
                  href="/"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>

                <div className="mt-8 mb-8">
                  <h2 className="text-gray-900 text-3xl font-bold mb-2">Create your account</h2>
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          value={userData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={userData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={userData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Create a strong password"
                        />
                        {/* Password strength indicator */}
                        <div className="mt-2">
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength >= 75 ? 'bg-green-500' :
                                passwordStrength >= 50 ? 'bg-yellow-500' :
                                passwordStrength >= 25 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {passwordStrength >= 75 ? 'Strong password' :
                             passwordStrength >= 50 ? 'Good password' :
                             passwordStrength >= 25 ? 'Moderate password' :
                             'Weak password'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={userData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

