'use client'

import React, { useState } from 'react'
import { 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  AcademicCapIcon,
  UsersIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface Student {
  student_id: string
  first_name: string
  last_name: string
  rut: string
  grade: string
  academic_info: {
    avg_grade: number
    attendance_rate: number
    behavior_score: number
  }
}

interface RiskFactor {
  id: string
  category: 'academic' | 'social' | 'emotional' | 'behavioral' | 'family'
  name: string
  severity: 1 | 2 | 3 | 4 | 5
}

interface RiskAssessment {
  student_id: string
  risk_factors: RiskFactor[]
  overall_risk_level: 'low' | 'medium' | 'high' | 'critical'
  notes: string
  confidence_level: number
}

interface RiskAssessmentWizardProps {
  studentId: string
  onComplete: (assessment: RiskAssessment) => void
  onCancel: () => void
}

const RISK_CATEGORIES = {
  academic: {
    name: 'Académico',
    icon: AcademicCapIcon,
    color: 'blue',
    factors: [
      { name: 'Bajo rendimiento académico', severity: 3 },
      { name: 'Ausencias frecuentes', severity: 4 },
      { name: 'Dificultades de aprendizaje', severity: 2 },
      { name: 'Falta de motivación', severity: 2 }
    ]
  },
  social: {
    name: 'Social',
    icon: UsersIcon,
    color: 'green',
    factors: [
      { name: 'Aislamiento social', severity: 3 },
      { name: 'Víctima de bullying', severity: 4 },
      { name: 'Comportamiento agresivo', severity: 4 },
      { name: 'Falta de habilidades sociales', severity: 2 }
    ]
  },
  emotional: {
    name: 'Emocional',
    icon: HeartIcon,
    color: 'pink',
    factors: [
      { name: 'Síntomas de depresión', severity: 4 },
      { name: 'Ansiedad severa', severity: 4 },
      { name: 'Baja autoestima', severity: 3 },
      { name: 'Cambios de humor extremos', severity: 3 }
    ]
  },
  behavioral: {
    name: 'Conductual',
    icon: ExclamationTriangleIcon,
    color: 'orange',
    factors: [
      { name: 'Conductas disruptivas', severity: 3 },
      { name: 'Problemas de disciplina', severity: 3 },
      { name: 'Uso de sustancias', severity: 5 },
      { name: 'Autolesión', severity: 5 }
    ]
  },
  family: {
    name: 'Familiar',
    icon: HomeIcon,
    color: 'purple',
    factors: [
      { name: 'Violencia intrafamiliar', severity: 5 },
      { name: 'Negligencia parental', severity: 4 },
      { name: 'Problemas económicos severos', severity: 3 },
      { name: 'Separación familiar', severity: 3 }
    ]
  }
}

export function RiskAssessmentWizard({ studentId, onComplete, onCancel }: RiskAssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [student, setStudent] = useState<Student | null>({
    student_id: studentId,
    first_name: 'María',
    last_name: 'González',
    rut: '12.345.678-9',
    grade: '7° Básico A',
    academic_info: {
      avg_grade: 4.2,
      attendance_rate: 75.5,
      behavior_score: 6.8
    }
  })
  
  const [assessment, setAssessment] = useState<RiskAssessment>({
    student_id: studentId,
    risk_factors: [],
    overall_risk_level: 'low',
    notes: '',
    confidence_level: 5
  })

  const totalSteps = 6

  const addRiskFactor = (categoryKey: string, factor: any) => {
    const newFactor: RiskFactor = {
      id: `${categoryKey}-${Date.now()}`,
      category: categoryKey as any,
      name: factor.name,
      severity: factor.severity
    }

    setAssessment(prev => ({
      ...prev,
      risk_factors: [...prev.risk_factors, newFactor]
    }))
  }

  const removeRiskFactor = (factorId: string) => {
    setAssessment(prev => ({
      ...prev,
      risk_factors: prev.risk_factors.filter(f => f.id !== factorId)
    }))
  }

  const calculateOverallRisk = () => {
    const riskScores = assessment.risk_factors.map(factor => factor.severity)
    const criticalFactors = riskScores.filter(score => score >= 5).length
    const highFactors = riskScores.filter(score => score >= 4).length
    const totalRisk = riskScores.reduce((sum, score) => sum + score, 0)

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'

    if (criticalFactors > 0 || totalRisk >= 20) {
      riskLevel = 'critical'
    } else if (highFactors >= 2 || totalRisk >= 15) {
      riskLevel = 'high'
    } else if (highFactors >= 1 || totalRisk >= 8) {
      riskLevel = 'medium'
    }

    setAssessment(prev => ({ ...prev, overall_risk_level: riskLevel }))
  }

  React.useEffect(() => {
    calculateOverallRisk()
  }, [assessment.risk_factors])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete(assessment)
  }

  const getRiskLevelInfo = (level: string) => {
    switch (level) {
      case 'critical':
        return { color: 'red', text: 'Crítico', icon: ExclamationTriangleIcon }
      case 'high':
        return { color: 'orange', text: 'Alto', icon: ShieldExclamationIcon }
      case 'medium':
        return { color: 'yellow', text: 'Medio', icon: ExclamationTriangleIcon }
      default:
        return { color: 'green', text: 'Bajo', icon: HeartIcon }
    }
  }

  if (!student) return null

  const riskInfo = getRiskLevelInfo(assessment.overall_risk_level)
  const RiskIcon = riskInfo.icon

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Evaluación de Riesgo</h1>
              <p className="text-blue-100">
                {student.first_name} {student.last_name}  {student.grade}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm opacity-90">Nivel de Riesgo</div>
            <div className="flex items-center text-yellow-300">
              <RiskIcon className="h-5 w-5 mr-1" />
              {riskInfo.text}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
          </div>
          <div className="w-full bg-blue-700 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Student Overview */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Información del Estudiante</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Datos Personales</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nombre:</span>
                      <span className="ml-2 font-medium">{student.first_name} {student.last_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">RUT:</span>
                      <span className="ml-2">{student.rut}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Curso:</span>
                      <span className="ml-2">{student.grade}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Rendimiento Académico</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Promedio:</span>
                      <span className="ml-2 font-medium text-red-600">{student.academic_info.avg_grade.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Asistencia:</span>
                      <span className="ml-2 font-medium text-red-600">{student.academic_info.attendance_rate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Comportamiento:</span>
                      <span className="ml-2 font-medium text-yellow-600">{student.academic_info.behavior_score}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps 2-6: Risk Factor Categories */}
        {currentStep >= 2 && currentStep <= 6 && (
          <div className="space-y-6">
            {(() => {
              const categoryKeys = Object.keys(RISK_CATEGORIES)
              const categoryKey = categoryKeys[currentStep - 2]
              const category = RISK_CATEGORIES[categoryKey as keyof typeof RISK_CATEGORIES]
              const CategoryIcon = category.icon

              return (
                <>
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className="h-8 w-8 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Factores de Riesgo: {category.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {category.factors.map((factor, index) => {
                      const isSelected = assessment.risk_factors.some(rf => 
                        rf.category === categoryKey && rf.name === factor.name
                      )

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              const factorToRemove = assessment.risk_factors.find(rf => 
                                rf.category === categoryKey && rf.name === factor.name
                              )
                              if (factorToRemove) {
                                removeRiskFactor(factorToRemove.id)
                              }
                            } else {
                              addRiskFactor(categoryKey, factor)
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {factor.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Severidad:</span>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`w-3 h-3 rounded-full ${
                                        level <= factor.severity 
                                          ? 'bg-red-500' 
                                          : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center space-x-3">
            <Button onClick={onCancel} variant="outline">
              Cancelar
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Completar Evaluación
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                Siguiente
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAssessmentWizard
 