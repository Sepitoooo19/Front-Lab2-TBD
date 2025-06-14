export function latLngToWKT(lng: number, lat: number): string {
  return `POINT(${lng} ${lat})`;
}

export function wktToLatLng(wkt: string): { lng: number; lat: number } | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return { lng, lat };
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
export function wktPolygonToLatLngArray(wkt: string): { lng: number, lat: number }[] | null {
  const match = wkt.match(/^POLYGON\s*\(\((.+)\)\)$/);
  if (!match) return null;
  return match[1].split(',').map(pair => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return { lng, lat };
  });
}