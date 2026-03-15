// 3D Vector math for physics
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

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
}

// A celestial body with mass, position, velocity in 3D
export interface Body {
  pos: Vec3;
  vel: Vec3;
  acc: Vec3;
  mass: number;
  radius: number;
  canMove: boolean;
}

export class GravitySimulation {
  bodies: Body[] = [];
  G: number = 1.0; // Gravitational constant
  softening: number = 20; // Prevents singularities

  createBody(
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number,
    mass: number,
    canMove: boolean = true,
    radiusOverride: number | null = null,
  ): Body {
    const body: Body = {
      pos: new Vec3(x, y, z),
      vel: new Vec3(vx, vy, vz),
      acc: new Vec3(0, 0, 0),
      mass,
      radius: radiusOverride ?? Math.cbrt(mass) * 1.5,
      canMove: canMove,
    };
    this.bodies.push(body);
    return body;
  }

  // Calculate gravitational acceleration for all bodies (O(n²))
  computeAccelerations(): void {
    // Reset accelerations
    for (const body of this.bodies) {
      body.acc = new Vec3(0, 0, 0);
    }

    // Pairwise gravitational forces
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const a = this.bodies[i];
        const b = this.bodies[j];

        const delta = b.pos.sub(a.pos);
        const distSq = delta.magSq() + this.softening * this.softening;
        const dist = Math.sqrt(distSq);

        // F = G * m1 * m2 / r²
        // a = F / m = G * m_other / r²
        const forceMag = this.G / distSq;
        const forceDir = delta.scale(1 / dist);

        // Newton's 3rd law: equal and opposite
        a.acc = a.acc.add(forceDir.scale(forceMag * b.mass));
        b.acc = b.acc.add(forceDir.scale(-forceMag * a.mass));
      }
    }
  }

  // Velocity Verlet integration
  step(dt: number): void {
    // Update positions: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
    for (const body of this.bodies) {
      if (body.canMove) {
        body.pos = body.pos
          .add(body.vel.scale(dt))
          .add(body.acc.scale(0.5 * dt * dt));
      }
    }

    // Store old accelerations
    const oldAccs = this.bodies.map((b) => b.acc);

    // Compute new accelerations at new positions
    this.computeAccelerations();

    // Update velocities: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i];
      const avgAcc = oldAccs[i].add(body.acc).scale(0.5);
      body.vel = body.vel.add(avgAcc.scale(dt));
    }
  }
}
