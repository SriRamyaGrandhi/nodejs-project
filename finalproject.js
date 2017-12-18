var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const Storage = require('@google-cloud/storage');


const storage = Storage({
  keyFilename: '/Users/hp/nodejs-d2b9c977c585.json'
});
var readline = require('linebyline');
var Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'myfirestore-afeb4',
  keyFilename: '/Users/hp/myfirestorekey.json',
});


http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var name =files.filetoupload.name;
console.log(name);
    const filename = oldpath;
    const bucketName = 'nodejsrvr2';
//to upload the file to google bucket   
 storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
      console.log(` file ${name} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
 })
//to read the data of file stored in bucket and display the contents
 const destFilename = '/Users/hp/readfile.csv';
 const options = {
 destination: destFilename,
  };

  storage
    .bucket(bucketName)
    .file(name)
    .download(options)
    .then(() => {
   rl = readline('/Users/hp/readfile.csv');
console.log("the contents of file are");
  rl.on('line', function(line, lineCount, byteCount) {
     let documentRef = firestore.collection('col4').doc();
    console.log(line);
    documentRef.set({
      filecontent: line
      });
});
});
});
  
 }
 else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<p>User selects the file to upload to the google bucket</p>');
  
    res.write('<input type="file" name="filetoupload"><br><br>');
   res.write('<input type="submit" name="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);