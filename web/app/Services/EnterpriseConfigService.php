<?php

namespace App\Services;

use App\Models\EnterpriseConfig;
use Illuminate\Support\Facades\Log;
use Exception;

class EnterpriseConfigService
{
    /**
     * Obtiene la configuración de la empresa
     */
    public function getConfiguration(): ?EnterpriseConfig
    {
        try {
            return EnterpriseConfig::first();
        } catch (Exception $e) {
            Log::error('Error getting enterprise configuration: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Actualiza la configuración de la empresa
     */
    public function updateConfiguration(array $data): EnterpriseConfig
    {
        try {
            $enterprise = EnterpriseConfig::first();
            
            if (!$enterprise) {
                $enterprise = new EnterpriseConfig();
            }

            // Validar y asignar solo los campos permitidos
            $allowedFields = [
                'enterprise_name',
                'enterprise_customer_name',
                'enterprise_customer_email',
                'enterprise_customer_phone',
                'enterprise_customer_address',
                'enterprise_customer_city',
                'enterprise_customer_state',
                'enterprise_customer_zip',
                'enterprise_customer_country',
                'enterprise_description'
            ];

            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $data)) {
                    $enterprise->{$field} = $data[$field];
                }
            }

            $enterprise->save();

            return $enterprise;
        } catch (Exception $e) {
            Log::error('Error updating enterprise configuration: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Valida los datos de configuración de la empresa
     */
    public function validateConfigurationData(array $data): array
    {
        $rules = [
            'enterprise_name' => 'nullable|string|max:255',
            'enterprise_customer_name' => 'nullable|string|max:255',
            'enterprise_customer_email' => 'nullable|email|max:255',
            'enterprise_customer_phone' => 'nullable|string|max:50',
            'enterprise_customer_address' => 'nullable|string|max:500',
            'enterprise_customer_city' => 'nullable|string|max:100',
            'enterprise_customer_state' => 'nullable|string|max:100',
            'enterprise_customer_zip' => 'nullable|string|max:20',
            'enterprise_customer_country' => 'nullable|string|max:100',
            'enterprise_description' => 'nullable|string|max:1000'
        ];

        return $rules;
    }

    /**
     * Obtiene las estadísticas de la configuración de la empresa
     */
    public function getConfigurationStats(): array
    {
        try {
            $enterprise = $this->getConfiguration();
            
            if (!$enterprise) {
                return [
                    'configured_fields' => 0,
                    'total_fields' => 10,
                    'completion_percentage' => 0,
                    'has_documentation' => false
                ];
            }

            $fields = [
                'enterprise_name',
                'enterprise_customer_name',
                'enterprise_customer_email',
                'enterprise_customer_phone',
                'enterprise_customer_address',
                'enterprise_customer_city',
                'enterprise_customer_state',
                'enterprise_customer_zip',
                'enterprise_customer_country',
                'enterprise_description'
            ];

            $configuredFields = 0;
            foreach ($fields as $field) {
                if (!empty($enterprise->{$field})) {
                    $configuredFields++;
                }
            }

            $totalFields = count($fields);
            $completionPercentage = round(($configuredFields / $totalFields) * 100);

            return [
                'configured_fields' => $configuredFields,
                'total_fields' => $totalFields,
                'completion_percentage' => $completionPercentage,
                'has_documentation' => !empty($enterprise->enterprise_documentation_text)
            ];
        } catch (Exception $e) {
            Log::error('Error getting enterprise configuration stats: ' . $e->getMessage());
            return [
                'configured_fields' => 0,
                'total_fields' => 10,
                'completion_percentage' => 0,
                'has_documentation' => false
            ];
        }
    }
}