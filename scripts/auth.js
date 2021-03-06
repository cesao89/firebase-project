// add admin cloud function
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');

  addAdminRole({email: adminEmail}).then(result => {
    adminForm.querySelector('.info').innerHTML = result.data.message;
    adminForm.reset();

    setTimeout(() => {
      adminForm.querySelector('.info').innerHTML = '';
    }, 8000)
  });
});

// listen for auth status change
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });

    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
    }, err => {
      console.log(err.message)
    });
  } else {
    setupGuides([]);
    setupUI();
  }
});


// create new guides
const createFrom = document.querySelector('#create-form');
createFrom.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('guides').add({
    title: createFrom['title'].value,
    content: createFrom['content'].value
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createFrom.reset();
  }).catch((err) => {
    console.log(err.message);
  });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

// loggout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      // close the login modal & reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
    });
});
