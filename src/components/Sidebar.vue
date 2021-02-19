<template lang="pug">
.sidebar-wrapper
  el-menu.el-menu-demo(
    :default-active="activeIndex2",
    mode="horizontal",
    @select="handleSelect",
    background-color="#333030",
    text-color="#FFFFF3",
    active-text-color="#e3dede"
  )
    //- el-menu-item(index="logo") WEB SCRAPER
    el-menu-item(index="sites") Sites
    //- el-menu-item(index="parse") Parse
    //- el-menu-item(index="translations") Translates

    // logout
    el-menu-item(index="logout", @click="logout", style="float: right") Logout

</template>

<script>
export default {
  data() {
    return {
      activeIndex: 'sites',
      activeIndex2: 'sites',
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
    handleSelect(key) {
      const currentlyPath = this.$route.path;
      const newPath = `/${key}`;
      if (currentlyPath !== newPath) this.$router.push(newPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 300;
}
</style>
