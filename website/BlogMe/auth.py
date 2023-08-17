import functools		
from flask import(
        Blueprint, g, render_template, flash, redirect, request, session, url_for

)
from werkzeug.security import check_password_hash, generate_password_hash
from BlogMe.db import get_db
from sqlite3 import IntegrityError
bp = Blueprint('auth', __name__, url_prefix = "/auth")

#Register
@bp.route('/Register', methods = ['GET', 'POST'])
def Register():
	if request.method == 'POST':
		username = request.form['username']
		password = request.form['password']
		db = get_db()
		error = None
		if not username:
			error = 'username is not defined'
		elif not password:
			error = 'password is incorrect'
		if error is None:
			try:
				db.execute(
        			"INSERT INTO user (username, password) VALUES (?, ?)",
					(username, generate_password_hash(password)),
     					)
				db.commit()
			except IntegrityError:
				error = f"User{username} is not defined "
			else:
				return redirect(url_for("auth.login"))
		flash(error)
	return render_template('auth/register.html')
#login
@bp.route('/login', methods = ['GET', 'POST'])
def login():
	if request.method == 'POST':
		username = request.form['username']
		password = request.form['password']
		db = get_db()
		error = None
		user = db.execute(
			"SELECT * FROM user WHERE username = ?", (username,)
			).fetchone
		if user is None:
			error = 'username is not defined'
		elif check_password_hash(user['password'],password):
			error = 'incorrect password'
		if error is None:
			session.clear()
			session['user_id'] = user['id']
			return redirect(url_for('index'))
		flash(error)
	return render_template('auth/login.html')

#get user info
@bp.before_app_request
def load_logged_in_user():
	user_id = session.get('user_id')
	if user_id is None:
		g.user = None
	else:
		g.user = get_db().execute(
			'SELECT * FROM user WHERE id = ?', (user_id,)
			).fetchone

#logout
@bp.route('/logout')
def logout():
	session.clear()
	return redirect(url_for('index'))

#check whether is user is logged in or not
def login_required(view):
	@functools.wraps(view)
	def wrapped_view(**kwargs):
		if g.user is None:
			return redirect(url_for('auth.login'))
		return view(**kwargs)
	return wrapped_view


