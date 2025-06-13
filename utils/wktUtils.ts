export function latLngToWKT(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`;
}

export function wktToLatLng(wkt: string): { lat: number; lng: number } | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return { lat, lng };
  }
  return null;
}

export function wktToLatLngArray(wkt: string): Array<{ lat: number; lng: number }> | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return [{ lat, lng }];
  }
  return null;
}
export function wktToLatLngArrayMulti(wkt: string): Array<{ lat: number; lng: number }> | null {
  const match = wkt.match(/MULTIPOINT\(([^)]+)\)/);
  if (match) {
    const points = match[1].split(',').map(point => {
      const coords = point.trim().split(' ');
      return { lat: parseFloat(coords[1]), lng: parseFloat(coords[0]) };
    });
    return points;
  }
  return null;
}

export function latLngArrayToWKT(points: Array<{ lat: number; lng: number }>): string {
  const wktPoints = points.map(point => `${point.lng} ${point.lat}`).join(', ');
  return `MULTIPOINT(${wktPoints})`;
}

// Convierte un array de [{ lat, lng }] a un POLYGON WKT
export function latLngArrayToPolygonWKT(points: { lat: number, lng: number }[]): string {
  if (points.length < 3) throw new Error('Un polígono requiere al menos 3 puntos');
  // El primer y último punto deben ser iguales en WKT POLYGON
  const closedPoints = [...points, points[0]];
  const coords = closedPoints.map(p => `${p.lng} ${p.lat}`).join(', ');
  return `POLYGON((${coords}))`;
}

// Parsea un POLYGON WKT a array de puntos
export function wktPolygonToLatLngArray(wkt: string): { lat: number, lng: number }[] | null {
  const match = wkt.match(/^POLYGON\s*\(\((.+)\)\)$/);
  if (!match) return null;
  return match[1].split(',').map(pair => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return { lat, lng };
  });
}