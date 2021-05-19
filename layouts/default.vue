<template>
  <div>
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Footer from '~/components/layout/Footer.vue'
import Header from '~/components/layout/Header.vue'

export default {
  name: 'Layout',
  components: { Header, Footer },
  head() {
    return {
      bodyAttrs: {
        class: `${this.getTheme === 'dark' ? 'body-dark' : 'body-light'}`,
      },
    }
  },
  computed: {
    ...mapGetters(['getTheme']),
  },
}
</script>

<style>
html {
  font-family: 'Arvo';
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.body-dark {
  background-color: #50555c;
  color: rgb(250, 250, 250);
}

.body-light {
  background-color: rgb(221, 231, 238);
  color: #2d8fd3;
}

.body-light .container-lg {
  background-color: rgb(221, 231, 238);
  height: 100%;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
