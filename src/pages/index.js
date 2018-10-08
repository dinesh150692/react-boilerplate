import React from 'react';
import Loadable from 'react-loadable';

const Home = Loadable({
    loader: () => import('Pages/home'),
    loading: () => <div>Loading...</div>,
});

const About = Loadable({
    loader: () => import('Pages/about'),
    loading: () => <div>Loading...</div>,
});

const Topics = Loadable({
    loader: () => import('Pages/topics'),
    loading: () => <div>Loading...</div>,
});

export {
    Home, 
    About, 
    Topics
}