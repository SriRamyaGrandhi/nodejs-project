var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const Storage = require('@google-cloud/storage');


const storage = Storage({
  keyFilename: '/Users/hp/nodejs-d2b9c977c585.json'
});


http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var name =files.filetoupload.name;
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
   fs.readFile('/Users/hp/readfile.csv','utf8', function (err,data) {
    if (err) {
    return console.log(err);
  }
console.log("contents of the file are");
  console.log(data);
   
})
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