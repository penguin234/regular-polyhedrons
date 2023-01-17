function Vector() {}

Vector.FromPoints = function(start, end) {
  return [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
};

Vector.InnerProduct = function(p1, p2) {
  return p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
};
