<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- tabbar -->
    <TabBar></TabBar>
  </div>
</template>
<script>
import '@/utils/service' //解决引入stroe undefind问题。
import TabBar from '@/components/TabBar'
export default {
  name: 'App',
  components: {
    TabBar
  }
}
</script>
