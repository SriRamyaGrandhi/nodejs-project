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

	const filename = oldpath;
        const bucketName = 'nodejsrvr3';

  // Uploads a local file to the bucket
  storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
      console.log(` file ${filename} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<p>User selects the file to upload to the google bucket</p>');
  
    res.write('<input type="file" name="filetoupload"><br><br>');
   res.write('<input type="submit" onclick="file uploaded to bucket">');
    res.write('</form>');
 res.write('</body>');
    return res.end();
  }
}).listen(8080);