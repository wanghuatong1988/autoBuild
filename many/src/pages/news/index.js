import "../../common.js";
let Index = require("./index.vue").default;

window.vm = new Vue({
    el: "#app",
    render: h => h(Index)
});