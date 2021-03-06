const customAxios = require("./../../utils/customAxios");


const state = {
  profile: null,
  matches: [],
  users: [],
  disabilities: [
    "Vision Impairment",
    "Deafness or Hardness of Hearing",
    "Intellectual Disability",
    "Mental Health Conditions",
    "Acquired Brain Injury",
    "Autism Spectrum Disorder",
    "Physical Disability",
    "Positive about Disability",
  ],
  review: null,
  reviews: null,               
};

const getters = {
  profile(state) {
    return state.profile;
  },
  matches(state) {
    return state.matches;
  },
  hasMatches(state) {
    return state.matches && state.matches.length > 0;
  },
  users(state) {
    return state.users;                         
  },
  review(state) {
    return state.review;
  },
  reviews(state) {
    return state.reviews;
  },
  hasProfile(state) {
    return !!state.profile;
    // to change to true boolean
  },
};

const mutations = {
  setProfile(state, payload) {
    state.profile = payload.profile;
  },

  setMatches(state, payload) {
    state.matches = payload.matches;
  },

  setUsers(state, payload) {
    state.users = payload.users;
  },

  setReview(state, payload) {
    state.review = payload;
  },
  setReviews(state, payload) {
    state.reviews = payload;
  },
};

const actions = {
  async createProfile(context, payload) {
    let error;
    let profile = {
      dob: payload.dob,
      gender: payload.gender,
      country: payload.country,
      disability: payload.disability,
      interestedIn: payload.interestedIn,
      genderPreference: payload.genderPreference,
      minAge: payload.minAge,
      maxAge: payload.maxAge,
      countryPreference: payload.countryPreference,
      disabilityPreference: payload.disabilityPreference,
      aboutMe: payload.aboutMe,
      interests: payload.interests,
      photoURL: payload.photoURL,
    };
    await customAxios
      .patch(
        "users/profile/" +
          context.rootState.auth.userId,
        profile
      )
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
      });
    context.commit("setProfile", {
      profile,
    });
  },
  async getUpdatedProfile(context) {
    let result = await customAxios.get(
     "users/profile/" +
        context.rootState.auth.userId
    );

    let updatedProfile = result.data;
    context.commit("setProfile", updatedProfile);
  },
  async getMatches(context) {
    let error;
    const response = await customAxios
      .get(
       "users/" +
          context.rootState.auth.userId
      )
      .catch((err) => {
        console.dir(err);
        error = err;
        throw error;
      });

    let matches = [];
    for (const match of response.data) {
      const m = {
        id: match._id,
        username: match.username,
        profile: match.profile,
      };
      matches.push(m);
    }
    context.commit("setMatches", {
      matches,
      // tokenExpiration: response.expiresIn,
    });
  },
  async getAllUsers(context) {
    const response = await customAxios.get(
       "users/",
      {
        params: { _id: context.rootState.auth.userId },
      }
    );

    let users = [];
    for (const user of response.data) {
      const u = {
        id: user._id,
        username: user.username,
        profile: user.profile,
      };
      users.push(u);
    }
    context.commit("setUsers", {
      users,
    });
  },
  async deleteProfile(context) {
    await customAxios.delete(
       "users/profile/" +
        context.rootState.auth.userId
    );
    context.rootState.auth.profile = null;
    context.commit("setProfile", {
      profile: null,
    });
  },
  async postReview(context, payload) {
    const response = await customAxios.patch(
        "users/review/" +
        context.rootState.auth.userId,
      {
        review: payload.review,
      }
    );
    console.log(response.data);
    context.commit("setReview", response.data);
  },
  async loadReviews(context) {
    const response = await customAxios.get(
        "users/reviews"
    );

    context.commit("setReviews", response.data);
  },

  logOut(context) {
    context.commit("setMatches", {
      matches: [],
    });
    context.commit("setUsers", {
      users: [],
    });
    context.commit("setProfile", {
      profile: null,
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
