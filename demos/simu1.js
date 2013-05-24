var world;
var ctx;
var canvasWidth;
var canvasHeight;
// Función que crea el mundo.
 function createWorld() {
                var worldAABB = new b2AABB();
                worldAABB.minVertex.Set(-1000, -1000);
                worldAABB.maxVertex.Set(1000, 1000);
                var gravity = new b2Vec2(0, 300);
                var doSleep = true;
                world = new b2World(worldAABB, gravity, doSleep);
                // Añade un suelo al mundo
            function createGround(world) {
                var groundSd = new b2BoxDef();
                groundSd.extents.Set(400, 30);
                groundSd.restitution = 0.0;
                var groundBd = new b2BodyDef();
                groundBd.AddShape(groundSd);
                groundBd.position.Set(400, 470);
                return world.CreateBody(groundBd);
            }

                return world;
            }

            // Punto de entrada principal. Cuando se cargue la ventana:
            Event.observe(window, 'load', function() {
                world = createWorld();
       		ctx = $('canvas-world').getContext('2d');

       		var canvasElm = $('canvas-world');
       		canvasWidth = parseInt(canvasElm.width);
       		canvasHeight = parseInt(canvasElm.height);
       		var canvasTop = parseInt(canvasElm.style.top);
       		var canvasLeft = parseInt(canvasElm.style.left);
            });
//dibuja el mundo
             function drawWorld(world, context) {
                for (var b = world.m_bodyList; b; b = b.m_next) {
                    for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                        drawShape(s, context);
                    }
                }
            }

            function drawShape(shape, context) {
                context.strokeStyle = '#ffffff';
                context.fillStyle = "black";
                context.beginPath();
                switch (shape.m_type) {
                    case b2Shape.e_polyShape:
                        {
                            var poly = shape;
    				        var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                            context.moveTo(tV.x, tV.y);

                            for (var i = 0; i < poly.m_vertexCount; i++) {
                                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                                context.lineTo(v.x, v.y);
                            }
                            context.lineTo(tV.x, tV.y);
                        }
                        break;
                }

                context.fill();
                context.stroke();
            }
 
function step(cnt) {
                var timeStep = 1.0/60;
                var iteration = 1;
                world.Step(timeStep, iteration);
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                drawWorld(world, ctx);
                setTimeout('step(' + (cnt || 0) + ')', 10);
            }
            step();