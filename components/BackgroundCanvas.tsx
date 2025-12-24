
import React, { useRef, useEffect, FC } from 'react';
import { Theme } from '../types';

interface BackgroundCanvasProps {
    theme: Theme;
}

const BackgroundCanvas: FC<BackgroundCanvasProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        const colors = {
            dark: {
                background: '#0D1117',
                // Increased to ~10% for particles and ~5% for lines for better visibility
                particles: 'rgba(0, 191, 255, 0.12)', 
                lines: 'rgba(0, 191, 255, 0.06)',    
            },
            light: {
                background: '#FFFFFF',
                particles: 'rgba(0, 120, 255, 0.08)', 
                lines: 'rgba(0, 120, 255, 0.04)',    
            }
        };
        const currentColors = colors[theme];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const mouse = {
            x: -1000,
            y: -1000,
            radius: 180
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        const handleMouseOut = () => {
             mouse.x = -1000;
             mouse.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        let particlesArray: Particle[] = [];
        // Moderate density for a professional yet dynamic look
        const numberOfParticles = (canvas.height * canvas.width) / 14000;

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas!.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas!.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5; // Slightly larger for better visibility
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                // Gentle drift
                let directionX = (Math.random() * 0.12) - 0.06;
                let directionY = (Math.random() * 0.12) - 0.06;
                particlesArray.push(new Particle(x, y, directionX, directionY, size, currentColors.particles));
            }
        }

        const connect = () => {
            if (!ctx) return;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas!.width / 7) * (canvas!.height / 7)) {
                        let opacityValue = (1 - (distance / 40000));
                        ctx.strokeStyle = theme === 'dark' 
                            ? `rgba(0, 191, 255, ${opacityValue * 0.06})` 
                            : `rgba(0, 120, 255, ${opacityValue * 0.04})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            ctx.fillStyle = currentColors.background;
            ctx.fillRect(0,0,innerWidth, innerHeight);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
            
            // Mouse interaction - elegant glow hint
            if (mouse.x > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
                gradient.addColorStop(0, theme === 'dark' ? 'rgba(0, 191, 255, 0.06)' : 'rgba(0, 120, 255, 0.04)');
                gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };

        init();
        animate();

        const handleResize = () => {
             canvas.width = window.innerWidth;
             canvas.height = window.innerHeight;
             init();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

export default BackgroundCanvas;
