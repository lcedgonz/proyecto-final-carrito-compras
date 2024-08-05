exports.userDashboard = (req, res) => {
    if (!req.session.user) {
      return res.redirect('/');
    }
    res.render('user/dashboard', {
      user: req.session.user,
      title: 'Dashboard del Usuario',
    });
  };
  
  exports.userProfile = (req, res) => {
    res.render('user/profile', {
      user: req.session.user,
      title: 'Perfil del Usuario',
    });
  };
  
  