import { render } from 'preact';
import { Router } from 'wouter-preact';
import { App } from './app';
import './index.css';

const root = document.getElementById('app');
if (!root) throw new Error('#app root not found');

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

render(
  <Router base={base}>
    <App />
  </Router>,
  root,
);
