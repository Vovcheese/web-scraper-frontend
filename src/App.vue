<template lang="pug">
//- #app
//-   #nav(v-if="isLoggedIn")
//-     sidebar
<div id="app">
  <div id="nav" v-if="isLoggedIn">
    <sidebar/>
  </div>
  <router-view/>
</div>

</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
  components: { Sidebar },
  name: 'App',
  metaInfo: {
    title: 'Загрузка...',
    titleTemplate: '%s | SEO Admin-panel',
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>
