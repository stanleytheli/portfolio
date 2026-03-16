import { GravitySimulation } from './gravity';

export class SimulationRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  sim: GravitySimulation; // Public so we can swap simulations
  z0: number; // Reference z for projection (public so UI can modify)

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
    // On mobile (width <= 640), center the star; on desktop, position 1/3 from left
    const isMobile = this.canvas.width <= 640;
    const cx = isMobile ? this.canvas.width / 2 : this.canvas.width / 3;
    const cy = this.canvas.height / 2;

    // x, y are relative to center; scale them by perspective
    const screenX = cx + x * scale;
    const screenY = cy + y * scale;
    const screenRadius = radius * scale;

    return { screenX, screenY, screenRadius, scale };
  }

  render(): void {
    const { ctx, canvas, sim } = this;

    // Clear to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sort bodies by z (far to near) for proper depth ordering
    const sortedBodies = [...sim.bodies].sort((a, b) => b.pos.z - a.pos.z);

    // Draw bodies
    for (const body of sortedBodies) {
      const projected = this.project(
        body.pos.x,
        body.pos.y,
        body.pos.z,
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
