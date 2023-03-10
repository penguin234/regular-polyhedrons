function Rule(pointCount, surfaceCount, surfacePointCount, surfaceAngle) {
  this.pointCount = pointCount;
  this.surfaceCount = surfaceCount;
  this.surfacePointCount = surfacePointCount;
  this.surfaceAngle = surfaceAngle;
}


Rule.ABSOLUTE_TOLERANCE = 0.00000001;
Rule.RELATIVE_TOLERANCE = 0.00000001;

Rule.IsScalarEqual = function(a, b) {
  if (Math.abs(a - b) > Rule.ABSOLUTE_TOLERANCE) {
    return false;
  }
  if (Math.abs(a + b) > 0 && (Math.abs(a - b) / Math.abs(a + b) > Rule.RELATIVE_TOLERANCE)) {
    return false;
  }
  return true;
}


Rule.prototype.ValidatePointCount = function(polyhedron) {
  const pointCount = polyhedron.points.length;
  if (this.pointCount == pointCount) {
    return {
      OK: true
    };
  }
  else {
    return {
      Err: { message: 'Points should be ' + String(this.pointCount) + ' but it is ' + String(pointCount) }
    };
  }
};


Rule.prototype.ValidateSurfaceCount = function(polyhedron) {
  const surfaceCount = polyhedron.surfaces.length;
  if (this.surfaceCount == surfaceCount) {
    return {
      OK: true
    };
  }
  return {
    Err: { message: 'surfaces should be ' + String(this.pointCount) + ' but it is ' + String(pointCount) }
  };
};


Rule.prototype.ValidateSurfacePointCount = function(polyhedron) {
  const pr = this.surfacePointCount;
  for (let i = 0; i < this.surfaceCount; i++) {
    let p = polyhedron.surfaces[i].length;
    if (p != pr) {
      return {
        Err: { message: 'points of surface should be ' + String(pr) + ' but it is ' + String(p) }
      };
    }
  }
  return {
    OK: true
  };
};


Rule.GetSurfacePoints = function(polyhedron, index) {
  return polyhedron.surfaces[index].map(p => polyhedron.points[p]);
};


Rule.prototype.CheckSideLength = function(surface) {
  const c = this.surfacePointCount;
  let v = Vector.FromPoints(surface[c - 1], surface[0])
  const l = Vector.Size(v);
  for (let i = 1; i < c; i++) {
    v = Vector.FromPoints(surface[i - 1], surface[i]);
    if (!Rule.IsScalarEqual(Vector.Size(v), l)) {
      return {
         Err: { message: 'side length of a surface is differnet' }
      };
    }
  }
  return {
    OK: l
  };
};

Rule.prototype.ValidateSideLengths = function(polyhedron) {
  let res = this.CheckSideLength(Rule.GetSurfacePoints(polyhedron, 0));
  if (res.Err) {
    return res;
  }
  let l = res.OK;
  for (let i = 1; i < this.surfaceCount; i++) {
    res = this.CheckSideLength(Rule.GetSurfacePoints(polyhedron, i));
    if (res.Err) {
      return res;
    }
    if (res.OK != l) {
      return {
        Err: { message: 'side length between surfaces are different' }
      };
    }
  }
  return res;
};


Rule.prototype.CheckAngle = function(p1, p2, p3) {
  const v1 = Vector.FromPoints(p2, p1);
  const v2 = Vector.FromPoints(p2, p3);
  const prod = Vector.InnerProduct(v1, v2);
  const cosA = prod / (Vector.Size(v1) * Vector.Size(v2));
  const angle = Math.acos(cosA);
  if (Rule.IsScalarEqual(this.surfaceAngle, angle)) {
    return { OK: true };
  }
  return {
    Err: {
      message: 'angle should be ' + String(this.surfaceAngle) + ' but it is ' + String(angle),
      difference: Math.abs(this.surfaceAngle - angle)
    }
  };
};

Rule.prototype.CheckSurfaceAngles = function(surface) {
  const c = this.surfacePointCount;
  let res = this.CheckAngle(surface[c - 1], surface[0], surface[1]);
  if (res.Err) {
    return res;
  }
  for (let i = 2; i < c; i++) {
    res = this.CheckAngle(surface[i - 2], surface[i - 1], surface[i]);
    if (res.Err) {
      return res;
    }
  }
  return res;
};

Rule.prototype.ValidateSurfaceAngles = function(polyhedron) {
  let res = this.CheckSurfaceAngles(Rule.GetSurfacePoints(polyhedron, 0));
  if (res.Err) {
    return res;
  }
  for (let i = 1; i < this.surfaceCount; i++) {
    res = this.CheckSurfaceAngles(Rule.GetSurfacePoints(polyhedron, i));
    if (res.Err) {
      return res;
    }
  }
  return res;
};


Rule.prototype.CheckSurfaceDifferent = function(polyhedron, s1index, s2index) {
  const s1 = polyhedron.surfaces[s1index];
  const s2 = polyhedron.surfaces[s2index];

  const c = this.surfacePointCount;
  let pivot = 0;
  while (s1[pivot] != s2[0]) {
    pivot++;
    if (pivot == c) {
      return {
        OK: true
      };
    }
  }
  
  for (let i = 1; i < c; i++) {
    if (s1[(pivot + i) % c] != s2[i]) {
      return {
        OK: true
      };
    }
  }

  return {
    Err: { message: 'those surfaces are same: ' + String(s1) + ' and ' + String(s2) }
  };
};

Rule.prototype.ValidateSurfacesUnique = function(polyhedron) {
  const s = this.surfaceCount;
  for (let i = 0; i < s; i++) {
    for (let j = i + 1; j < s; j++) {
      let res = this.CheckSurfaceDifferent(polyhedron, i, j);
      if (res.Err) {
        return res;
      }
    }
  }
  return {
    OK: true
  };
};
