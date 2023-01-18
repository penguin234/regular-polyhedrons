function Vector() {}

Vector.FromPoints = function(start, end) {
  return [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
};

Vector.InnerProduct = function(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};

Vector.Size = function(v) {
  return Math.sqrt(Vector.InnerProduct(v, v));
};
