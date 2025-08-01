'use client'

import React, { useState } from 'react'
import { 
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface Intervention {
  intervention_id: string
  student_name: string
  student_grade: string
  type: 'psychological' | 'academic' | 'social' | 'behavioral' | 'family'
  status: 'planned' | 'active' | 'completed' | 'suspended'
  priority: 'low' | 'medium' | 'high'
  professional: string
  start_date: string
  expected_end_date: string
  total_sessions: number
  completed_sessions: number
  next_session?: string
  objectives: string[]
  progress: number
  notes: string
  location: string
  frequency: string
}

interface InterventionTrackerProps {
  interventions: Intervention[]
  onUpdateProgress: (interventionId: string, progress: number, notes: string) => void
  onScheduleSession: (interventionId: string, date: string) => void
  onCompleteIntervention: (interventionId: string) => void
}

export function InterventionTracker({ 
  interventions, 
  onUpdateProgress, 
  onScheduleSession, 
  onCompleteIntervention 
}: InterventionTrackerProps) {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [progressInput, setProgressInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredInterventions = interventions.filter(intervention => {
    const matchesStatus = filterStatus === 'all' || intervention.status === filterStatus
    const matchesType = filterType === 'all' || intervention.type === filterType
    return matchesStatus && matchesType
  })

  const stats = {
    total: interventions.length,
    active: interventions.filter(i => i.status === 'active').length,
    completed: interventions.filter(i => i.status === 'completed').length,
    planned: interventions.filter(i => i.status === 'planned').length,
    avgProgress: interventions.length > 0 
      ? interventions.reduce((sum, i) => sum + i.progress, 0) / interventions.length 
      : 0
  }

  const openUpdateModal = (intervention: Intervention) => {
    setSelectedIntervention(intervention)
    setProgressInput(intervention.progress.toString())
    setNotesInput(intervention.notes)
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = () => {
    if (!selectedIntervention) return
    
    const progress = parseInt(progressInput)
    if (isNaN(progress) || progress < 0 || progress > 100) {
      alert('El progreso debe estar entre 0 y 100%')
      return
    }

    onUpdateProgress(selectedIntervention.intervention_id, progress, notesInput)
    setShowUpdateModal(false)
    setSelectedIntervention(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'completed': return 'Completada'
      case 'planned': return 'Planificada'
      case 'suspended': return 'Suspendida'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'psychological': return 'Psicológica'
      case 'academic': return 'Académica'
      case 'social': return 'Social'
      case 'behavioral': return 'Conductual'
      case 'family': return 'Familiar'
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Intervenciones</h1>
            <p className="text-gray-600">Monitoreo y progreso de intervenciones activas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-800">Activas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.planned}</div>
            <div className="text-sm text-yellow-800">Planificadas</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-purple-800">Completadas</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{Math.round(stats.avgProgress)}%</div>
            <div className="text-sm text-indigo-800">Progreso Promedio</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activas</option>
              <option value="planned">Planificadas</option>
              <option value="completed">Completadas</option>
              <option value="suspended">Suspendidas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="psychological">Psicológica</option>
              <option value="academic">Académica</option>
              <option value="social">Social</option>
              <option value="behavioral">Conductual</option>
              <option value="family">Familiar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interventions List */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="divide-y divide-gray-200">
          {filteredInterventions.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay intervenciones disponibles
              </h3>
              <p className="text-gray-600">
                No hay intervenciones que coincidan con los filtros seleccionados
              </p>
            </div>
          ) : (
            filteredInterventions.map((intervention) => (
              <div key={intervention.intervention_id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {intervention.student_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {intervention.student_grade}  {getTypeText(intervention.type)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                        {getStatusText(intervention.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(intervention.priority)}`}>
                        Prioridad {getPriorityText(intervention.priority)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                      {/* Professional Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Profesional</h4>
                        <div className="text-sm text-gray-600">
                          <div>{intervention.professional}</div>
                          <div className="flex items-center mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {intervention.frequency}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {intervention.location}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Cronograma</h4>
                        <div className="text-sm text-gray-600">
                          <div>Inicio: {new Date(intervention.start_date).toLocaleDateString()}</div>
                          <div>Término: {new Date(intervention.expected_end_date).toLocaleDateString()}</div>
                          {intervention.next_session && (
                            <div className="text-blue-600 mt-1">
                              Próxima: {new Date(intervention.next_session).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Progreso</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Sesiones:</span>
                            <span>{intervention.completed_sessions}/{intervention.total_sessions}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(intervention.completed_sessions / intervention.total_sessions) * 100}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            {intervention.progress}% completado
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Acciones</h4>
                        <div className="space-y-2">
                          <Button
                            onClick={() => openUpdateModal(intervention)}
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Actualizar Progreso
                          </Button>
                          
                          {intervention.status === 'active' && intervention.progress >= 90 && (
                            <Button
                              onClick={() => onCompleteIntervention(intervention.intervention_id)}
                              size="sm"
                              variant="outline"
                              className="w-full text-green-600 border-green-600 hover:bg-green-50"
                            >
                              Marcar Completada
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Objetivos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {intervention.objectives.map((objective, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {intervention.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notas Recientes</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{intervention.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Update Progress Modal */}
      {showUpdateModal && selectedIntervention && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Actualizar Progreso de Intervención
                </h3>
                <Button
                  onClick={() => setShowUpdateModal(false)}
                  variant="outline"
                  size="sm"
                >
                  
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedIntervention.student_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getTypeText(selectedIntervention.type)}  {selectedIntervention.professional}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sesiones: {selectedIntervention.completed_sessions}/{selectedIntervention.total_sessions}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progreso General (0-100%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressInput}
                    onChange={(e) => setProgressInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas de Progreso
                  </label>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Describa los avances, dificultades y próximos pasos..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowUpdateModal(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpdateSubmit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Actualizar Progreso
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterventionTracker
