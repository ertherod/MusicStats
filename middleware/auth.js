export default function ({ store, redirect }) {
  if (!store.state.connected) {
    redirect(`/login`)
  }
}
