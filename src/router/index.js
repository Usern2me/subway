import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Select from '@/components/Select';
import Detail from '@/components/Detail';
import End from '@/components/End';


Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        component: Home,
    }, {
        path: '/home',
        component: Home,
    }, {
        path: '/select',
        component: Select,
    }, {
        path: '/detail',
        component: Detail,
    }, {
        path: '/end',
        component: End,
    }, {
        path: '*',
        component: Home,
    }],
});
