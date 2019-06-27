import Vue from "vue";
import Vuex from "vuex";
import dataSet from "./modules/dataset";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        dataSet
    }
});