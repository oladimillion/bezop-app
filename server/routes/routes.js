const express = require("express");
const route = express.Router();
const Multer  = require('multer')

let upload = null;

// if(process.env.NODE_ENV != "production"){
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'server/uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "_" + file.originalname)
//     }
//   })
//   upload = multer({storage: storage })
// }


// if(process.env.NODE_ENV == "production"){
upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});
// }


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
