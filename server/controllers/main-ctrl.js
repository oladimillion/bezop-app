const jwt = require("jsonwebtoken");
const bycrypt = require('bcryptjs');


const models = require( '../models/models' );
const { isValidLoginData }  = require("../utils/validations")
const { isValidRegData, isValidFileData }  = require("../utils/validations")
const {	User, File } = models;

function signin( req, res ) {

  // validating user's data
  let message = isValidLoginData(req.body);

	if (message) {
		return res.status(401).json({ success: false, message });
	}

	const { username, password } = req.body;

  User.findOne({username}, "username password", 
    function(err, user){
    if (err) {
      throw err;
    } else if ( user ) {
      var validPassword = user.comparePassword( password );
      if ( !validPassword ) {
        // invalid password provided
        return res.status(403).json( {
          success: false,
          message: "Invalid credentials provided"
        } );
      } else {
        // giving user a token which is needed 
        // for authentication
        const token = jwt.sign({
          username: user.username,
        }, process.env.JWT_SECRET);

        return res.status(200).json({
          success: true,
          message: "Welcome",
          payload: token
        });
      }
    } else {
      // credentials cannot be verified
      return res.status(403).json({
        success: false,
        message: "Invalid credentials provided"
      });
    }
  })
}

function signup(req, res) {

  // validating user's data
  let message = isValidRegData(req.body);

  if (message) {
    return res.status(400).json({ success: false, message });
  }
  const { username, password } = req.body;
  const user = new User();

  //FETCH USERNAME NAME FROM DB AND CHECK IF EXIST
  user.usernameExist(username, function(_user){

    if(_user && (_user.username == username)){
      return res.status( 403 ).json({
        success: false,
        message: "Username already taken",
      });
    }

    user.username = username;
    user.password = password;

    user.save()
      .then(function (result) {
        // registration successful
        return res.status( 201 ).json({
          success: true,
          message: "Registration Successful!.\nYou may now login"
        });

      })
  });
}

function addFile(req, res){
  if(!req.file){
    return res.status( 403 ).json({
      success: false,
      message: "Please choose a file"
    });
  }

  const file = new File();
  file.owner = req._username;
  file.fileid = req.file.filename;
  file.fileurl = req.protocol + '://' + req.get('host')
	+ "/" + req.file.filename;

  file.save()
    .then(function (result) {
      return res.status( 201 ).json({
        success: true,
        message: "File uploaded",
        payload: result,
      });
    })
}

function removeFile(req, res){
  File.findOne({ fileid: req.body.fileid }, 
    function (err, file){
      if(file && file.owner == req._username){
        file.is_removed = true;
        file.save();
        return res.status( 201 ).json({
          success: true,
          message: "File moved to trash",
          payload: file,
        });
      }
      return res.status( 403 ).json({
        success: false,
        message: "File not moved to trash"
      });
    });
}

function undoRemoveFile(req, res){
  File.findOne({ fileid: req.body.fileid }, 
    function (err, file){
      if(file && file.owner == req._username){
        file.is_removed = false;
        file.save();
        return res.status( 201 ).json({
          success: true,
          message: "File removed from trash",
          payload: file,
        });
      }
      return res.status( 403 ).json({
        success: false,
        message: "File not removed from trash"
      });
    });
}



function retrieveFiles(req, res){
  File.find({ owner: req._username  }, function (err, files) {
    return res.status( 200 ).json({
      success: true,
      message: "File retrieved",
      payload: files,
    });
  });
}

module.exports = { 
  signup, 
  signin, 
  addFile, 
  removeFile, 
  retrieveFiles,
  undoRemoveFile, 
};
