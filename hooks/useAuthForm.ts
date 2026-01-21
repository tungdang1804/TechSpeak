
import React, { useState, useCallback } from 'react';

export const useAuthForm = (onSubmit: (data: any) => Promise<void>) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }, [error]);

  const validate = () => {
    if (!formData.email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự');
      return false;
    }
    if (mode === 'register' && !formData.name.trim()) {
      setError('Vui lòng nhập tên');
      return false;
    }
    return true;
  };

  // Fixed React namespace error by importing React
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit({ ...formData, mode });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return { mode, setMode, formData, updateField, error, loading, submit };
};
