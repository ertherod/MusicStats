<template>
  <div class="container-lg pb-5 pt-5">
    <b-card class="profile" bg-variant="dark">
      <template #header>
        <span class="h2">{{ $t('pages.profile.title') }}</span>
      </template>
      <div v-if="getUserData">
        <b-row>
          <b-col md="3" class="my-2">
            <b-row align-h="center">
              <img
                v-if="getUserData.images && getUserData.images[0]"
                :src="getUserData.images[0].url"
                class="profile-pic"
              />
              <br />
            </b-row>
          </b-col>
          <b-col md="9">
            <h4>{{ getUserData.display_name }}</h4>
            <br />
            <h6 v-if="getUserData && getUserData.followers.total > 0">
              {{ getUserData.followers.total }}
              {{ $t('pages.profile.followers') }}
            </h6>
            <br />
            <h6 v-if="getUserData && getUserData.product == 'premium'">
              {{ $t('pages.profile.premium_account') }}
            </h6>
            <h6 v-else>
              {{ $t('pages.profile.free_account') }}
            </h6>
            <h6>{{ countryCode(getUserData.country) }}</h6>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getName } from 'country-list'

export default {
  name: 'ProfilePage',
  middleware: 'auth',
  computed: {
    ...mapGetters('userprofile', ['getUserData']),
  },
  methods: {
    countryCode(code) {
      return getName(code.toString())
    },
  },
}
</script>

<style>
.profile-pic {
  width: 20vh;
  height: 20vh;
  object-fit: cover;
}

.profile {
  overflow: hidden;
}
</style>
