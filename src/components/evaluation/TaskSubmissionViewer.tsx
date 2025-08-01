'use client'

import React, { useState } from 'react'
import { 
  DocumentTextIcon,
  PaperClipIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface TaskSubmission {
  submission_id: string
  student_name: string
  student_grade: string
  submitted_at: string
  is_late: boolean
  score_raw?: number
  teacher_feedback?: string
  status: 'submitted' | 'graded' | 'pending'
  files: Array<{
    filename: string
    file_url: string
    file_size: number
  }>
}

interface TaskSubmissionViewerProps {
  submissions: TaskSubmission[]
  evaluation: {
    title: string
    max_score: number
    due_date: string
  }
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void
}

export function TaskSubmissionViewer({ submissions, evaluation, onGradeSubmission }: TaskSubmissionViewerProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)
  const [gradeInput, setGradeInput] = useState('')
  const [feedbackInput, setFeedbackInput] = useState('')
  const [showGradingModal, setShowGradingModal] = useState(false)

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    late: submissions.filter(s => s.is_late).length
  }

  const openGradingModal = (submission: TaskSubmission) => {
    setSelectedSubmission(submission)
    setGradeInput(submission.score_raw?.toString() || '')
    setFeedbackInput(submission.teacher_feedback || '')
    setShowGradingModal(true)
  }

  const handleGradeSubmit = () => {
    if (!selectedSubmission) return
    
    const score = parseFloat(gradeInput)
    if (isNaN(score) || score < 0 || score > evaluation.max_score) {
      alert(`La calificación debe estar entre 0 y ${evaluation.max_score}`)
      return
    }

    onGradeSubmission(selectedSubmission.submission_id, score, feedbackInput)
    setShowGradingModal(false)
    setSelectedSubmission(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800'
      case 'graded': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{evaluation.title}</h1>
            <p className="text-gray-600">Vence: {new Date(evaluation.due_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            <div className="text-sm text-yellow-800">Entregados</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
            <div className="text-sm text-green-800">Calificados</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.late}</div>
            <div className="text-sm text-red-800">Tardíos</div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="divide-y divide-gray-200">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas disponibles</h3>
              <p className="text-gray-600">Aún no hay entregas para esta tarea</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.submission_id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{submission.student_name}</h3>
                        <p className="text-sm text-gray-600">{submission.student_grade}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status === 'submitted' ? 'Entregado' : 
                         submission.status === 'graded' ? 'Calificado' : 'Pendiente'}
                      </span>
                      {submission.is_late && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          Tardío
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Información</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {new Date(submission.submitted_at).toLocaleString()}
                          </div>
                          {submission.files.length > 0 && (
                            <div className="flex items-center">
                              <PaperClipIcon className="h-4 w-4 mr-2" />
                              {submission.files.length} archivo(s)
                            </div>
                          )}
                        </div>
                      </div>

                      {submission.files.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Archivos</h4>
                          <div className="space-y-2">
                            {submission.files.slice(0, 2).map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <PaperClipIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.filename}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {submission.files.length > 2 && (
                              <p className="text-xs text-gray-500">y {submission.files.length - 2} más...</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Calificación</h4>
                        {submission.score_raw !== undefined ? (
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-blue-600">
                              {submission.score_raw}/{evaluation.max_score}
                            </div>
                            <div className="text-sm text-gray-500">Calificado</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Sin calificar</div>
                        )}
                      </div>
                    </div>

                    {submission.teacher_feedback && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Retroalimentación</h4>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-900">{submission.teacher_feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    <Button
                      onClick={() => openGradingModal(submission)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submission.score_raw !== undefined ? 'Editar Nota' : 'Calificar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Calificar Entrega</h3>
                <Button
                  onClick={() => setShowGradingModal(false)}
                  variant="outline"
                  size="sm"
                >
                  
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedSubmission.student_name}</h4>
                  <p className="text-sm text-gray-600">
                    Entregado: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación (0 - {evaluation.max_score} puntos)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={evaluation.max_score}
                    step="0.5"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retroalimentación
                  </label>
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Escriba comentarios constructivos para el estudiante..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button onClick={() => setShowGradingModal(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGradeSubmit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!gradeInput}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Guardar Calificación
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

export default TaskSubmissionViewer
 