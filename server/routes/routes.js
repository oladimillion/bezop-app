const express = require("express");
const route = express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
  }
})
const upload = multer({storage: storage })

const MainCtrl = require("../controllers/main-ctrl");
const  authenticate  = require("../middlewares/authenticate");

const { 
  signin, 
  signup, 
  addFile, 
  removeFile, 
  retrieveFiles, 
  undoRemoveFile, 
} = MainCtrl;


// USERS AUTHENTICATION
route.post('/signin', signin);


// USERS REGISTRATION
route.post('/signup', signup);


// ADD, REMOVE AND RETRIEVE FILES
route.post('/add-file', authenticate, upload.single('avatar'), addFile);
route.put("/remove-file", authenticate, removeFile);
route.put("/undo-remove-file", authenticate, undoRemoveFile);
route.get("/retrieve-files", authenticate, retrieveFiles);



module.exports = route;
