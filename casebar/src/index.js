import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { firebaseAuth, database,ref } from './fire'
import { Userbar, Signup, Login} from './identity'


ReactDOM.render(<Userbar />,document.getElementById('user'));
ReactDOM.render(<Signup />,document.getElementById('signup'));
ReactDOM.render(<Login />,document.getElementById('login'));

