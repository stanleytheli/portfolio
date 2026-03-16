import { randNormal } from './utils';

// 3D Vector math
export class Vec3 {
  constructor(public x: number, public y: number, public z: number) {}

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s: number): Vec3 {
    return new Vec3(this.x * s, this.y * s, this.z * s);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  normalize(): Vec3 {
    const m = this.mag();
    return m > 0 ? this.scale(1 / m) : new Vec3(0, 0, 0);
  }

  /**
   * Returns a random unit vector perpendicular to this vector.
   * Uses normal distribution for spherical symmetry.
   */
  randomPerpendicular(): Vec3 {
    const thisMagSq = this.magSq();
    if (thisMagSq === 0) {
      return new Vec3(randNormal(), randNormal(), randNormal()).normalize();
    }

    for (let attempt = 0; attempt < 10; attempt++) {
      const v = new Vec3(randNormal(), randNormal(), randNormal());
      const projScale = v.dot(this) / thisMagSq;
      const proj = this.scale(projScale);
      const perp = v.sub(proj);
      const perpMag = perp.mag();

      if (perpMag > 0.01) {
        return perp.scale(1 / perpMag);
      }
    }

    // Fallback
    const ax = Math.abs(this.x);
    const ay = Math.abs(this.y);
    const az = Math.abs(this.z);

    let arbitrary: Vec3;
    if (ax <= ay && ax <= az) {
      arbitrary = new Vec3(1, 0, 0);
    } else if (ay <= az) {
      arbitrary = new Vec3(0, 1, 0);
    } else {
      arbitrary = new Vec3(0, 0, 1);
    }

    const projScale = arbitrary.dot(this) / thisMagSq;
    const perp = arbitrary.sub(this.scale(projScale));
    return perp.normalize();
  }
}

/**
 * 3x3 Matrix for rotations and transformations.
 * Stored in row-major order: [row0, row1, row2] where each row is [a, b, c]
 * 
 * | m[0] m[1] m[2] |
 * | m[3] m[4] m[5] |
 * | m[6] m[7] m[8] |
 */
export class Mat3 {
  // Row-major storage
  constructor(public m: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    if (m.length !== 9) {
      throw new Error('Mat3 requires exactly 9 elements');
    }
  }

  // Create identity matrix
  static identity(): Mat3 {
    return new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }

  // Create rotation matrix around X axis
  static rotationX(angle: number): Mat3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat3([
      1, 0, 0,
      0, c, -s,
      0, s, c
    ]);
  }

  // Create rotation matrix around Y axis
  static rotationY(angle: number): Mat3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat3([
      c, 0, s,
      0, 1, 0,
      -s, 0, c
    ]);
  }

  // Create rotation matrix around Z axis
  static rotationZ(angle: number): Mat3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat3([
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ]);
  }

  // Create rotation matrix around arbitrary axis (axis should be normalized)
  static rotationAxis(axis: Vec3, angle: number): Mat3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const { x, y, z } = axis;

    return new Mat3([
      t * x * x + c,     t * x * y - s * z, t * x * z + s * y,
      t * x * y + s * z, t * y * y + c,     t * y * z - s * x,
      t * x * z - s * y, t * y * z + s * x, t * z * z + c
    ]);
  }

  // Matrix-vector multiplication: M * v
  mulVec(v: Vec3): Vec3 {
    const m = this.m;
    return new Vec3(
      m[0] * v.x + m[1] * v.y + m[2] * v.z,
      m[3] * v.x + m[4] * v.y + m[5] * v.z,
      m[6] * v.x + m[7] * v.y + m[8] * v.z
    );
  }

  // Matrix-matrix multiplication: this * other
  mul(other: Mat3): Mat3 {
    const a = this.m;
    const b = other.m;
    return new Mat3([
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
    ]);
  }

  // Transpose
  transpose(): Mat3 {
    const m = this.m;
    return new Mat3([
      m[0], m[3], m[6],
      m[1], m[4], m[7],
      m[2], m[5], m[8]
    ]);
  }

  // Determinant
  det(): number {
    const m = this.m;
    return (
      m[0] * (m[4] * m[8] - m[5] * m[7]) -
      m[1] * (m[3] * m[8] - m[5] * m[6]) +
      m[2] * (m[3] * m[7] - m[4] * m[6])
    );
  }

  // Inverse (returns null if not invertible)
  inverse(): Mat3 | null {
    const d = this.det();
    if (Math.abs(d) < 1e-10) return null;

    const m = this.m;
    const invDet = 1 / d;

    return new Mat3([
      (m[4] * m[8] - m[5] * m[7]) * invDet,
      (m[2] * m[7] - m[1] * m[8]) * invDet,
      (m[1] * m[5] - m[2] * m[4]) * invDet,

      (m[5] * m[6] - m[3] * m[8]) * invDet,
      (m[0] * m[8] - m[2] * m[6]) * invDet,
      (m[2] * m[3] - m[0] * m[5]) * invDet,

      (m[3] * m[7] - m[4] * m[6]) * invDet,
      (m[1] * m[6] - m[0] * m[7]) * invDet,
      (m[0] * m[4] - m[1] * m[3]) * invDet
    ]);
  }
}

/**
 * Arcball camera controller.
 * Uses a modified arcball algorithm with tanh-based projection for smooth rotation.
 */
export class Arcball {
  private width: number;
  private height: number;
  private centerX: number;  // Screen X coordinate of rotation center
  private centerY: number;  // Screen Y coordinate of rotation center
  private rotationStrength: number;
  
  // Accumulated rotation matrix
  rotation: Mat3 = Mat3.identity();
  
  // Drag state
  private dragging = false;
  private lastVec: Vec3 | null = null;

  constructor(width: number, height: number, centerX?: number, centerY?: number, rotationStrength: number = 3.5) {
    this.width = width;
    this.height = height;
    this.centerX = centerX ?? width / 2;
    this.centerY = centerY ?? height / 2;
    this.rotationStrength = rotationStrength;
  }

  // Update dimensions and center (call on resize)
  setSize(width: number, height: number, centerX?: number, centerY?: number): void {
    this.width = width;
    this.height = height;
    this.centerX = centerX ?? width / 2;
    this.centerY = centerY ?? height / 2;
  }

  /**
   * Returns the arcball vector given a mouse position.
   * Uses modified projection with tanh for smooth rotation at edges.
   */
  private getArcballVec(mouseX: number, mouseY: number): Vec3 {
    // Offset from rotation center
    const x = mouseX - this.centerX;
    const y = mouseY - this.centerY;

    // Normalize to [-1, 1] range (radius sqrt(2) to contain whole screen)
    let xnorm = (2 * x) / this.width;
    let ynorm = (2 * y) / this.height;

    // Project onto circle of radius 1 using tanh
    const r = Math.sqrt(xnorm * xnorm + ynorm * ynorm);
    if (r > 0) {
      // rp goes from 0 to ~sqrt(1/2) as r goes from 0 to infinity
      const rp = Math.sqrt(0.5) * Math.tanh(this.rotationStrength * r);
      xnorm = (rp / r) * xnorm;
      ynorm = (rp / r) * ynorm;
    }

    // Project onto unit sphere
    const znorm = Math.sqrt(Math.max(0, 1 - xnorm * xnorm - ynorm * ynorm));
    return new Vec3(xnorm, ynorm, znorm);
  }

  // Call when mouse button is pressed
  startDrag(mouseX: number, mouseY: number): void {
    this.dragging = true;
    this.lastVec = this.getArcballVec(mouseX, mouseY);
  }

  // Call when mouse moves (while dragging)
  drag(mouseX: number, mouseY: number): void {
    if (!this.dragging || !this.lastVec) return;

    const currentVec = this.getArcballVec(mouseX, mouseY);

    // Rotation axis is the cross product
    const axis = this.lastVec.cross(currentVec);
    const axisMag = axis.mag();

    if (axisMag > 1e-6) {
      // Angle is the arccos of the dot product
      const dot = Math.max(-1, Math.min(1, this.lastVec.dot(currentVec)));
      const angle = -Math.acos(dot); // Negative to fix some coordinate system mismatches

      // Create incremental rotation and accumulate
      const normalizedAxis = axis.scale(1 / axisMag);
      const incrementalRotation = Mat3.rotationAxis(normalizedAxis, angle);
      this.rotation = incrementalRotation.mul(this.rotation);
    }

    this.lastVec = currentVec;
  }

  // Call when mouse button is released
  endDrag(): void {
    this.dragging = false;
    this.lastVec = null;
  }

  // Check if currently dragging
  isDragging(): boolean {
    return this.dragging;
  }

  // Reset rotation to identity
  reset(): void {
    this.rotation = Mat3.identity();
  }
}
