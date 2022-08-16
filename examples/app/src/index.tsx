import React from 'react';
import ReactDOM from 'react-dom/client';
const Hello = () => {
    const [text, setText] = React.useState('Hello The First FrontFramet!');
    return (<span
        onClick={() => {
            setText('HiII!')
        }}> {text} </span>);
};
const root = ReactDOM.createRoot(document.getElementById('myfrontframe'));
root.render(React.createElement(Hello));