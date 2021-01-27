//hente referanse til canvas
var canvas = document.getElementById('canvas'); //dette sier gå til HTML filen og hent ID som heter "canvas" og sett det som canvas.

//var står for veriable, det er "alt" som vi vil lagere slik at vi for bruke det senere.
//'' betyr at det er en string, altså at det referer til ordet canvas og ikke veriablet canvas.
//kunne ha kalt det noe annet, altså canvasen.
//opps! på de store bokstavene

   
   //hente referanse til canvas konteksten 
var context = canvas.getContext('2d'); //selve canvasen er en html element i seg selv, dette er rendering konteksten vi velger å jobbe med altså 2d.


var loaded = false;
  //starte(innlede) lastings veriablene
  //vi trenger å vite når bildene våre er lastet ned før vi kan hente dem

var load_counter = 0;

  //starte(innlede) bilde for layeresene
  //vi skal gi hver enste layer navn

var background = new Image();
var tvStand = new Image();
var mask = new Image();
var tv = new Image();
var font = new Image();
var popcorn1 = new Image();
var popcornbucket = new Image();
var popcorn2 = new Image(); //har nå bare 2 lag av popcornPop så lage en... tenker det blir finere
//var mask = new Image();
//var popcornBøtte = new Image();
var popcorn3 = new Image();


//lag en liste av layer objectes 
//på js denne bracketene representerer   en list, det kan være hvilket som helst liste, som en string, nr, objectes. Disse er i kronologisk rekkefølge av hvordan man skriver det inn

var layer_list = [
    {
        'image': background,
        'src': './image/background.png',
        'z_index': -2.25,
        'position': {x: 0, y: 0},
        'blend': null, //null er blank i js
        'opacity': 1 //på opacity 0 er gjennomsiktig og 1 er ikke man kan ha verdier i midten
        
    },
    {
        'image': tvStand,
        'src': './image/tvStand.png',
        'z_index': -2,
        'position': {x: 0, y: 0},
        'blend': 'overlay', 
        'opacity': 0.5 
        
    },
    {
        'image': mask,
        'src': './image/mask.png',
        'z_index': -1.75,
        'position': {x: 0, y: 0},
        'blend': null, 
        'opacity': 1 
    
    },
    {
        'image': tv,
        'src': './image/tv.png',
        'z_index': -1.50,
        'position': {x: 0, y: 0},
        'blend': null, 
        'opacity': 1 
    },
     {
        'image': font,
        'src': './image/font.png',  //navnet på filen
        'z_index': -1,
        'position': {x: 0, y: 0},
       'blend': null, 
        'opacity': 1 
   },
    {
        'image': popcorn1,
        'src': './image/popcorn1.png',
        'z_index': -0.5,
        'position': {x: 0, y: 0},
        'blend': null, //for å ha en blurr effect, tenker å droppe det, men burde være på procreate
        'opacity': 1 
    },
    {
        'image': popcornbucket,
        'src': './image/popcornbucket.png', //navet på filen
        'z_index': -0.25,
        'position': {x: 0, y: 0},
        'blend': null, //spill her med overlay eller null 
        'opacity': 1 
    },
    {
    
        'image': popcorn2,
        'src': './image/popcorn2.png',  //navnet på filen
        'z_index': 0, //dette er midpunktete, det skal stå stille mens alt annet rører på seg
        'position': {x: 0, y: 0},
        'blend': null, 
        'opacity': 1 
    
    
    },
     //{
       // 'image': popcornbøtte,
      //  'src': './image/popcornbøtte.png',  //navn på filen
       // 'z_index': 0.8,
      //  'position': {x: 0, y: 0},
     //   'blend': null, 
     //   'opacity':1
   // },
    
    {
     
        'image': popcorn3,
        'src': './image/popcorn3.png', //navn på filen her
        'z_index': 2,
        'position': {x: 0, y: 0},
        'blend': null, 
        'opacity': 0.9 //slik at de blir litt gjennomsiktige 
    
    }
    
];

layer_list.forEach(function (layer, index) {  //forteller hvilket layer og rekkefølgen det skal kjøre det på
    layer.image.onload = function() {
        load_counter += 1;  //vi sier pluss 1 på det bildet som kjøres slik at neste bildet kommer
        if (load_counter >= layer_list.length){  //dette er en if statment som sier hvis det som står i parantesen er sant gjør det som er i curly parateset.
    
            //her sier vi etter man har kjørt alle layersene så kjør drawCanvas
            requestAnimationFrame(drawCanvas);
            
        }
    }
    layer.image.src = layer.src; //dette er bassicly knappen som gjør at det kjører etter alle statmentsene har blitt gjort
});


//funksjonen som gjemmer loading masken
function hideLoading(){
    loading_screen.classList.add('hidden');
    
}

function drawCanvas(){
    //fjerne alt som er i canvas
    context.clearRect(0, 0, canvas.width, canvas.height);  //vi skal fjerne det og tegne det 60 gang per sec 
    
    //lopp gjennom layer og tegne det på canvas
    layer_list.forEach(function(layer, index) {
        
        //regn hviket posisjon av lagene det skal være (getOffsett fuksjonen er lengere ned)
        layer.position = getOffset(layer);
        
        
        if(layer.blend){
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        
        context.globalAlpha = layer.opacity;
        
        context.drawImage(layer.image, layer.position.x, layer.position.y);
        
    });
    
    requestAnimationFrame(drawCanvas);
}

function getOffset(layer){
    var touch_multiplier = 0.15; //mulighet til å leke med dette tallet for å tone ned/opp effecten
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
    
    var motion_multiplier = 2;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
    
    
    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };
    
    return offset;
}

//toch og muse kontroller

var moving = false; //vi bare at bildet skal røre på seg når man klikker og rører 

//innlede toch og muse posisjoner

var pointer_initial = { //dette holder i skjekk hvor i skjemer man har rørt slik at det ikke bare hopper
    x: 0,
    y: 0
};

var pointer = {
    x: 0,
    y: 0
};

canvas.addEventListener('touchstart', pointerStart); //det må stå slikt
canvas.addEventListener('mousedown', pointerStart);

function pointerStart (event){
    moving = true;
    //check on det er en touch event
    if (event.type === 'touchstart'){
       
        //hvis det er det innled touch posisjonen til kortdinatene hvor du først rørte skjemen
       pointer_initial.x = event.touches[0].clientX;
       pointer_initial.y = event.touches[0].clientY;
        
        //check om det er en mouse click event
  }else if (event.type === 'mousedown'){
        //innled mouse posisjonen til kortdinatene hvor man klikket(siden det ikke finnes en system som støtter mer enn en mouse)
       pointer_initial.x = event.clientX;
       pointer_initial.y = event.clientY;
   
    }
}

window.addEventListener('mousemove', pointerMove);
window.addEventListener('touchmove', pointerMove);

function pointerMove(event){
    //dette er viktig slik at scrolling ikke skal skje isteden for røring av lagene.
    event.preventDefault();
    //bare kjør dette hvis touch or mouse klikk har startet
    if(moving === true){
        var current_x = 0;
        var current_y = 0;
        if(event.type === 'touchomove'){
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if(event.type === 'mousemove'){
            current_x = event.clientX;
            current_y = event.clientY;
        }
        
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
};

canvas.addEventListener('touchmove', function(event){
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event){
    event.preventDefault();
});


//se etter når man ikke rører skjermen slik at det kan gå tilbake til sitt orginale
window.addEventListener('touched', function(event){
    endGesture();
});
           
window.addEventListener('mouseup', function(event){
    endGesture();
});

function endGesture(){
    moving = false;
    
    pointer.x = 0;
    pointer.y = 0;
}
                        
//Motion Kontroll

// motion parallax
var motion_initial = {
	x: null,
	y: null
};
var motion = {
	x: 0,
	y: 0
};

// her hører vi etter gyroscope sitt posisjon
window.addEventListener('deviceorientation', function(event) {
	// hvis det er første "run" gjennom innled posisjonen av gyroscope 
	if (!motion_initial.x && !motion_initial.y) {
		motion_initial.x = event.beta;
		motion_initial.y = event.gamma;
	}
	
	// avhengi av oriantasjonen så må man fikse gyroscopet
    if (window.orientation === 0) {
        //enheter er venstre side opp i portrait mode
    	motion.x = event.gamma - motion_initial.y;
    	motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
        //enheten er i landskap ligende på sitt venstre side
    	motion.x = event.beta - motion_initial.x;
    	motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        //enheten er i landskap lifende på sitt høyere side 
    	
    	motion.x = -event.beta + motion_initial.x;
    	motion.y = event.gamma - motion_initial.y;
    } else {
    	// hvis enheten er opp-ned i portrett orientation 
		motion.x = -event.gamma + motion_initial.y;
		motion.y = -event.beta + motion_initial.x;
    }
});

// Reset posisjonen når enheten bytter fra portrait til landskap  
window.addEventListener('orientationchange', function(event) {
	motion_initial.x = 0;
	motion_initial.y = 0;
});

