<template>
  <div class="container-lg pb-5 pt-5">
    <b-card class="profile" :bg-variant="getTheme == 'dark' ? 'dark' : 'light'">
      <template #header>
        <span class="h2">{{ $t('pages.profile.title') }}</span>
      </template>
      <div v-if="getUserData">
        <b-row>
          <b-col md="4">
            <img
              v-if="getUserData.images && getUserData.images[0]"
              :src="getUserData.images[0].url"
              class="profile-pic"
            />
            <br />
          </b-col>
          <b-col md="8">
            <h4>{{ getUserData.display_name }}</h4>
            <br />
            <h6 v-if="getUserData.followers.total > 0">
              {{ getUserData.followers.total }}
              {{ $t('pages.profile.followers') }}
            </h6>
            <br />
            <h6 v-if="getUserData.product == 'premium'">
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
  computed: {
    ...mapGetters('userprofile', ['getUserData']),
    ...mapGetters(['getTheme']),
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
  width: 100%;
  object-fit: cover;
  border-radius: 2vh;
}

.profile {
  border-radius: 2vh;
  overflow: hidden;
}
</style>
