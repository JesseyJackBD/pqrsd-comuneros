
function isAuthenticated (req, res, next) {
  if(req.session.loggedin == true){
    return next();
  }
  res.redirect('/login')
}

function isAdministrator (req, res, next) {
  if(req.session.id_admin == 1){
    return next();
  }
  res.redirect('/central')
}

export {isAuthenticated, isAdministrator}