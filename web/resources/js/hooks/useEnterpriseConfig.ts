import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

interface EnterpriseConfig {
  id?: number;
  enterprise_name?: string;
  enterprise_customer_name?: string;
  enterprise_customer_email?: string;
  enterprise_customer_phone?: string;
  enterprise_customer_address?: string;
  enterprise_customer_city?: string;
  enterprise_customer_state?: string;
  enterprise_customer_zip?: string;
  enterprise_customer_country?: string;
  enterprise_description?: string;
  enterprise_documentation_text?: string;
  created_at?: string;
  updated_at?: string;
}

interface EnterpriseConfigStats {
  configured_fields: number;
  total_fields: number;
  completion_percentage: number;
  has_documentation: boolean;
}

interface EnterpriseConfigResponse {
  configuration: EnterpriseConfig | null;
  stats: EnterpriseConfigStats;
}

export function useEnterpriseConfig() {
  const [config, setConfig] = useState<EnterpriseConfig | null>(null);
  const [stats, setStats] = useState<EnterpriseConfigStats>({
    configured_fields: 0,
    total_fields: 10,
    completion_percentage: 0,
    has_documentation: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<{
        success: boolean;
        data: EnterpriseConfigResponse;
      }>('/enterprise-config');

      if (response.data.success) {
        setConfig(response.data.data.configuration);
        setStats(response.data.data.stats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la configuración');
      console.error('Error fetching enterprise config:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<EnterpriseConfig>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await axios.put<{
        success: boolean;
        data: EnterpriseConfigResponse;
        message: string;
      }>('/enterprise-config', data);

      if (response.data.success) {
        setConfig(response.data.data.configuration);
        setStats(response.data.data.stats);
        return response.data;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar la configuración';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const uploadDocumentation = async (file: File) => {
    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<{
        success: boolean;
        message: string;
      }>('/enterprise-config/upload-documentation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Refresh the config to get updated documentation status
        await fetchConfig();
        return response.data;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al subir la documentación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    stats,
    loading,
    saving,
    error,
    updateConfig,
    uploadDocumentation,
    refetch: fetchConfig,
    resetError
  };
}