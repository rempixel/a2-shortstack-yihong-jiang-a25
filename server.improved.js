const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

// const appdata = [
//   { "model": "toyota", "year": 1999, "mpg": 23 },
//   { "model": "honda", "year": 2004, "mpg": 30 },
//   { "model": "ford", "year": 1987, "mpg": 14} 
// ]

let server_data = [
  //{"name": "vell", "image": "data:image/jpeg;base64/9j/", "birthday": "2004-06-01"},
];

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  switch (request.url) {
    case "/" :
      sendFile( response, "public/index.html" );
      break;
    case "/results" :
      response.writeHead(200, "OK", {"Content-Type": "application/json"});
      response.end(JSON.stringify(server_data));  
      break;
    default : 
      sendFile (response, filename);
  }
}

const handlePost = function( request, response ) {
  let dataString = "";

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    var data_json = {};
    try {
      data_json = JSON.parse( dataString );
    } catch {
      console.log("Unable to parse data into JSON");
      response.writeHeader(400);
      response.end("Unable to parse data into JSON"); 
      return;
    }
    switch (request.url){
      case "/submit" :
        submit_data(data_json, server_data, response);
        break;
      case "/delete" :
        const index = data_json.index; 
        server_data.splice(index, 1);
        response.writeHead( 200, "OK", {"Content-Type": "application/json"});
        response.end(JSON.stringify({success: true}));
        break; 
      case "/edit" :
        edit_data(data_json, server_data, response);
        break;
    }
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

function submit_data(data_json, server_data, response) {
  const user_name = data_json.name.toString().trim();
  const image_data = data_json.image.toString();
  const date = data_json.birthday.toString().trim();

  const age = derive_age(date);
  const zodiac = derive_zodiac(date);

  server_data.push( {
    name: user_name, 
    image: image_data,
    birthday: date,
    age: age,
    zodiac: zodiac,
  })

  console.log("Data added to server.");
  response.writeHead( 200, "OK", {"Content-Type": "application/json"});
  return response.end(JSON.stringify(server_data));
}

function edit_data(data_json, server_data, response) {
  const index = data_json.index;
  const user_name = data_json.name.toString().trim();
  const date = data_json.birthday.toString().trim();
  const image_data = data_json.image.toString();

  const age = derive_age(date);
  const zodiac = derive_zodiac(date);

  server_data[index] = {
    name: user_name,
    image: image_data,
    birthday: date,
    age: age,
    zodiac: zodiac,
  };

  console.log("Data updated on server.");
  response.writeHead(200, "OK", {"Content-Type": "application/json"});
  response.end(JSON.stringify(server_data));
}

function derive_age(string) {
  const today = new Date();
  const birth_date = new Date(string);
  var age = today.getFullYear() - birth_date.getFullYear();
  var m = today.getMonth() - birth_date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth_date.getDate())) {
      age--;
  }
  return age;
}

function derive_zodiac(string) {
  const birth_date = new Date(string);
  const birth_year = birth_date.getFullYear();
  const modulo = birth_year % 12;
  let zodiac = "";
  switch (modulo) {
    case 0 : 
      zodiac = "Monkey";
      break;
    case 1 : 
      zodiac = "Rooster";
      break;
    case 2 :
      zodiac = "Dog";
      break;
    case 3 :
      zodiac = "Pig";
      break;
    case 4 :
      zodiac = "Rat";
      break;
    case 5 :
      zodiac = "Ox";
      break;
    case 6 :
      zodiac = "Tiger";
      break;
    case 7 :
      zodiac = "Rabbit";
      break;
    case 8 :
      zodiac = "Dragon";
      break;
    case 9 : 
      zodiac = "Snake";
      break;
    case 10 :
      zodiac = "Horse";
      break;            
    case 11 : 
      zodiac = "Sheep";
      break;
  }
  return zodiac;
}

server.listen( process.env.PORT || port )
