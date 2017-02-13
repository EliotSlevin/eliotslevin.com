var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine;
var render;
var runner;
var shapes = [];
var mouse;

var w = 0;
$(window).load(function(){
    w = $(window).width();
    var h = window.innerHeight;
    $('#matter').height(h);
    $('header').height(h);
});

var shapeSpawnerInterval;

var mq = window.matchMedia( "(min-width: 900px)" );
var largeScreen = window.matchMedia( "(min-width: 1025px)" );


function initShapes(){
 


    // create an engine
    engine = Engine.create();

    var width = document.getElementById('matter').offsetWidth;
    var height = document.documentElement.clientHeight;

    var size;
    if (mq.matches) {
      size = 200;
    } else {
      size = 150;
    }

    var colors = ['#4b62df', '#f7886f', '#213d47', '#ffe271', /*'#ff7183'*/];
    // var colors = ['#4b62df', '#4bdfdb', '#4bdf66', '#df704b', '#df4b72'];

    // create a renderer
    render = Render.create({
        element: document.getElementById('matter'),
        engine: engine,
        options: {
             width: width,
             height: height,
             wireframes: false,
             background: '#ffffff',
    	}
    });


    var ground = Bodies.rectangle((width / 2),height + 30, width, 60, { 
                    isStatic: true,
                    render: {
                        fillStyle: 'red',
                        strokeStyle: 'white',
                        lineWidth: 0
                    }
                 });

    var wall = Bodies.rectangle(0,(height / 2), 20, height, { 
                    isStatic: true,
                    render: {
                        fillStyle: 'red',
                        strokeStyle: 'white',
                        lineWidth: 0
                    }
                 });

    // add all of the bodies to the world
    World.add(engine.world, ground);
    // World.add(engine.world, wall);

    
    shapeSpawnerInterval = setInterval(function() {
        var x = _.random(0,width);
        var i = _.random(1,5);
        var color = _.sample(colors);
        var options ={
            render: {
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 0
            },
            angle: _.random(0,6),
            torque: _.random(-50,50),
        }


        var newBody;
        switch(i){
            case 1:
                newBody = Bodies.circle(x, -size, size/2, options);
                break;
            case 2:
                newBody = Bodies.rectangle(x, -size, size*0.9, size*0.9, options);
                break;
            case 3:
                newBody = Bodies.polygon(x, -size, 3, size/2, options);
                break;
            case 4:
                newBody = Bodies.polygon(x, -size, 5, size/2, options);
                break;
            case 5:
                newBody = Bodies.polygon(x, -size, 7, size/2, options);
                break;
        }

    	World.add(engine.world, newBody);
        shapes.push(newBody);

        if(shapes.length > 80){
            var body = shapes.shift();
            World.remove(engine.world, body);
        }
    }, 800);

    if(largeScreen.matches){
        // add mouse control
        mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        World.add(engine.world, mouseConstraint);

        render.mouse = mouse;
    }


    

   


    // run the engine
    runner = Engine.run(engine);

    // run the renderer
    Render.run(render);
}

initShapes();


window.addEventListener("resize", function(event){
    if(w != $(window).width()){
        Runner.stop(runner);
        Render.stop(render);
        clearInterval(shapeSpawnerInterval);

        delete engine;
        delete render;
        delete runner;
        delete shapes;

        $('#matter').html('');

        initShapes();  
        
        w = $(window).width;
    }
});

