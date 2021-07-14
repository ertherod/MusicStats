<template>
  <footer class="text-lg-start bg-dark">
    <div class="p-2 container-md">
      <div class="row">
        <section
          class="
            d-flex
            justify-content-center justify-content-lg-between
            p-4
            border-bottom
            socials
          "
        >
          <div class="me-5 d-none d-lg-block">
            <span>{{ $t('footer.stay_connected') }}</span>
          </div>
          <div>
            <a href="" target="_blank" class="me-4 text-reset twitter">
              <fa-icon :icon="['fab', 'twitter']" class="icon" />
            </a>
            <a href="" target="_blank" class="me-4 text-reset instagram">
              <fa-icon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </section>
      </div>
      <div class="row mt-5">
        <div class="col-md-4 mx-auto mb-4">
          <h6 class="text-uppercase font-weight-bold mb-4">
            <fa-icon :icon="['fas', 'compact-disc']" /> MusicStats
          </h6>
          <p>{{ $t('footer.description') }}</p>
        </div>
        <div class="col-md-4 mx-auto mb-4">
          <h6 class="text-uppercase font-weight-bold mb-4">
            <fa-icon :icon="['fas', 'directions']" />
            {{ $t('footer.sections') }}
          </h6>
          <p>
            <b-link :to="localePath('/recently-played')">{{
              $t('footer.last_played_songs')
            }}</b-link>
          </p>
          <p>
            <b-link :to="localePath('/playlists/')">{{
              $t('footer.my_playlists')
            }}</b-link>
          </p>
          <p>
            <b-link :to="localePath('/tops/artists')">{{
              $t('footer.top_artists')
            }}</b-link>
          </p>
          <p>
            <b-link :to="localePath('/tops/tracks')">{{
              $t('footer.top_songs_global')
            }}</b-link>
          </p>
        </div>
        <div class="col-md-4 mx-auto mb-4">
          <h6 class="text-uppercase font-weight-bold mb-4">
            <fa-icon :icon="['fas', 'link']" /> {{ $t('footer.useful_links') }}
          </h6>
          <p>
            <a href="#" class="text-reset">{{ $t('footer.about') }}</a>
          </p>
          <p>
            <a href="#" class="text-reset">{{ $t('footer.help') }}</a>
          </p>
          <p>
            <a href="#" class="text-reset">{{ $t('footer.contact') }}</a>
          </p>
          <p>
            <a href="/settings" class="text-reset">{{
              $t('footer.settings')
            }}</a>
          </p>
        </div>
      </div>
    </div>
    <div class="text-center p-4">
      © 2021 Copyright:
      <b-link class="text-reset fw-bold" :to="localePath('/')"
        >MusicStats.net</b-link
      >
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style>
footer {
  width: 100%;
  position: sticky;
  top: 100%;
  padding: 1rem;
}
.socials {
  width: 100%;
}
.socials a {
  margin: 0 0.5em;
  font-size: x-large;
}

.twitter {
  color: #2d8fd3 !important;
}

.instagram {
  color: rgb(204, 0, 160) !important;
}
</style>
