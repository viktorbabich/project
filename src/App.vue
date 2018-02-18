<template>
  <div id="app">
    <Search 
    :result='result'
    @checkQuery='checkQuery'
    />
    <Server 
    :query='query'
    :result='result'
    @sendResult='sendResult'
    /> 
  </div>
</template>

<script>

import Search from '@/components/Search';
import Server from '@/components/Server';

export default {
  name: 'App',
  data() {
    return {
      query: null,
      result: null
    }
  },
  methods: {
    checkQuery(query) {
      this.query = query;
    },
    sendResult(result) {
      this.result = result;
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
