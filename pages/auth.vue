<template>
  <div class="container-lg"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Auth',
  computed: {
    ...mapGetters('auth', ['getPKCE', 'getSecret']),
  },
  async mounted() {
    if (this.$route.query.state === this.getSecret && this.$route.query.code) {
      const logged = await this.requestToken(this.$route.query.code)
      if (logged) {
        this.$router.push(this.localePath('/'))
      } else {
        this.$router.push(this.localePath('/'))
      }
    } else {
      this.$router.push(this.localePath('/error'))
    }
  },
  methods: {
    ...mapActions('auth', ['requestToken']),
  },
}
</script>

<style></style>
