<template>
	<div class="search">
		<div class="container">
				<div class="search__wrapper">
					<label class="search__inner">
						<input 
							@keyup.prevent=''
						 	@input="checkQuery"
							class="search__input"
							type="text"
							v-model="query"
							:class="{ 'is-failed' : searchFailed }">
						<span class="search__placeholder" v-if="!query">Начните вводить код или название</span>
					</label>
					<div class="tips" v-if="dropdown">
						<div class="tips__loading" v-if="dropdown === 'loading'">
							<div class="tips__loading-icon">
								<svg id="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
								  <path d="M745 42.8l-48.1 83.3c29.7 17.1 56.9 38.1 81.5 62.7C814.6 225 843 267.1 862.8 314c20.5 48.5 30.9 100 30.9 153.2 0 53.2-10.4 104.8-30.9 153.2-19.8 46.9-48.2 89-84.4 125.2s-78.3 64.6-125.2 84.4c-48.4 20.6-100 31-153.2 31s-104.8-10.4-153.2-30.9c-46.9-19.8-89-48.2-125.2-84.4s-64.6-78.3-84.4-125.2c-20.5-48.5-30.9-100-30.9-153.2 0-34.3 4.4-68.2 13-101 8.4-31.7 20.8-62.4 36.9-91.1 31.7-56.6 77.4-105.1 132.2-140 4.9-3.1 9.8-6.1 14.8-9L255 42.8c-6.3 3.6-12.4 7.4-18.5 11.2C100.3 141.1 10 293.6 10 467.2c0 270.6 219.4 490 490 490s490-219.4 490-490c0-181.3-98.5-339.7-245-424.4z" />
								</svg>  
							</div>	
							<span>Загрузка</span>
						</div>
						<div class="" v-if="dropdown === 'notfound'">Не найдено</div>
						<div class="" v-if="dropdown === 'error'">
							<div>Что-то пошло не&nbsp;так. Проверьте соединение с&nbsp;интернетом и&nbsp;попробуйте еще раз</div>
							<div @click="checkQuery" class="tips__reload">Обновить</div>
						</div>
						<ul class="tips__list" v-if="dropdown === 'tips'">
							<li class="tips__item" 
									v-for="(tip, i) in tips" 
									:class="[ i === activeTip && lightItem ? 'is-active' : '']"
									@mouseover='removeClass'
									@click='setChoice(tip)'>{{ tip['City'] }}</li>
						</ul>
						<div class="tips__amount" v-if="tipsAmount > 5">
							<span>Показаны 5&nbsp;из {{ tipsAmount }} найденных городов. Уточните запрос, чтобы увидеть остальные</span>
						</div>	
					</div>
				</div>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'Search',
		props: ['result'],
		data() {
			return {
				query: '',
				tips: null,
				loading: false,
				searchFailed: false,
				lightItem: true,
				activeTip: 0,
				warning: null,
				dropdown: null,
				delay: null,
				tipsAmount: null
			}
		},
		methods: {
			test() {

			},
			checkTarget(e) {
				e.stopPropagation();
				let searchBox = document.querySelector('.search__input');
				// if(e.target != searchBox) {
				// 	console.log(1)
				// } else console.log(2)
			},
			checkQuery() {
				if(!this.query) {
					this.dropdown = null;
					return
				};
				this.dropdown = 'loading';
				this.delay = Date.now();
				this.$emit('checkQuery', this.query);
			},
			setChoice(tip) {
				this.query = tip['City'];
				this.dropdown = null;
			},
			removeClass() {
				this.lightItem = false
			},
			showTips(val) {
				if(!val.length) { 
					this.tips = null;
					this.dropdown = 'notfound' 
					return
				};
				if(val.length > 5) {
					let slicedResult = val.slice(0, 5);
					this.tips = slicedResult;
				} else {
					this.tips = val;
				};
				this.tipsAmount = val.length;
				this.dropdown = 'tips'; 
			},
			handleKeypress(e) {
				console.log(e.keyCode)
				if(!this.tips) return;
				if(e.keyCode == 40 && this.activeTip < this.tips.length - 1) {
					this.activeTip += 1;
				} else if(e.keyCode == 38 && this.activeTip > 0) {
					this.activeTip -= 1;
				}	else if(e.keyCode == 13) {
					this.query = this.tips[this.activeTip]['City'];
					this.dropdown = null;
				} else return;
			}
		},
		created: function () {
		  window.addEventListener('keyup', this.handleKeypress)
		},
		mounted() {
			window.addEventListener('click', this.checkTarget);
		},
		watch: {
			result: function(val) {
				let time = Date.now();
				let delay = time - this.delay;  
				if(delay > 500 && delay < 1000) {
					setTimeout(() => {
						this.showTips(val);
					}, 1000 - delay);
				} else {
					this.showTips(val);
				};
			}
		}
	}

</script>

<style lang="less">
	@blue: #4997d6;
	@red: #e0000d; 
	@gray: #acacac;

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
		&__reload {
			background: @blue;
			color: #fff;
			cursor: pointer;
		}
		&__loading {
			padding: 0 10px;
			&-icon {
				width: 15px;
				height: 15px;
				animation: spin 1s linear infinite;
				display: inline-block;
				vertical-align: middle;
				+ span {
					vertical-align: middle;
					display: inline-block;
					margin-left: 5px;
				}
				svg {
					width: 100%;
					height: 100%;
					fill: @gray;
				}
				@keyframes spin {
					from {
						transform: rotateZ(0)
					}
					to {
						transform: rotateZ(360deg)
					}
				}
			}
		}
	}


</style>