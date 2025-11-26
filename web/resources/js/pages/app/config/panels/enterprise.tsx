import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnterpriseConfig } from '@/hooks/useEnterpriseConfig';
import { toast } from 'sonner';

export default function EnterpriseSettings() {
  const {
    config,
    stats,
    loading,
    saving,
    error,
    updateConfig,
    uploadDocumentation,
    resetError
  } = useEnterpriseConfig();

  const [formData, setFormData] = useState({
    enterprise_name: '',
    enterprise_customer_name: '',
    enterprise_customer_email: '',
    enterprise_customer_phone: '',
    enterprise_customer_address: '',
    enterprise_customer_city: '',
    enterprise_customer_state: '',
    enterprise_customer_zip: '',
    enterprise_customer_country: '',
    enterprise_description: ''
  });

  const [isDirty, setIsDirty] = useState(false);

  React.useEffect(() => {
    if (config) {
      setFormData({
        enterprise_name: config.enterprise_name || '',
        enterprise_customer_name: config.enterprise_customer_name || '',
        enterprise_customer_email: config.enterprise_customer_email || '',
        enterprise_customer_phone: config.enterprise_customer_phone || '',
        enterprise_customer_address: config.enterprise_customer_address || '',
        enterprise_customer_city: config.enterprise_customer_city || '',
        enterprise_customer_state: config.enterprise_customer_state || '',
        enterprise_customer_zip: config.enterprise_customer_zip || '',
        enterprise_customer_country: config.enterprise_customer_country || '',
        enterprise_description: config.enterprise_description || ''
      });
    }
  }, [config]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (error) resetError();
  };

  const handleSave = async () => {
    try {
      await updateConfig(formData);
      setIsDirty(false);
      toast.success('Configuración guardada correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar la configuración');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocumentation(file);
      toast.success('Documentación subida correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al subir la documentación');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración de Empresa</h2>
          <p className="text-neutral-400 mt-1">
            Configura la información básica de tu empresa
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={stats.completion_percentage > 50 ? "default" : "secondary"}>
            {stats.completion_percentage}% Completado
          </Badge>
          <Badge variant={stats.has_documentation ? "default" : "outline"}>
            {stats.has_documentation ? '📄 Con documentación' : '📄 Sin documentación'}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="bg-neutral-900/60 border-neutral-700/70">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Progreso de configuración</span>
            <span className="text-sm text-neutral-300">
              {stats.configured_fields} de {stats.total_fields} campos
            </span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completion_percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Formulario */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información de la Empresa */}
        <Card className="bg-neutral-900/60 border-neutral-700/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="enterprise_name" className="text-neutral-300">
                Nombre de la Empresa
              </Label>
              <Input
                id="enterprise_name"
                value={formData.enterprise_name}
                onChange={(e) => handleInputChange('enterprise_name', e.target.value)}
                placeholder="Mi Empresa S.A."
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="enterprise_description" className="text-neutral-300">
                Descripción
              </Label>
              <Textarea
                id="enterprise_description"
                value={formData.enterprise_description}
                onChange={(e) => handleInputChange('enterprise_description', e.target.value)}
                placeholder="Descripción de la empresa y sus servicios..."
                rows={4}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card className="bg-neutral-900/60 border-neutral-700/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Contacto Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="enterprise_customer_name" className="text-neutral-300">
                Nombre del Contacto
              </Label>
              <Input
                id="enterprise_customer_name"
                value={formData.enterprise_customer_name}
                onChange={(e) => handleInputChange('enterprise_customer_name', e.target.value)}
                placeholder="Juan Pérez"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="enterprise_customer_email" className="text-neutral-300">
                Email
              </Label>
              <Input
                id="enterprise_customer_email"
                type="email"
                value={formData.enterprise_customer_email}
                onChange={(e) => handleInputChange('enterprise_customer_email', e.target.value)}
                placeholder="contacto@empresa.com"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="enterprise_customer_phone" className="text-neutral-300">
                Teléfono
              </Label>
              <Input
                id="enterprise_customer_phone"
                value={formData.enterprise_customer_phone}
                onChange={(e) => handleInputChange('enterprise_customer_phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card className="bg-neutral-900/60 border-neutral-700/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              Dirección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="enterprise_customer_address" className="text-neutral-300">
                  Dirección
                </Label>
                <Input
                  id="enterprise_customer_address"
                  value={formData.enterprise_customer_address}
                  onChange={(e) => handleInputChange('enterprise_customer_address', e.target.value)}
                  placeholder="Calle Principal 123"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="enterprise_customer_city" className="text-neutral-300">
                  Ciudad
                </Label>
                <Input
                  id="enterprise_customer_city"
                  value={formData.enterprise_customer_city}
                  onChange={(e) => handleInputChange('enterprise_customer_city', e.target.value)}
                  placeholder="Ciudad"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="enterprise_customer_state" className="text-neutral-300">
                  Estado/Provincia
                </Label>
                <Input
                  id="enterprise_customer_state"
                  value={formData.enterprise_customer_state}
                  onChange={(e) => handleInputChange('enterprise_customer_state', e.target.value)}
                  placeholder="Estado"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="enterprise_customer_zip" className="text-neutral-300">
                  Código Postal
                </Label>
                <Input
                  id="enterprise_customer_zip"
                  value={formData.enterprise_customer_zip}
                  onChange={(e) => handleInputChange('enterprise_customer_zip', e.target.value)}
                  placeholder="12345"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="enterprise_customer_country" className="text-neutral-300">
                  País
                </Label>
                <Input
                  id="enterprise_customer_country"
                  value={formData.enterprise_customer_country}
                  onChange={(e) => handleInputChange('enterprise_customer_country', e.target.value)}
                  placeholder="País"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentación */}
        <Card className="bg-neutral-900/60 border-neutral-700/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Documentación de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-neutral-400">
                Sube documentos sobre tu empresa para mejorar las respuestas del asistente.
                Formatos soportados: PDF, DOCX, TXT, MD
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="documentation"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('documentation')?.click()}
                  disabled={saving}
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Documentación
                </Button>
                {stats.has_documentation && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Documentación cargada</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSave}
          disabled={!isDirty || saving}
          variant="outline"
          className="bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </section>
  );
}