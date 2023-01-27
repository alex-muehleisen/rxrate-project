// add admin/pharmacyRep cloud function
const adminForm = document.querySelector('#pharmacy-signup-form');
adminForm.addEventListener('button', (e) => {
  e.preventDefault();
  const pharmacyEmail = document.querySelector('#pharmacy-signup-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: pharmacyEmail }).then(() => {
    console.log(result);
  });
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  console.log(user);
  if (user) {
    console.log('user logged in: ', user);
    setupUI(user);
  } else {
    console.log('user logged out');
    setupUI();
  }
});

// sign Up

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info

  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return database.collection('users').doc(cred.user.uid).set({
      firstName: signupForm['signup-firstname'].value,
      lastName: signupForm['signup-lastname'].value,
      userName: signupForm['signup-username'].value,
      country: signupForm['signup-country'].value,
      age: signupForm['signup-age'].value,
      gender: signupForm['signup-gender'].value,
      ethnicity: signupForm['signup-ethnicity'].value
    });
  }).then(() => {
    // close modal and reset
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    // transfer user to home.html
    window.location.href = 'home.html';
  });
});

// logout method
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
});

// login method
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // transfer user to home.html
    window.location.href = 'home.html';
    // close the login model and reset
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
