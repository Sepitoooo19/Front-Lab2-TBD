export function latLngToWKT(lng: number, lat: number): string {
  return `POINT(${lng} ${lat})`;
}

export function wktToLatLng(wkt: string): { lat: number; lng: number } | null {
  const match = wkt.match(/POINT\(([^)]+)\)/i);
  if (!match) return null;

  const coords = match[1].trim().split(/\s+/);
  if (coords.length !== 2) return null;

  // Asegúrate que el orden sea [longitud, latitud] como en WKT estándar
  const lng = parseFloat(coords[0]);
  const lat = parseFloat(coords[1]);

  return { lat, lng };
}

export function parseWKTPoint(wkt: string): [number, number] | null {
  if (!wkt) return null;
  
  // Expresión regular más flexible (ignora mayúsculas/minúsculas y espacios)
  const match = wkt.match(/POINT\s*\(\s*([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s*\)/i);
  
  if (match) {
    try {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      
      // Validación básica de coordenadas
      if (isNaN(lng) || isNaN(lat)) return null;
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
      
      return [lat, lng]; // Leaflet usa [lat, lng]
    } catch {
      return null;
    }
  }
  return null;
}

export function wktToLatLngArray(wkt: string): Array<{ lng: number; lat: number }> | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return [{ lng, lat }];
  }
  return null;
}

export function wktToLatLngArrayMulti(wkt: string): Array<{ lng: number; lat: number }> | null {
  const match = wkt.match(/MULTIPOINT\(([^)]+)\)/);
  if (match) {
    const points = match[1].split(',').map(point => {
      const coords = point.trim().split(' ');
      return { lng: parseFloat(coords[0]), lat: parseFloat(coords[1]) };
    });
    return points;
  }
  return null;
}

export function latLngArrayToWKT(points: Array<{ lng: number; lat: number }>): string {
  const wktPoints = points.map(point => `${point.lng} ${point.lat}`).join(', ');
  return `MULTIPOINT(${wktPoints})`;
}

// Convierte un array de [{ lng, lat }] a un POLYGON WKT
export function latLngArrayToPolygonWKT(points: { lng: number, lat: number }[]): string {
  if (points.length < 3) throw new Error('Un polígono requiere al menos 3 puntos');
  // El primer y último punto deben ser iguales en WKT POLYGON
  const closedPoints = [...points, points[0]];
  const coords = closedPoints.map(p => `${p.lng} ${p.lat}`).join(', ');
  return `POLYGON((${coords}))`;
}

// Parsea un POLYGON WKT a array de puntos
export function wktPolygonToLatLngArray(wkt: string): [number, number][] | null {
  const match = wkt.match(/^POLYGON\s*\(\((.+)\)\)$/);
  if (!match) return null;
  
  return match[1].split(',').map(pair => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return [lat, lng] as [number, number]; // Convertir a formato Leaflet
  });
}

/**
 * Convierte un WKT LineString (de PostGIS) a formato GeoJSON LineString
 * @param wkt WKT LineString (ej: "LINESTRING(10 20, 30 40)")
 * @returns GeoJSON LineString o null si el formato es inválido
 */
  export function wktLineStringToGeoJSON(wkt: string | null): GeoJSON.LineString | null {
    if (!wkt) return null;
    
    // Expresión regular para LINESTRING con diferentes formatos
    const match = wkt.match(/^LINESTRING\s*\((.+)\)$/i);
    if (!match) return null;
    
    try {
      const pointsStr = match[1];
      const coordinates = pointsStr.split(',').map(pointStr => {
        const [lng, lat] = pointStr.trim().split(/\s+/).map(Number);
        return [lng, lat]; // GeoJSON usa [longitud, latitud]
      });
      
      // Validación básica
      if (coordinates.length < 2) return null;
      if (coordinates.some(coord => isNaN(coord[0]) || isNaN(coord[1]))) return null;
      
      return {
        type: 'LineString',
        coordinates
      };
    } catch (error) {
      console.error('Error parsing WKT LineString:', error);
      return null;
    }
  }