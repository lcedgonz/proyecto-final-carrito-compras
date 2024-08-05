exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).send({ message: 'Usuario no encontrado' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Contraseña incorrecta' });
    }


    req.session.user = {
      id: user.id,
      name: user.nombre,
      role: user.role
    };

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    res.status(500).send({ message: 'Error del servidor' });
  }
};


exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).send('Hubo un problema al cerrar sesión');
      }
      res.redirect('/'); // Redirige a la página de inicio después de cerrar sesión
    });
  };