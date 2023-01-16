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
