<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  // created() {
  //   const api = `${process.env.APIPATH}/api/${process.env.API}/products`;
  //   // const api = 'https://randomuser.me/api/';
  //   console.log(process.env.APIPATH, process.env.API);
  //   this.$http.get(api).then((response) => {
  //     console.log(response.data);
  //   });
  // }
}
</script>

<style lang="scss">
  @import "./assets/all";
</style>
