import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import user from "./modules/user";
import contact from "./modules/contact";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    user,
    contact,
  },
});
