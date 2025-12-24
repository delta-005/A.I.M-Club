
import React, { useMemo, FC } from 'react';
import { Theme } from '../types';

interface FloatingShapesProps {
    theme: Theme;
}

const FloatingShapes: FC<FloatingShapesProps> = ({ theme }) => {
    const shapes = useMemo(() => {
        const shapeConfig = [
            { count: 3, type: 'line', size: [100, 200], duration: [40, 60] },
            { count: 3, type: 'circle', size: [150, 250], duration: [50, 70] },
            { count: 12, type: 'particle', size: [2, 5], duration: [10, 20] },
        ];

        return shapeConfig.flatMap(({ count, type, size, duration }) => 
            Array.from({ length: count }, (_, i) => {
                const sz = Math.random() * (size[1] - size[0]) + size[0];
                return {
                    id: `${type}-${i}`,
                    type,
                    style: {
                        width: `${type === 'line' ? 1 : sz}px`,
                        height: `${sz}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationName: type === 'particle' ? 'twinkle-soft' : 'float-subtle',
                        animationDuration: `${Math.random() * (duration[1] - duration[0]) + duration[0]}s`,
                        animationDelay: `${Math.random() * -duration[1]}s`,
                    }
                };
            })
        );
    }, []);

    const getShapeElement = (shape: any) => {
        const baseClasses = 'absolute bg-neon-blue dark:bg-neon-blue animate-float-subtle';
        const lightModeClasses = 'bg-gray-200 dark:bg-neon-blue';

        switch (shape.type) {
            case 'line':
                return <div style={shape.style} className={`${baseClasses} ${lightModeClasses} opacity-[0.03] dark:opacity-[0.05]`}></div>;
            case 'circle':
                return <div style={shape.style} className={`${baseClasses} ${lightModeClasses} opacity-[0.02] dark:opacity-[0.03] rounded-full`}></div>;
            case 'particle':
                return <div style={shape.style} className={`${baseClasses} ${lightModeClasses} rounded-full animate-twinkle-soft opacity-[0.08] dark:opacity-[0.15]`}></div>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full -z-5 pointer-events-none overflow-hidden">
            {shapes.map(shape => (
                <React.Fragment key={shape.id}>
                    {getShapeElement(shape)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default FloatingShapes;
