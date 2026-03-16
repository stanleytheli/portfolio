import { GravitySimulation } from './gravity';
import { Mat3, Vec3 } from './math';

export class SimulationRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  sim: GravitySimulation; // Public so we can swap simulations
  z0: number; // Reference z for projection (public so UI can modify)
  cameraRotation: Mat3 = Mat3.identity(); // Camera rotation matrix
  cameraCenter: Vec3 = new Vec3(0, 0, 500); // Point to rotate around (star position)

  constructor(canvas: HTMLCanvasElement, sim: GravitySimulation, z0: number = 400) {
    this.canvas = canvas;
    this.sim = sim;
    this.ctx = canvas.getContext('2d')!;
    this.z0 = z0;
  }

  // Project 3D coordinates to 2D using simple perspective: scale = z0 / z
  private project(
    x: number,
    y: number,
    z: number,
    radius: number
  ): { screenX: number; screenY: number; screenRadius: number; scale: number } | null {
    // Don't render if behind camera
    if (z <= 1) return null;

    const scale = this.z0 / z;
    // On mobile (width <= 640), center the star in top half; on desktop, position 1/3 from left
    const isMobile = this.canvas.width <= 640;
    const cx = isMobile ? this.canvas.width / 2 : this.canvas.width / 3;
    const cy = isMobile ? this.canvas.height / 4 : this.canvas.height / 2;

    // x, y are relative to center; scale them by perspective
    const screenX = cx + x * scale;
    const screenY = cy + y * scale;
    const screenRadius = radius * scale;

    return { screenX, screenY, screenRadius, scale };
  }

  // Apply camera rotation to a position (relative to camera center)
  private transformPosition(pos: Vec3): Vec3 {
    // Translate to camera center, rotate, translate back
    const relative = pos.sub(this.cameraCenter);
    const rotated = this.cameraRotation.mulVec(relative);
    return rotated.add(this.cameraCenter);
  }

  render(): void {
    const { ctx, canvas, sim } = this;

    // Clear to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Transform all bodies by camera rotation and sort by z
    const transformedBodies = sim.bodies.map(body => ({
      body,
      transformed: this.transformPosition(body.pos)
    }));
    transformedBodies.sort((a, b) => b.transformed.z - a.transformed.z);

    // Draw bodies
    for (const { body, transformed } of transformedBodies) {
      const projected = this.project(
        transformed.x,
        transformed.y,
        transformed.z,
        body.radius
      );

      if (!projected) continue;

      const { screenX, screenY, screenRadius } = projected;

      // If this is a star (immovable), draw a glow around it
      if (!body.canMove) {
        // Outer faint glow
        const glowRadius = screenRadius * 4;
        const gradient = ctx.createRadialGradient(
          screenX, screenY, screenRadius * 0.8,
          screenX, screenY, glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(screenX, screenY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw white circle (the body itself)
      ctx.beginPath();
      ctx.arc(screenX, screenY, Math.max(screenRadius, 0.5), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }
}
