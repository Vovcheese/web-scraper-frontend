<template lang="pug">
.login-wrapper
  //- form.form(@submit.prevent="login")
  //-   h1 authorization
  //-   label Email
  //-   el-input(rv-model="email" type="email" placeholder="Name")
  //-   label Password
  //-   el-input(required="" v-model="password" type="password" placeholder="Password")
  //-   hr
  //-   button(type="submit") Login

  // form
  el-form.form(:model="form", @submit.prevent="login")
    // login
    el-form-item
      el-input(v-model="form.login" placeholder="enter a login")

    // password
    el-form-item
      el-input(v-model="form.password" placeholder="enter a password" show-password)

    el-button.login-btn(type="primary" @click="login") LOGIN

</template>

<script>
export default {
  data() {
    return {
      form: {
        login: '',
        password: '',
      },
    };
  },
  created() {
    // eslint-disable-next-line
    this.$http.interceptors.response.use(undefined, (err) => new Promise(function (resolve, reject) {
      // eslint-disable-next-line no-underscore-dangle
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch('logout');
      }
      throw err;
    }));
  },
  methods: {
    login() {
      const { login, password } = this.form;

      this.$store
        .dispatch('login', { login, password })
        .then(() => this.$router.push('/sites'))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  .form {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 400px;
    text-align: center;

    .login-btn {
      width: 100%;
      // background-color: #333030;
      // border-color: #333030;
    }
  }
}
</style>
