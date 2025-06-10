import { faker } from '@faker-js/faker'

export const generateFakeStudent = () => ({
  id: faker.number.int(),
  rut: faker.string.numeric(8),
  nombres: faker.person.firstName(),
  apellido_paterno: faker.person.lastName(),
  apellido_materno: faker.person.lastName(),
  fecha_nacimiento: faker.date.past().toLocaleDateString(),
  nacionalidad: faker.location.country(),
  sexo: faker.helpers.arrayElement(['M', 'F']),
  estado_civil: faker.helpers.arrayElement(['Soltero', 'Casado', 'Divorciado']),
  comentario: faker.helpers.maybe(() => faker.lorem.sentence()),
  fono: faker.phone.number(),
  email: faker.internet.email(),
  email_institucional: faker.internet.email({ provider: 'universidad.edu' })
})

export const generateFakeCareer = (departamentoId?: number): Career => ({
  codigo_carrera: faker.string.numeric(6),
  departamento_id: departamentoId || faker.number.int({ min: 1, max: 20 }),
  grado_id: faker.number.int({ min: 1, max: 5 }),
  antecedente_id: faker.number.int({ min: 1, max: 10 }),
  es_acreditada: faker.datatype.boolean(),
  nombre_carrera: faker.helpers.arrayElement([
    'Ingeniería de Software',
    'Medicina',
    'Derecho',
    'Psicología',
    'Arquitectura',
    'Administración'
  ])
})

export const generateFakeDepartment = (facultadId?: number, withCareers = false): Department => {
  const department = {
    departamento_id: faker.number.int(),
    nombre: faker.company.name(),
    facultad_id: facultadId || faker.number.int({ min: 1, max: 10 }),
    carreras: [] as Career[]
  }

  if (withCareers) {
    department.carreras = Array.from(
      { length: faker.number.int({ min: 1, max: 4 }) },
      () => generateFakeCareer(department.departamento_id)
    )
  }

  return department
}

export const generateFakeFaculty = (withDepartments = false): Faculty => {
  const faculty = {
    facultad_id: faker.number.int(),
    nombre: faker.helpers.arrayElement([
      'Facultad de Ingeniería',
      'Facultad de Medicina',
      'Facultad de Derecho',
      'Facultad de Ciencias',
      'Facultad de Humanidades'
    ]),
    departamentos: [] as Department[]
  }

  if (withDepartments) {
    faculty.departamentos = Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      () => generateFakeDepartment(faculty.facultad_id)
    )
  }

  return faculty
}


export const generateCareerWithRelations = (): Career => {
  const faculty = generateFakeFaculty()
  const department = generateFakeDepartment(faculty.facultad_id)
  const career = generateFakeCareer(department.departamento_id)
  
  return {
    ...career,
    departamento: department,
    facultad: faculty
  }
}
