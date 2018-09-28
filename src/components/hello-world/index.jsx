import React from 'react';
import './style.scss';
const HelloWorld = ({ title }) => (
  <div>
    <div className="helloWorld">{title || 'Hello World'}</div>
    <div className="helloWorld1">{title || 'Hello Wolrd!'}</div>
  </div>  
);

export default HelloWorld;
