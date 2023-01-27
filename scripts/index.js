
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');


const setupUI = (user) => {
  if (user) {
    // account info
    database.collection('users').doc(user.uid).get().then(doc => {
      const html = `
      <div> Hi, ${doc.data().firstName}. Welcome to RxRate!
      <br/> <br/>
      This is your Account page.
      You can view all the data you have submitted to our platform here.
      <br/> <br/>
      This is your profile: <br/> <br/>
      <div/>
      <div> You are logged in with '${user.email}'<div/>
      <div> This is your RxRate username: '${doc.data().userName}'<div/>
      <div> This is your listed country of residence: '${doc.data().country}'<div/>
      `;
      accountDetails.innerHTML = html;
    })
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // hide account info
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  // var items = document.querySelectorAll('.collapsible');
  // M.Collapsible.init(items);

});
