import { Vec3 } from './math';
import { randUniform, randNormal, randLognormal } from './utils';

// Re-export Vec3 for convenience
export { Vec3 } from './math';

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
  
  // Star configuration
  readonly starMass = 5000;
  readonly starZ = 500;
  readonly starRadius = 15;

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

  // Reset simulation with n orbiting bodies
  reset(n: number): void {
    this.bodies = [];

    // Central massive body (star)
    this.createBody(0, 0, this.starZ, 0, 0, 0, this.starMass, false, this.starRadius);

    // Spawn orbiting bodies
    const orbitalPlane = new Vec3(1, -1, -1).normalize();

    for (let i = 0; i < n; i++) {
      const rHat = orbitalPlane.randomPerpendicular();
      const r = randUniform(150, 400);

      const vHat = orbitalPlane.cross(rHat);
      const v = Math.sqrt((this.G * this.starMass) / r) * randNormal(1.0, 0.05);

      const xf = r * rHat.x;
      const yf = r * rHat.y;
      const zf = this.starZ + r * rHat.z;

      const vxf = v * vHat.x;
      const vyf = v * vHat.y;
      const vzf = v * vHat.z;

      // Add some noise to the position and velocity
      const x = xf + randNormal(0, 0.1 * r);
      const y = yf + randNormal(0, 0.1 * r);
      const z = zf + randNormal(0, 0.1 * r);
      const vx = vxf + randNormal(0, 0.1 * v);
      const vy = vyf + randNormal(0, 0.1 * v);
      const vz = vzf + randNormal(0, 0.1 * v);

      const mass = randLognormal(2.5, 0.7);
      this.createBody(x, y, z, vx, vy, vz, mass);
    }
  }

  // Get star position for camera centering
  getStarPosition(): Vec3 {
    return new Vec3(0, 0, this.starZ);
  }
}
