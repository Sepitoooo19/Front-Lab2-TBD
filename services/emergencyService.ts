// services/emergencyService.ts (frontend)
import type { EmergencyReport } from '~/types/types';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

export async function getAllEmergencyReports(): Promise<EmergencyReport[]> {
    const res = await fetch(`${config.public.apiBase}/emergencies`, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al obtener emergencias');
    return await res.json();
}

export async function getEmergencyReportsByOrder(orderId: number): Promise<EmergencyReport[]> {
    const res = await fetch(`${config.public.apiBase}/emergencies/by-order/${orderId}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al obtener emergencia por orden');
    return await res.json();
}

export async function getEmergencyReportsByDealer(dealerId: number): Promise<EmergencyReport[]> {
    const res = await fetch(`${config.public.apiBase}/emergencies/by-dealer/${dealerId}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al obtener emergencia por dealer');
    return await res.json();
}

export async function getEmergencyReportById(id: number): Promise<EmergencyReport> {
    const res = await fetch(`${config.public.apiBase}/emergencies/${id}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al obtener emergencia por id');
    return await res.json();
}

export async function createEmergencyReport(report: Omit<EmergencyReport, 'id'>): Promise<EmergencyReport> {
    const res = await fetch(`${config.public.apiBase}/emergencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
    });
    if (!res.ok) throw new Error('Error al crear emergencia');
    return await res.json();
}

export async function deleteEmergencyReport(id: number): Promise<void> {
    const res = await fetch(`${config.public.apiBase}/emergencies/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar emergencia');
}