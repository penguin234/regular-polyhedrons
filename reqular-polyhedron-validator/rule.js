function Rule(pointCount, surfaceCount, surfaceAngle) {
  this.pointCount = pointCount;
  this.surfaceCount = surfaceCount;
  this.surfaceAngle = surfaceAngle;
}


Rule.prototype.ValidatePointCount = function(polyhedron) {
  const pointCount = polyhedron.points.length;
  if (this.pointCount == pointCount) {
    return {
      OK: true
    }
  }
  else {
    return {
      Err: { message: 'Points should be ' + String(this.pointCount) + ' but it is ' + String(pointCount) }
    }
  }
};


Rule.prototype.ValidateSurfaceCount = function(polyhedron) {
  const surfaceCount = polyhedron.surfaces.length;
  if (this.surfaceCount == surfaceCount) {
    return {
      OK: true
    }
  }
  else {
    return {
      Err: { message: 'surfaces should be ' + String(this.pointCount) + ' but it is ' + String(pointCount) }
    }
  }
};


Rule.prototype.CheckSideLength = function(surface) {
  const c = surface.length;
  let v = Vector.FromPoints(surface[c - 1], surface[0])
  const l = Math.sqrt(Vector.InnerProduct(v, v));
  for (let i = 1; i < c; i++) {
    v = Vector.FromPoints(surface[i - 1], surface[i])
