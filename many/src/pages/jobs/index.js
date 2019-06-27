import Vue from 'vue';
let Index = require('./index.vue').default;

window.vm = new Vue({
    el: '#app',
    render: h => h(Index)
});