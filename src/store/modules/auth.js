const customAxios = require("./../../utils/customAxios");

const state = {
  userId: null,
  token: null,
  username: null,
  email: null,
  profile: null
  // tokenExpiration: null,
};

const getters = {
  userId(state) {
    return state.userId;
  },
  username(state) {
    return state.username;
  },
  email(state) {
    return state.email;
  },

  token(state) {
    return state.token;
  },
  isLoggedIn(state) {
    return !!state.token;
    // to change to true boolean
  },
  hasProfileAuth(state) {
    return !!state.profile
  }
};

const mutations = {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.profile = payload.profile;
    state.username = payload.username;
    state.email = payload.email;
    // state.tokenExpiration = payload.tokenExpiration;
  },
};

const actions = {
  async login(context, payload) {
    let error;
    let response = await customAxios
      .post("users/login", {
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
      email: response.data.user.email,
      // tokenExpiration: response.expiresIn,
    });

    return error;
    // }
  },

  async signup(context, payload) {
    let error;
    const response = await customAxios
      .post("users/joinUs", {
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
      email: payload.email,
      // tokenExpiration: response.expiresIn,
    });
  },
  async updatePassword(context, payload) {
    let error;
    const response = await customAxios
      .patch("users/update-password/" + context.rootState.auth.userId, {
        currentPassword: payload.currentPassword,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      })
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
      });

    console.log(response.data);
  },
  async deleteUser(context) {
    let error;
    await customAxios
      .delete("users/" + context.rootState.auth.userId)
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
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
