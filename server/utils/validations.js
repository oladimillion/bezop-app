
function isObjectEmpty(obj){

  if(!obj)
    return false;

  let filledFiedNum = 0  
  const values = Object.values(obj);

  values.forEach((value) => {
    if(!value)
      filledFiedNum++
  })

  return filledFiedNum == values.length;
}

function testUsername(username){
  username = username ? username.trim() : username;
  const re = /^[\w+\d+]{2,20}$/
  if(!username || !re.test(username)){
    return false;
  }
  return true;
}

function testPassword(password, cpassword, both = false){

  if(both){
    if(!password || password.length < 4 || password.length > 20 || 
      !cpassword || cpassword.length < 4 || cpassword.length > 20){
      return false;
    }

    if (password != cpassword){
      return false;
    }
  } else {
    if(!password || password.length < 4 || password.length > 20){
      return false;
    }
  }
  return true;
}

function isValidLoginData(data){

  if(isObjectEmpty(data)){
    return "All fields are required!";
  }

  let {username, password} = data;

  if(!testUsername(username)){
    return "Username is invalid";
  }

  if(!testPassword(password)){
    return "Password must be between 4 and 20 characters in length";
  }

  return "";
}

function isValidRegData(data){

  if(isObjectEmpty(data)){
    return "All fields are required!";
  }

  let { username, email, password, cpassword, phone } = data;

  if(!testUsername(username)){
    return "Username may be number or alphabet or both, between 2 and 20 in length";
  }

  if(!testPassword(password)){
    return "Password must be between 4 and 20 characters in length";
  }

  if (!testPassword(password, cpassword, true)) {
    return "Passwords must match";
  }

  return "";
}


function isValidFileData(data){

}


module.exports = {isValidLoginData, isValidRegData, isValidFileData};
