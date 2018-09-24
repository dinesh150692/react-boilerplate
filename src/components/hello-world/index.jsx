import React from 'react';
import './style.scss';
const HelloWorld = ({ title }) => (
  <div>
    <div className="helloWorld">{title}</div>
    <div className="helloWorld1">{title}</div>
  </div>  
);

export default HelloWorld;
