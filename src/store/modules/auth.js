import axios from "axios";

const state = {
  userId: null,
  token: null,
  username: null,
  // tokenExpiration: null,
};

const getters = {
  userId(state) {
    return state.userId;
  },
  username(state) {
    return state.username;
  },
  token(state) {
    return state.token;
  },
  isLoggedIn(state) {
    return !!state.token;
    // to change to true boolean
  },
};

const mutations = {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.profile = payload.profile;
    state.username = payload.username;
    // state.tokenExpiration = payload.tokenExpiration;
  },
};

const actions = {
  async login(context, payload) {
    let error;
    let response = await axios
      .post("http://localhost:3000/special-connections/users/login", {
        email: payload.email,
        password: payload.password,
        // returnSercureToken: true,
      })
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
      });

    context.commit("setUser", {
      token: response.data.token,
      userId: response.data.user._id,
      username: response.data.user.username,
      profile: response.data.user.profile,
      // tokenExpiration: response.expiresIn,
    });

    return error;
    // }
  },

  async signup(context, payload) {
    let error;
    const response = await axios
      .post("http://localhost:3000/special-connections/users/joinUs", {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      })
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
      });

    context.commit("setUser", {
      token: response.data.token,
      userId: response.data.data.user.insertedId,
      username: payload.username,
      // tokenExpiration: response.expiresIn,
    });
  },
  logOut(context) {
    context.commit("setUser", {
      token: null,
      userId: null,
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
