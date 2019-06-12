//simple server
const http = require('http');//http library call
const url=require('url');//url library call
const path=require('path');//path library call
const fs=require('fs');//file system library call

//create available files' mimetypes 
//MIME=Multipurpose Internet Mail Extensions
const mimeTypes={
  "html":"text/html",
  "jpeg":"image/jpeg",
  "jpg":"image/jpg",
  "png":"image/png",
  "js":"text/javascript",
  "css":"text/css"
};

//crate http server
//req- server request
//res- server response
http.createServer((req, res)=>{
  //parse request's url to url and get it path name
  /* ex: 

  req.url is 
  "http://localhost/index.html"
  "http://localhost/ds/index.html"

  url.parse(req.url).pathname is 
  /index.html
  /ds/index.html
  */
  var uri=url.parse(req.url).pathname;

  //create file system path
  //process.cwd() show current working directory
  //unescape(uri) removes  URL Percent Encoding(ex: %20 is space) from uri
  var filename=path.join(process.cwd(), unescape(uri));
  console.log("Loading "+uri);
  //stats variable use to check availabity of url
  var stats;

  try{
    stats=fs.lstatSync(filename);// get the status of a file syncronusly 
  }catch(e){
    //create file not found message
    res.writeHead(404, {"Content-type":"text/plain"});
    res.write("404 Not Found!\n");
    res.end();
    return;
  }
  if(stats.isFile()){
    //if stat show it was a file, select mimeType from mimeTypes object by using file extenteion
    /*
    ex: path.extname('/Users/Refsnes/demo_path.js'); => .js
    to get extenttion name before, it will split into the array by using  . and make the array to reverse order and get it first element
    ex:
    path.extname(filename) is ".js"
    path.extname(filename).split(".") is ["","js"]
    path.extname(filename).split(".").reverse() is ["js",""]
    path.extname(filename).split(".").reverse()[0] is "js"
    */
    var mimeType=mimeTypes[path.extname(filename).split(".").reverse()[0]];

    //create success paceket header and it mime type is selected mimeType
    res.writeHead(200,  {"Content-type":mimeType});
    //fs.createReadStream() allows you to open up a readable stream in a very simple manner. 
    var fileStream=fs.createReadStream(filename);
    fileStream.pipe(res);
  }else if(stats.isDirectory()){
    //if path is a directory, direct to the index.html file
    res.writeHead(302, {"Location":"index.html"});
    //res.end() will end the response process. 
    res.end();
  }else{
    //if server is a failed,return error message
    res.writeHead(500, {"Content-type":"text/plain"});
    res.write("500 Internal Error!\n");
    res.end();
  }
}).listen(3000);
//listen port 3000 of local server