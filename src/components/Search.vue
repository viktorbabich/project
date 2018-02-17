<template>
	<div class="search">
		<div class="container">
			<div class="search__wrapper">
				<div class="search__wrapper">
					<label class="search__inner">

						<input @keyup="checkQuery" 
						
									class="search__input"
									type="text"
									v-model="query"
									:class="{ 'is-failed' : searchFailed }">
						<span class="search__placeholder" v-if="!query">Начните вводить код или название</span>
					</label>
					<div class="tips" v-if="query">
						<div class="tips__loading" v-if="loading"></div>
						<ul class="tips__list">
							<li class="tips__item" 
									v-for="(tip, i) in tips" 
									:class="[ i === 0 && lightItem ? 'is-active' : '']"
									@mouseover='removeClass'
									@click='setChoice(tip)'>{{ tip }}</li>
						</ul>
					</div>
				</div>
			</div>	
		</div>
	</div>

</template>

<script>
	export default {
		name: 'Search',
		data() {
			return {
				query: '',
				tips: ['Январь', 'Февраль', 'Март', 'Апрель'],
				loading: false,
				searchFailed: false,
				lightItem: true
			}
		},
		methods: {
			checkTarget(e) {
				e.stopPropagation();
				let searchBox = document.querySelector('.search__input');
				if(e.target != searchBox) {
					console.log(1)
				} else console.log(2)
			},
			checkQuery() {
				this.$emit('checkQuery', this.query);
			},
			setChoice(tip) {
				this.query = tip;
				this.tips = null;
			},
			removeClass() {

			},
			removeClass() {
				this.lightItem = false
			}
		},
		mounted() {
			window.addEventListener('click', this.checkTarget);
		}
	}

</script>

<style lang="less">
	@blue: #4997d6;
	@red: #e0000d; 

	body, html {
		font-size: 14px;
		font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
		line-height: 1.428;
	}
	.container {
		max-width: 700px;
		margin: 0 auto;
		width: 100%;
	}
	.search {
		&__wrapper {
			width: 300px;
		}
		&__inner {
			display: block;
			background: #fff;
			position: relative;
		}
		&__input {
			width: 100%;
			color: #404040;
			line-height: 25px;
			height: 25px;
			border: none;
			border: 1px solid rgba(0,0,0, .3);
			padding: 0 10px;
			&.is-failed {
				outline: 2px solid @red;
			}
			&:focus {
				outline: 2px solid @blue;
				&.is-failed {
					outline: 2px solid @red;
				}
				+ .search__placeholder {
					opacity: .5;
				}
			}
		}
		&__placeholder {
			background: transparent;
			display: block;
			line-height: 25px;
			position: absolute;
			white-space: nowrap;
			top: 0;
			left: 10px;
			transition: opacity .2s linear;
		}
	}

	.tips {
		background: #fff;
		box-shadow: 0 0 15px rgba(0,0,0, .3);		
		text-align: left;
		padding: 5px 0;
		&__item {
			line-height: 34px;
			padding: 0 10px;
			cursor: pointer;
			user-select: none;
			&:hover {
				background: @blue;
				color: #fff;
			}
			&.is-active {
				background: @blue;
				color: #fff;
			}
		}
	}

</style>