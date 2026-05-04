import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
}

interface SphereNode {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  connections: number[];
}

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sphereCanvas', { static: true }) sphereCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bgCanvas', { static: true }) bgCanvasRef!: ElementRef<HTMLCanvasElement>;
  
  private sphereCtx!: CanvasRenderingContext2D;
  private bgCtx!: CanvasRenderingContext2D;
  private animationId!: number;
  private sphereNodes: SphereNode[] = [];
  private particles: Particle[] = [];
  private rotation = { x: 0, y: 0 };
  private targetRotation = { x: 0, y: 0 };
  private mouseX = 0;
  private mouseY = 0;
  private sphereRadius = 200;
  private centerX = 0;
  private centerY = 0;
  
  isDarkMode = true;
  
  // Stats
  studentsCount = 0;
  coursesCount = 0;
  certificatesCount = 0;
  
  private targetStudents = 15725;
  private targetCourses = 250;
  private targetCertificates = 8500;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngAfterViewInit(): void {
    this.initCanvases();
    this.createSphereNodes();
    this.animate();
    this.animateCounters();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initCanvases();
    this.createSphereNodes();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.sphereCanvasRef.nativeElement.getBoundingClientRect();
    this.mouseX = (event.clientX - rect.left - rect.width / 2) / rect.width;
    this.mouseY = (event.clientY - rect.top - rect.height / 2) / rect.height;
    
    // Update target rotation based on mouse
    this.targetRotation.y = this.mouseX * 0.5;
    this.targetRotation.x = this.mouseY * 0.3;
  }

  private initCanvases(): void {
    // Sphere Canvas
    const sphereCanvas = this.sphereCanvasRef.nativeElement;
    const sphereContainer = sphereCanvas.parentElement;
    if (sphereContainer) {
      sphereCanvas.width = sphereContainer.clientWidth;
      sphereCanvas.height = sphereContainer.clientHeight;
      this.centerX = sphereCanvas.width / 2;
      this.centerY = sphereCanvas.height / 2;
      this.sphereRadius = Math.min(sphereCanvas.width, sphereCanvas.height) * 0.35;
    }
    this.sphereCtx = sphereCanvas.getContext('2d')!;

    // Background Canvas
    const bgCanvas = this.bgCanvasRef.nativeElement;
    const bgContainer = bgCanvas.parentElement;
    if (bgContainer) {
      bgCanvas.width = bgContainer.clientWidth;
      bgCanvas.height = bgContainer.clientHeight;
    }
    this.bgCtx = bgCanvas.getContext('2d')!;
  }

  private createSphereNodes(): void {
    this.sphereNodes = [];
    const nodeCount = 80;
    
    // Create nodes on sphere surface using fibonacci sphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < nodeCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      
      const x = this.sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = this.sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = this.sphereRadius * Math.cos(phi);
      
      this.sphereNodes.push({
        x, y, z,
        origX: x,
        origY: y,
        origZ: z,
        connections: []
      });
    }

    // Create connections between nearby nodes
    this.sphereNodes.forEach((node, i) => {
      this.sphereNodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(node.origX - other.origX, 2) +
            Math.pow(node.origY - other.origY, 2) +
            Math.pow(node.origZ - other.origZ, 2)
          );
          if (dist < this.sphereRadius * 0.6 && node.connections.length < 4) {
            node.connections.push(j);
          }
        }
      });
    });
  }

  private animate = (): void => {
    this.drawBackground();
    this.drawSphere();
    this.updateParticles();
    
    // Auto rotation + mouse influence
    this.rotation.y += 0.003;
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.05;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.02;
    
    // Spawn particles
    if (Math.random() < 0.1) {
      this.spawnParticle();
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  private drawBackground(): void {
    const ctx = this.bgCtx;
    const canvas = this.bgCanvasRef.nativeElement;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    ctx.strokeStyle = this.isDarkMode ? 'rgba(59, 130, 246, 0.03)' : 'rgba(59, 130, 246, 0.05)';
    ctx.lineWidth = 1;
    
    const gridSize = 60;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  private drawSphere(): void {
    const ctx = this.sphereCtx;
    const canvas = this.sphereCanvasRef.nativeElement;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Rotate nodes
    const rotatedNodes = this.sphereNodes.map(node => {
      let x = node.origX;
      let y = node.origY;
      let z = node.origZ;
      
      // Rotate around Y axis
      const cosY = Math.cos(this.rotation.y);
      const sinY = Math.sin(this.rotation.y);
      const tempX = x * cosY - z * sinY;
      const tempZ = x * sinY + z * cosY;
      x = tempX;
      z = tempZ;
      
      // Rotate around X axis
      const cosX = Math.cos(this.rotation.x);
      const sinX = Math.sin(this.rotation.x);
      const tempY = y * cosX - z * sinX;
      z = y * sinX + z * cosX;
      y = tempY;
      
      return { ...node, x, y, z };
    });

    // Sort by z for proper rendering
    const sortedIndices = rotatedNodes
      .map((node, i) => ({ i, z: node.z }))
      .sort((a, b) => a.z - b.z)
      .map(item => item.i);

    // Draw sphere glow
    const glowGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.sphereRadius * 1.5
    );
    
    if (this.isDarkMode) {
      glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      glowGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
      glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    } else {
      glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      glowGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
      glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    }
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.sphereRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw sphere outline (glass effect)
    const sphereGradient = ctx.createRadialGradient(
      this.centerX - this.sphereRadius * 0.3,
      this.centerY - this.sphereRadius * 0.3,
      0,
      this.centerX,
      this.centerY,
      this.sphereRadius
    );
    
    if (this.isDarkMode) {
      sphereGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      sphereGradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.02)');
      sphereGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    } else {
      sphereGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      sphereGradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.03)');
      sphereGradient.addColorStop(1, 'rgba(59, 130, 246, 0.08)');
    }
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.sphereRadius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGradient;
    ctx.fill();
    
    // Sphere border
    ctx.strokeStyle = this.isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw connections
    sortedIndices.forEach(i => {
      const node = rotatedNodes[i];
      const screenX = this.centerX + node.x;
      const screenY = this.centerY + node.y;
      const depth = (node.z + this.sphereRadius) / (this.sphereRadius * 2);
      
      node.connections.forEach(j => {
        const other = rotatedNodes[j];
        const otherScreenX = this.centerX + other.x;
        const otherScreenY = this.centerY + other.y;
        const otherDepth = (other.z + this.sphereRadius) / (this.sphereRadius * 2);
        const avgDepth = (depth + otherDepth) / 2;
        
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(otherScreenX, otherScreenY);
        ctx.strokeStyle = this.isDarkMode 
          ? `rgba(59, 130, 246, ${avgDepth * 0.4})` 
          : `rgba(59, 130, 246, ${avgDepth * 0.5})`;
        ctx.lineWidth = avgDepth * 2;
        ctx.stroke();
      });
    });

    // Draw nodes
    sortedIndices.forEach(i => {
      const node = rotatedNodes[i];
      const screenX = this.centerX + node.x;
      const screenY = this.centerY + node.y;
      const depth = (node.z + this.sphereRadius) / (this.sphereRadius * 2);
      const size = 2 + depth * 4;
      
      // Node glow
      const nodeGlow = ctx.createRadialGradient(
        screenX, screenY, 0,
        screenX, screenY, size * 3
      );
      nodeGlow.addColorStop(0, `rgba(59, 130, 246, ${depth * 0.8})`);
      nodeGlow.addColorStop(0.5, `rgba(59, 130, 246, ${depth * 0.2})`);
      nodeGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = nodeGlow;
      ctx.fill();
      
      // Node core
      ctx.beginPath();
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
      ctx.fillStyle = this.isDarkMode 
        ? `rgba(255, 255, 255, ${0.5 + depth * 0.5})` 
        : `rgba(59, 130, 246, ${0.5 + depth * 0.5})`;
      ctx.fill();
    });

    // Draw particles
    this.particles.forEach(p => {
      const screenX = this.centerX + p.x;
      const screenY = this.centerY + p.y;
      const alpha = p.life / p.maxLife;
      
      const particleGlow = ctx.createRadialGradient(
        screenX, screenY, 0,
        screenX, screenY, p.size * 2
      );
      particleGlow.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
      particleGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = particleGlow;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    // Light reflection (top-left)
    const reflectionGradient = ctx.createRadialGradient(
      this.centerX - this.sphereRadius * 0.5,
      this.centerY - this.sphereRadius * 0.5,
      0,
      this.centerX - this.sphereRadius * 0.5,
      this.centerY - this.sphereRadius * 0.5,
      this.sphereRadius * 0.4
    );
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(
      this.centerX - this.sphereRadius * 0.5,
      this.centerY - this.sphereRadius * 0.5,
      this.sphereRadius * 0.4,
      0, Math.PI * 2
    );
    ctx.fillStyle = reflectionGradient;
    ctx.fill();
  }

  private spawnParticle(): void {
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI;
    
    const x = this.sphereRadius * Math.cos(elevation) * Math.cos(angle);
    const y = this.sphereRadius * Math.cos(elevation) * Math.sin(angle);
    const z = this.sphereRadius * Math.sin(elevation);
    
    this.particles.push({
      x, y, z,
      vx: (x / this.sphereRadius) * 2,
      vy: (y / this.sphereRadius) * 2,
      vz: (z / this.sphereRadius) * 2,
      life: 60,
      maxLife: 60,
      size: 1 + Math.random() * 2
    });
  }

  private updateParticles(): void {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.life--;
      return p.life > 0;
    });
  }

  private animateCounters(): void {
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.studentsCount = Math.floor(this.targetStudents * easeOut);
      this.coursesCount = Math.floor(this.targetCourses * easeOut);
      this.certificatesCount = Math.floor(this.targetCertificates * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    setTimeout(animate, 800);
  }



  
}