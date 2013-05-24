 var world;
            var ctx;
            var canvasWidth;
            var canvasHeight;
            
            // Función que crea el mundo.
            function createWorld() {
                // Caja que define las coordenadas límite
                // Es preferible pasarnos antes que quedarnos cortos
                var worldAABB = new b2AABB();
                worldAABB.minVertex.Set(-1000, -1000);
                worldAABB.maxVertex.Set(1000, 1000);
 
                // Definimos el vector gravitacional. Y efectivamente,
                // puede ser una gravedad lateral :)
                var gravity = new b2Vec2(0, 300);
                
                // También indicamos que los elementos pueden "dormir"
                // cuando estén en reposo.
                var doSleep = true;
                
                // Y ya podemos creamos el mundo
                world = new b2World(worldAABB, gravity, doSleep);
                
                // Ahora llamamos a createGround, y nos creará un suelo
                createGround(world);
                
                // Finalmente, devolvemos el mundo
                return world;
            }
            
            // Añade un suelo al mundo
            function createGround(world) {
                // Definimos una forma. En este caso es una forma cuadrada
                var groundSd = new b2BoxDef();
                
                // Establecemos un tamaño de 400x30
                groundSd.extents.Set(400, 30);
                
                // Y le ponemos un factor de restitución (elasticidad) mínimo.
                groundSd.restitution = 0.0;
                
                // Ahora creamos el objeto en sí
                var groundBd = new b2BodyDef();
                
                // Añadimos la forma del objeto
                groundBd.AddShape(groundSd);
                
                // Asignamos sus coordeanadas
                groundBd.position.Set(400, 270);
                
                // Y añadimos el objeto al mundo
                return world.CreateBody(groundBd);
            }
 
            /* Dibuja el mundo
             *
             * @param {b2World} objeto mundo
             * @param {Context} contexto 2d del canvas
             */
            function drawWorld(world, context) {
                // Recorremos cada objeto
                for (var b = world.m_bodyList; b; b = b.m_next) {
                    // Por cada objeto, recorremos las formas adjuntas
                    for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                        // Y finalmente, dibujamos la forma en el canvas
                        drawShape(s, context);
                    }
                }
            }
 
            /* Dibuja el mundo
             *
             * @param {b2ShapeDef} forma que vamos a dibujar
             * @param {Context} contexto 2d del canvas
             */  
            function drawShape(shape, context) {
                // Color blanco para las líneas
                context.strokeStyle = '#ffffff';
                
                // Color negro de relleno
                context.fillStyle = "black";
                
                // Indicamos que vamos a comenzar a dibujar
                context.beginPath();
                
                // ¿Qué forma vamos a dibujar?
                switch (shape.m_type) {
                    // Un círculo
                    case b2Shape.e_circleShape:
                        {
                            var circle = shape;
                            
                            // Obtenemos las coordenadas
                            var pos = circle.m_position;
                            
                            // Y el radio
                            var r = circle.m_radius;
                            
                            // Asignamos el número de segmentos que definirán al círculo
                            var segments = 16.0;
                            
                            // Factor theta, para calcular el vector de cada segmento
                            var theta = 0.0;
                            
                            // Factor dtheta, define la diferencia entre cada segmento
                            var dtheta = 2.0 * Math.PI / segments;
     
                            // Colocamos el "cursor" en las coordenadas del círculo
                            context.moveTo(pos.x + r, pos.y);
                            
                            // Y dibujamos cada segmento
                            for (var i = 0; i <= segments; i++) {
                                // Calculamos el vector que define el segmento
                                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                                
                                // Lo colocamos en sus coordenadas
                                var v = b2Math.AddVV(pos, d);
                                
                                // Dibujamos la línea en el lienzo
                                context.lineTo(v.x, v.y);
                                
                                // E incrementamos el factor theta
                                theta += dtheta;
                            }
     
                            // dibujamos un radio, para visualizar el giro
                            // Nos colocamos en el centro del círculo
                            context.moveTo(pos.x, pos.y);
                            var ax = circle.m_R.col1;
                            
                            // Calculamos el vector
                            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                            
                            // Y lo dibujamos
                            context.lineTo(pos2.x, pos2.y);
                        }
                        break;
                    // Un polígono
                    case b2Shape.e_polyShape:
                        {
                            var poly = shape;
                            
                            // Nos colocamos en el primer vértice
                            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                            context.moveTo(tV.x, tV.y);
                            
                            // Recorremos el resto
                            for (var i = 0; i < poly.m_vertexCount; i++) {
                                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                                
                                // Y dibujamos líneas a cada siguiente vértice
                                context.lineTo(v.x, v.y);
                            }
                            
                            // Finalmente cerramos el polígono
                            context.lineTo(tV.x, tV.y);
                        }
                        break;
                }
                
                // Por último, aplicamos la línea y el relleno de la forma que acabamos de dibujar
                context.fill();
                context.stroke();
            }
            
            /* Añade un círculo al mundo
             *
             * @param {b2World} objeto mundo
             * @param {Integer} coordenada x
             * @param {Integer} coordenada y
             */
            function createBall(world, x, y) {
                // Creamos una forma de tipo círculo
                var ballSd = new b2CircleDef();
                
                // Establecemos una densidad de 1.0
                ballSd.density = 1.0;
                
                // Un radio de 20 unidades
                ballSd.radius = 20;
                
                // Un factor de elasticidad de 0.5
                ballSd.restitution = 0.5;
                
                // Y una fricción de 0.5
                ballSd.friction = 0.5;
                
                // Creamos un nuevo objeto
                var ballBd = new b2BodyDef();
                
                // Le añadimos la forma círculo
                ballBd.AddShape(ballSd);
                
                // Establecemos su posición en el mundo
                ballBd.position.Set(x,y);
                
                // Y lo añadimos al mundo
                return world.CreateBody(ballBd);
            }
 
            // Crea los objetos que dibujan el mensaje "Hola Mundo!"
            function createHelloWorld() {
                // H
                createBox(world, 50, 220, 10, 20, false);
                createBox(world, 90, 220, 10, 20, false);
                createBox(world, 70, 195, 30, 5, false);
                createBox(world, 50, 170, 10, 20, false);
                createBox(world, 90, 170, 10, 20, false);
    
                // O
                createBox(world, 140, 235, 20, 5, false);
                createBox(world, 155, 205, 5, 25, false);
                createBox(world, 125, 205, 5, 25, false);
                createBox(world, 140, 175, 20, 5, false);
     
                // L
                createBox(world, 200, 235, 20, 5, false);
                createBox(world, 185, 200, 5, 30, false);
     
                // A
                createBox(world, 240, 210, 5, 30, false);
                createBox(world, 278, 225, 5, 15, false);
                createBox(world, 265, 205, 20, 5, false);
                createBox(world, 280, 190, 5, 10, false);
                createBox(world, 260, 175, 25, 5, false);
            }
 
            /* Añade una caja al mundo
             *
             * @param {b2World} objeto mundo
             * @param {Integer} posición x
             * @param {Integer} posición y
             * @param {Integer} anchura
             * @param {Integer} altura
             * @param {Boolean} posición fija o no
             */
            function createBox(world, x, y, width, height, fixed) {
                // Si no se especifica, lo ponemos con posición fija
                if (typeof(fixed) == 'undefined') fixed = true;
                
                // Creamos la forma
                var boxSd = new b2BoxDef();
                
                // Si no tiene posición fija, establecemos su densidad
                if (!fixed) boxSd.density = 1.0; 
                
                // Ponemos un factor 0.0 de restitution (elasticidad)
                boxSd.restitution = 0.0;
                
                // Y un factor 1.0 de fricción
                boxSd.friction = 1.0;
                
                // Especificamos su tamaño
                boxSd.extents.Set(width, height);
                
                // Creamos el cuerpo
                var boxBd = new b2BodyDef();
                
                // Asignamos la forma que tendrá
                boxBd.AddShape(boxSd);
                
                // Colocamos sus coordenadas
                boxBd.position.Set(x,y);
                
                // Finalmente lo añadimos al mundo
                return world.CreateBody(boxBd);
            }
 
            function step(cnt) {
                // Asignamos los frames per second, a 60Hz. En cada instante
                // se simula la ecuación física que le corresponde.
                var timeStep = 1.0/60;
                
                // Número de iteraciones por instante. Cuanto más bajo sea el valor
                // más precisión, y también más consumo de recursos.
                var iteration = 1;
                
                // Avanzamos un paso en la simulación física
                world.Step(timeStep, iteration);
                
                // Limpiamos el canvas al completo
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                
                // Dibujamos el mundo
                drawWorld(world, ctx);
                
                // Realizamos una nueva llamada a esta función, cada 10 milisegundos
                setTimeout('step(' + (cnt || 0) + ')', 10);
            }
 
            // Punto de entrada principal. Cuando se cargue la ventana:
            Event.observe(window, 'load', function() {
                // En primer lugar creamos el mundo   
                world = createWorld();
            
                // Un canvas HTML tiene varios métodos de renderizado. Nosotros
                // usaremos el de 2D, de modo que extramos el contexto en
                // la variable global ctx
                ctx = $('canvas-world').getContext('2d');
            
                // Ahora vamos a consultar las coordenadas y el tamaño
                // del canvas HTML con id canvas-world.
                var canvasElm = $('canvas-world');
                canvasWidth = parseInt(canvasElm.width);
                canvasHeight = parseInt(canvasElm.height);
                var canvasTop = parseInt(canvasElm.style.top);
                var canvasLeft = parseInt(canvasElm.style.left);
    
                // Ya estamos listos para crear el texto "Hola Mundo".
                createHelloWorld();
 
                // Atamos el evento 'click' al lienzo
                Event.observe('canvas-world', 'click', function(e) {
                    // Crearemos, aleatoriamente, una caja o un círculo
                    
                    if (Math.random() > 0.5) {
                        // Si el factor aleatorio es menor que 0.5, creamos una caja de 10x10
                        // en la posición del ratón
                        createBox(world, e.clientX, e.clientY, 10, 10, false);
                    } else {
                        // Si el factor aleatorio es mayor o igual que 0.5, creamos un círculo
                        // en la posición del ratón
                        createBall(world, Event.pointerX(e), Event.pointerY(e));
                    }
                });
                
                // Iniciamos la ejecución
                step();
            });