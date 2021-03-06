var theWorm = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        angleA = null,
        angleB = null,
        speedA = null,
        speedB = null,
        headColor = null,
        headSize = null,
        tailColor = null,
        tailSize = null,
        bodyColor = null,
        bodyStrokeWidth = null,
        distMin = null,
        distMax = null,
        run  = 'head';

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        retinaDimensions(container);
        config(spinner);

        particles = spinners.particleFactory(2, width, height, arcRadius, 0, false, null, null, null);

        clearCanvas();
    }

    function retinaDimensions (container) {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
        ratio = devicePixelRatio / backingStoreRatio;
        width = canvas.width = container.offsetWidth * ratio;
        height = canvas.height = container.offsetHeight * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
    }

    function config (spinner) {
        arcRadius = spinner.arcRadius ? spinner.arcRadius : 20;
        angleA = spinner.angleA ? spinner.angleA : 0;
        angleB = spinner.angleB ? spinner.angleB : 1;
        speedA = spinner.speedA ? spinner.speedA : 0.15;
        speedB = spinner.speedB ? spinner.speedB : 0.06;
        headColor = spinner.headColor ? spinner.headColor : '#4b4b4b';
        headSize = spinner.headSize ? spinner.headSize : 2;
        tailColor = spinner.tailColor ? spinner.tailColor : '#4b4b4b';
        tailSize = spinner.tailSize ? spinner.tailSize : 1;
        bodyColor = spinner.bodyColor ? spinner.bodyColor : '#4b4b4b';
        bodyStrokeWidth = spinner.bodyStrokeWidth ? spinner.bodyStrokeWidth : 1;
        distMin = spinner.distMin ? spinner.distMin : 1;
        distMax = spinner.distMax ? spinner.distMax : 4;
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, angleA, angleB, false);
        context.lineWidth = bodyStrokeWidth;
        context.strokeStyle = bodyColor;
        context.stroke();

        for (var i = 0; i < particles.length; i++) {

            // TAIL
            context.beginPath();
            context.arc(particles[0].x = width / 2 + Math.cos(angleA) * arcRadius, particles[i].y = height / 2 + Math.sin(angleA) * arcRadius, tailSize, 0, Math.PI * 2, false);
            context.fillStyle = tailColor;
            context.fill();

            // HEAD
            context.beginPath();
            context.arc(particles[1].x = width / 2 + Math.cos(angleB) * arcRadius, particles[1].y = height / 2 + Math.sin(angleB) * arcRadius, headSize, 0, Math.PI * 2, false);
            context.fillStyle = headColor;
            context.fill();
        }

        var dist = angleB - angleA;
        if (run === 'tail') {
            angleA += speedA;
            angleB += speedB;
            if (dist <  distMin) {
                run = 'head';
            }
        } else if (run === 'head') {
            angleA += speedB;
            angleB += speedA;
            if (dist > distMax) {
                run = 'tail';
            }
        }

        context.restore();
    }
    return {
        init : init
    }
})();