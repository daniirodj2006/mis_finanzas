import './style.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderNavbar } from './components/navbar.js';

onAuthStateChanged(auth, (user) => {
  if (user) {
    renderDashboard();
    renderNavbar('dashboard');
  } else {
    document.querySelector('#app').innerHTML = `<div id="app"></div>`;
    renderLogin();
  }
});