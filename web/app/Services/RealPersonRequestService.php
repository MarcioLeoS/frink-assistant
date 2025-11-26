<?php

namespace App\Services;

use App\Models\RealPersonRequest;

class RealPersonRequestService
{
    // Listar todas con cliente
    public function getAllWithCustomer()
    {
        return RealPersonRequest::with('customer', 'agent')->orderByDesc('id')->paginate(15);
    }

    // Obtener una por ID con cliente
    public function getByIdWithCustomer($id)
    {
        return RealPersonRequest::with('customer')->find($id);
    }

    // Crear nueva
    public function create(array $data)
    {
        return RealPersonRequest::create($data);
    }

    // Actualizar
    public function update($id, array $data)
    {
        $request = RealPersonRequest::find($id);
        if (!$request) return null;
        $request->update($data);
        return $request->fresh('customer');
    }

    // Asignar agente
    public function assignAgent($id, $agentId)
    {
        $request = RealPersonRequest::find($id);
        if (!$request) return null;
        $request->agent_id = $agentId;
        $request->save();
        return $request->fresh('customer');
    }

    // Eliminar
    public function delete($id)
    {
        $request = RealPersonRequest::find($id);
        if (!$request) return false;
        $request->delete();
        return true;
    }
}