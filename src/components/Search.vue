<template>
	<div class="search">
		<div class="container">
				<div class="search__wrapper">
					<label class="search__inner">
						<input 
							tabindex="1"
						 	@input="checkQuery"
							@focus="handleFocus"
							class="search__input"
							type="text"
							v-model="query"
							:class="{ incorrect : query && !tips && !focus }">
						<span class="search__placeholder" v-if="!query">Начните вводить код или название</span>
					</label>
					<div class="search__wrong search__variant" v-if="query && !tips && !focus">Выберите значение из&nbsp;списка</div>
					<div class="tips" v-if="dropdown">
						<div class="tips__loading search__variant" v-if="dropdown === 'loading'">
							<div class="tips__loading-icon">
								<svg id="icon-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
								  <path d="M745 42.8l-48.1 83.3c29.7 17.1 56.9 38.1 81.5 62.7C814.6 225 843 267.1 862.8 314c20.5 48.5 30.9 100 30.9 153.2 0 53.2-10.4 104.8-30.9 153.2-19.8 46.9-48.2 89-84.4 125.2s-78.3 64.6-125.2 84.4c-48.4 20.6-100 31-153.2 31s-104.8-10.4-153.2-30.9c-46.9-19.8-89-48.2-125.2-84.4s-64.6-78.3-84.4-125.2c-20.5-48.5-30.9-100-30.9-153.2 0-34.3 4.4-68.2 13-101 8.4-31.7 20.8-62.4 36.9-91.1 31.7-56.6 77.4-105.1 132.2-140 4.9-3.1 9.8-6.1 14.8-9L255 42.8c-6.3 3.6-12.4 7.4-18.5 11.2C100.3 141.1 10 293.6 10 467.2c0 270.6 219.4 490 490 490s490-219.4 490-490c0-181.3-98.5-339.7-245-424.4z" />
								</svg>  
							</div>	
							<span>Загрузка</span>
						</div>
						<div class="search__variant" v-if="dropdown === 'notfound'">Не&nbsp;найдено</div>
						<div class="" v-if="dropdown === 'error'">
							<div class="search__variant text text--size-xs text--color-gray">Что-то пошло не&nbsp;так. Проверьте соединение с&nbsp;интернетом и&nbsp;попробуйте еще раз</div>
							<div @click="checkQuery" tabindex="2" class="tips__reload search__variant">Обновить</div>
						</div>
						<ul class="tips__list" v-if="dropdown === 'tips'">
							<li class="tips__item" 
									v-for="(tip, i) in tips" 
									:data-item="i"
									:tabindex='i + 1'
									:class="[ i === activeTip ? 'is-active' : '']"
									@mouseover='removeClass'
									@click='chooseItem'>{{ tip['City'] }}</li>
						</ul>
						<div class="tips__amount search__variant" v-if="tipsAmount > 5">
							<span class="text text--size-xs text--color-gray">Показаны 5&nbsp;из {{ tipsAmount }} найденных городов. Уточните запрос, чтобы увидеть остальные</span>
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
				tips: null,
				activeTip: 0,
				dropdown: null,
				delay: null,
				tipsAmount: null,
				focus: false
			}
		},
		methods: {
			handleClick(e) {
			  var element = document.querySelector('.search__wrapper');
			  if (e.target !== element && !element.contains(e.target)) {
					this.handleBlur();
			  }
			},
			checkQuery() {
				if(!this.query) {
					this.dropdown = null;
					return
				};
				this.activeTip = 0;
				this.dropdown = 'loading';
				this.delay = Date.now();
			  this.$http.post('api/search', { data: this.query }, {
			    before(request) {
			      if(this.previousRequest) {
			        this.previousRequest.abort();
			      }
			      this.previousRequest = request;
			    }
			  }).then(
		    response => {
					this.checkDelay(response.body);
		    }).catch(err => {
					this.dropdown = 'error',
					this.tips = null;
		    });
			},
			chooseItem() {
				this.query = this.tips[this.activeTip]['City'];
				this.dropdown = null;
			},
			removeClass(e) {
				e.stopPropagation();
				this.activeTip = e.target.getAttribute('data-item');
			},
			checkDelay(data) {
				let time = Date.now();
				let delay = time - this.delay;  
				if(delay > 500 && delay < 1000) {
					setTimeout(() => {
						this.showTips(data);
					}, 1000 - delay);
				} else {
					this.showTips(data);
				};
			},
			showTips(val) {
				if(!val.length) { 
					this.tips = null;
					this.dropdown = 'notfound' 
					return
				};
				val.length > 5 ? this.tips = val.slice(0, 5) : this.tips = val;
				this.tipsAmount = val.length;
				this.dropdown = 'tips'; 
			},
			handleKeypress(e) {
				if(!this.tips) return;
				if((e.keyCode == 40 || e.keyCode == 9) && this.activeTip < this.tips.length - 1) {
					this.activeTip += 1;
				} else if(e.keyCode == 38 && this.activeTip > 0) {
					this.activeTip -= 1;
				}	else if(e.keyCode == 13) {
					this.chooseItem();
				} else if(e.keyCode == 27) {
					this.dropdown = null;
				} else return;
			},
			handleFocus(e) {
				this.focus = true;
				if(this.query) {
					document.querySelector(".search__input").select()
				}
			},
			handleBlur() {
				this.focus = false;
				if(!this.tips) {
					this.dropdown = null;
				} else if(this.tips && this.tips[this.activeTip]['City'].toLowerCase() === this.query.toLowerCase()) {
					this.chooseItem();
				} else {
					this.dropdown = null
					this.tips = null
				};
			}
		},
		created: function () {
		  window.addEventListener('keyup', this.handleKeypress);
		  window.addEventListener('click', this.handleClick);
		},
		watch: {
			dropdown: function(val) {
				if(val !== 'tips') {
					this.tipsAmount = null
				}
			}
		}
	}

</script>

<style lang="less">
	@blue: #4997d6;
	@red: #e0000d; 
	@gray: #acacac;
	@base-color: #404040; 
	@base-font: 'Segoe UI', Arial, Helvetica, sans-serif;

	body, html {
		font-size: 14px;
		font-family: @base-font;
		line-height: 1.428;
		color: @base-color;
	}
	.container {
		max-width: 700px;
		margin: 0 auto;
		width: 100%;
	}
	.text {
		font-size: 14px;
		font-family: @base-font;
		line-height: 1.428;
		font-weight: 400;
		&--size {
			&-xs {
				font-size: 12px;
			}
		}
		&--color {
			&-gray {
				color: @gray;
			}
		}
	}
	.search {
		&__wrapper {
			width: 280px;
		}
		&__inner {
			display: block;
			background: #fff;
			position: relative;
		}
		&__input {
			width: 100%;
			color: #404040;
			height: 34px;
			line-height: 1;
			border: 1px solid @gray;
			padding: 5px 10px 8px;
			font-family: @base-font;
			&.is-failed {
				outline: 2px solid @red;
			}
			&.incorrect {
				border: 2px solid @red;
			}
			&:focus {
				border: 2px solid @blue;
				outline: none;
				&.is-failed {
					outline: 2px solid @red;
				}
				&.incorrect {
					border: 2px solid @red;
				}
				+ .search__placeholder {
					opacity: .5;
				}
			}
		}
		&__placeholder {
			font-family: @base-font;
			background: transparent;
			display: block;
			position: absolute;
			white-space: nowrap;
			top: 7px;
			left: 12px;
			transition: opacity .2s linear;
		}
		&__variant {
			padding: 10px;
			font-family: @base-font;
		}
		&__wrong {
			text-align: left;
			color: @red;
			padding: 5px 3px 5px; 
		}
	}

	.tips {
		background: #fff;
		box-shadow: 0 0 15px rgba(0,0,0, .3);		
		text-align: left;
		&__list {
			padding: 5px 0;
		}
		&__item {
			font-family: @base-font;
			line-height: 34px;
			padding: 0 10px;
			cursor: pointer;
			user-select: none;
			outline: none;
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
			&-icon {
				width: 13px;
				height: 13px;
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