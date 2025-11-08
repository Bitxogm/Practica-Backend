// Script para gestionar la animación de las cartas apiladas 3D
document.addEventListener('DOMContentLoaded', () => {
    const stackContainer = document.querySelector('.stack-container');
    if (!stackContainer) {
        // No encontramos el contenedor, salimos para evitar errores.
        console.error("Stack container not found. 404 animation script aborted.");
        return;
    }

    const cardContainers = document.querySelectorAll('.card-container');
    const cards = document.querySelectorAll('.perspec');

    const ANGLE_RANGE = 25; // Rango de rotación en grados
    const SHIFT_RANGE = 25; // Rango de desplazamiento en píxeles

    // Función para mapear un valor de un rango a otro (útil para el movimiento)
    function mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    // Movimiento de las cartas al mover el ratón
    stackContainer.addEventListener('mousemove', (e) => {
        // Obtenemos el centro del contenedor
        const rect = stackContainer.getBoundingClientRect();
        const center_x = rect.left + rect.width / 2;
        const center_y = rect.top + rect.height / 2;

        // Calculamos la posición relativa del ratón (-1 a 1)
        const pos_x = mapRange(e.clientX, rect.left, rect.right, -1, 1);
        const pos_y = mapRange(e.clientY, rect.top, rect.bottom, -1, 1);

        // Invertimos el eje Y para que parezca que la pila se "inclina" hacia el ratón
        const rot_y = mapRange(pos_x, -1, 1, -ANGLE_RANGE, ANGLE_RANGE);
        const rot_x = mapRange(pos_y, -1, 1, ANGLE_RANGE, -ANGLE_RANGE);

        // Aplicamos la rotación a la pila completa (card-container)
        cardContainers.forEach(container => {
            container.style.transform = `rotateX(${rot_x}deg) rotateY(${rot_y}deg)`;
        });

        // Desplazamiento sutil de la carta de arriba
        const frontCard = cards[cards.length - 1]; // La última carta es la frontal
        if (frontCard) {
            const shift_x = mapRange(pos_x, -1, 1, -SHIFT_RANGE, SHIFT_RANGE);
            const shift_y = mapRange(pos_y, -1, 1, -SHIFT_RANGE, SHIFT_RANGE);

            // Reconstruimos el transform con el desplazamiento aplicado
            const currentZ = frontCard.style.getPropertyValue('--vertdist').replace('px', '');
            const currentSpread = frontCard.style.getPropertyValue('--spreaddist').replace('px', '');
            const currentScale = frontCard.style.getPropertyValue('--scaledist');

            frontCard.style.transform = `translateZ(${currentZ}px) translateY(${currentSpread}px) scale(${currentScale}) translateX(${shift_x}px) translateY(${shift_y}px)`;
        }
    });

    // Resetear la rotación al salir del contenedor
    stackContainer.addEventListener('mouseleave', () => {
        cardContainers.forEach(container => {
            container.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
        
        // Resetear el desplazamiento de la carta frontal
        const frontCard = cards[cards.length - 1];
        if (frontCard) {
            const currentZ = frontCard.style.getPropertyValue('--vertdist').replace('px', '');
            const currentSpread = frontCard.style.getPropertyValue('--spreaddist').replace('px', '');
            const currentScale = frontCard.style.getPropertyValue('--scaledist');
            frontCard.style.transform = `translateZ(${currentZ}px) translateY(${currentSpread}px) scale(${currentScale})`;
        }
    });
});