<template>
  <div id="app">
    <Search @checkQuery='checkQuery'/>
    <Server :query="query"/> 
  </div>
</template>

<script>

import Search from '@/components/Search';
import Server from '@/components/Server';
import '@/store/kladr.json'

export default {
  name: 'App',
  data() {
    return {
      query: null
    }
  },
  methods: {
    checkQuery(a) {
      this.query = a;
    }
  },
  components: { Search, Server }
}
</script>

<style>

@import 'less/reset.less';
@import 'less/defaults.less';


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
