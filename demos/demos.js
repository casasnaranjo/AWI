var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var contador=0;

function setupWorld(did) {
	if (!did) did = 0;
	world = createWorld();
	initId += did;
	initId %= demos.InitWorlds.length;
	if (initId < 0) initId = demos.InitWorlds.length + initId;
	demos.InitWorlds[initId](world);
}
function Textos(){

	var canvas = document.getElementById("canvas");
    var canvasCtx = canvas.getContext("2d");
    var Mensaje0=	"Hola bienvenido al laboratorio de pendulo simple, click para continuar";
    var Mensaje1 = "Ponte de pie y alejáte un poco, ahora mueve el puntero del mouse con tu mano derecha";
    var Mensaje2 = "Ahora alza la mano izquierda y bajala";
    var Mensaje3 = "Gracias ahora diviértete";
    if (contador==0) {
    	var text = Mensaje0;
   	 }
    else if(contador==1)
    	{
    	var text = Mensaje1;	
    	}
    else if(contador==2)
    	{
    	var text = Mensaje2;	
    	}
    else
    	{
    	var text = Mensaje3;	
    	};

    
    var x = 10; // Posición en el eje X donde empezar a dibujar.
    var y = 10; // Posición en el eje Y donde empezar a dibujar.
    canvasCtx.fillStyle = '#ffffff'; // Color del texto
    canvasCtx.textBaseline = "top"; // Línea base del texto
    canvasCtx.font = '14px Comic Sans MS'; // Tamaño y estilo de la fuente
 
    canvasCtx.fillText(text , x, y); // Pintamos el texto.
}
function setupNextWorld() { setupWorld(1); }
function setupPrevWorld() { setupWorld(-1); }
function step(cnt) {
	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);
	Textos();
	setTimeout('step(' + (cnt || 0) + ')', 10);
}
Event.observe(window, 'load', function() {
	setupWorld();
	ctx = $('canvas').getContext('2d');
	var canvasElm = $('canvas');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);
	Event.observe('canvas', 'click', function(e) {
		contador=contador+1;

		//setupNextWorld();
		if (Math.random() < 0.1) 
			demos.top.createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
		else 
			createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) -1.75*canvasTop, 10, 10, false);
	});
	Event.observe('canvas', 'contextmenu', function(e) {
		if (e.preventDefault) e.preventDefault();
		//setupPrevWorld();
		return false;
	});
	step();
});
