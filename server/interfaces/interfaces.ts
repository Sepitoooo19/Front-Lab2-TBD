interface Faculty {
  facultad_id: number
  nombre: string
  departamentos?: Department[]
}

interface Department {
  departamento_id: number
  nombre: string
  facultad_id: number
  facultad?: Faculty
  carreras?: Career[]
}

interface Career {
  codigo_carrera: string
  grado_id: number
  antecedente_id: number
  es_acreditada: boolean
  nombre_carrera: string
  departamento_id: number
  departamento?: Department
  facultad?: Faculty
}