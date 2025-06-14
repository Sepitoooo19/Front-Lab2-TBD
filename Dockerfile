# Etapa 1: Compilación de la aplicación
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json
# Es importante que package-lock.json esté actualizado y presente en tu proyecto
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto de forma limpia y consistente usando package-lock.json
RUN npm ci

# Copia los archivos de configuración de Nuxt y TypeScript (si los tienes separados)
# Si nuxt.config.ts y tsconfig.json no están en la raíz, ajusta la ruta o cópialos con el siguiente COPY.
COPY nuxt.config.ts tsconfig.json ./

# Copia el resto del código fuente de tu aplicación
COPY . .

# Establece NODE_ENV para la compilación (algunos módulos pueden optimizarse)
ENV NODE_ENV=production

# Compila la aplicación Nuxt para producción usando el script de tu package.json
RUN npm run build

# Etapa 2: Entorno de producción
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Establece el entorno a producción
ENV NODE_ENV=production

# Copia la aplicación compilada desde la etapa 'builder'
# Nuxt 3 guarda la salida de compilación en el directorio .output.
# Esta salida usualmente incluye las dependencias necesarias o es un bundle autocontenido.
COPY --from=builder /app/.output ./.output

# Nota: Generalmente, con Nuxt 3, el directorio .output es autocontenido y no necesitas
# ejecutar 'npm install --production' aquí. El servidor Node dentro de .output/server
# ya debería tener sus dependencias o estar empaquetado para funcionar.
# Si por alguna razón específica necesitaras instalar dependencias de producción aquí:
# COPY --from=builder /app/package.json /app/package-lock.json ./
# RUN npm ci --omit=dev # '--omit=dev' es el equivalente a '--production' para npm ci

# Expone el puerto en el que se ejecutará la aplicación Nuxt (por defecto 3000)
EXPOSE 3000

# Comando para iniciar el servidor de Nuxt en producción
# Este es el script de inicio para el servidor Node.js de Nuxt 3
CMD ["node", ".output/server/index.mjs"]