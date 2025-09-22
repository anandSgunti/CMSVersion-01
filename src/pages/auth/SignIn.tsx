import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Heart } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../providers/ToastProvider';
import logo from "../../assets/med1.png"; // Fixed path

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        showToast('Welcome back to J&J Healthcare Innovation Platform!', 'success');
        navigate('/projects');
      }
    } catch {
      setError('An unexpected error occurred');
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex">
      {/* Left Side - Branding (Red background) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#D22630] to-[#A30C14]">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white h-full">
          {/* Branding Area */}
          {/* Make this container relative so the logo can be absolutely positioned
              and vertically centered to the text block */}
          <div className="relative mb-15">
            {/* Absolutely positioned logo box, vertically centered to the text */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <img
                  src={logo}
                  alt="Mednet Health Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              </div>
            </div>

            {/* Text shifted right by logo width + desired gap */}
            <div className="pl-36 sm:pl-40">
              <h1 className="text-4xl sm:text-6xl font-bold leading-tight">Mednet Health</h1>
              <p className="text-white/90 text-lg sm:text-2xl ml-1">
                Healthcare Innovation Platform
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Statement */}
        <div className="absolute bottom-6 left-12 text-white/80 text-sm">
          <p>© 2025 Mednet Health. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D22630] to-[#A30C14]">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-1xl font-bold text-foreground">Mednet Health</h1>
                <p className="text-muted-foreground">Healthcare Innovation</p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">
              Sign in to access your healthcare innovation workspace
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-elegant border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@jnj.com"
                className="transition-all duration-200 focus:shadow-lg"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="transition-all duration-200 focus:shadow-lg"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-xl shadow-elegant transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] bg-gradient-to-r from-[#D22630] to-[#A30C14] hover:opacity-95"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Need help accessing your account?</p>
              <div className="flex justify-center gap-4 text-sm">
                <button className="text-[#D22630] hover:opacity-80 transition-colors">Reset Password</button>
                <span className="text-muted-foreground">•</span>
                <button className="text-[#D22630] hover:opacity-80 transition-colors">Contact Support</button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This platform is for authorized personnel only.<br />
              All access is monitored and logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
