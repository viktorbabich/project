<template></template>

<script>
	import data from '@/store/kladr.json';

	export default {
		name: 'server',
		props: ['query'],
		data() {
			return {
				data: data
			}
		},
		methods: {
			checkQuery(query) {
				let result = this.data.filter(
			    item => {
			    	// let nQuery = query.replace(/([\\()])/, '\\$1')
			    	let nQuery = query;
			    	let regex = new RegExp(`(^("|')?${nQuery})|(\\s("|')?${nQuery})|((-|\\()${nQuery})`, 'gi');
			    	return regex.test(item['City'])
			    }
				);
				// setTimeout(()=> {
					this.$emit('sendResult', result);
				// }, 1000);
			},
		},
		watch: {
			query: function(val) {
				this.checkQuery(val);
			}
		}
	}
</script>

