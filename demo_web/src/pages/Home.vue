<template>
	<div class="home">
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<Carousel v-model="current" loop>
			<CarouselItem v-for="b of banners" :key="b.url">
				<div
					class="demo-carousel"
					:style="{ backgroundImage: `url(${b.url})`, backgroundColor: `${b.background}` }"
				></div>
			</CarouselItem>
		</Carousel>
	</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
	name: 'Home',
	components: {
		// HelloWorld,
	},
	data() {
		return {
			value: [30, 70],
			current: 0,
			banners: [
				{
					url:
						'https://wid.s3.cn-north-1.amazonaws.com.cn/uploads/images/2020-03-23/%E7%96%AB%E6%83%85_%E9%A6%96%E9%A1%B5banner_%E4%B8%AD%E5%9B%BD%E5%8A%A0%E6%B2%B9-624276.png',
					background: '#920910',
				},
				{
					url: 'https://wid.s3.cn-north-1.amazonaws.com.cn/uploads/images/2020-04-13/banner1-856036.jpg',
					background: '#01489e',
				},
				{
					url:
						'https://wid.s3.cn-north-1.amazonaws.com.cn/uploads/images/2020-03-19/%E5%AE%98%E7%BD%91%E9%A6%96%E9%A1%B5banner-168837.png',
					background: '#3c23a3',
				},
			],
		};
	},

	methods: {},
};
</script>

<style lang="scss" scoped>
.home {
	/deep/ .ivu-carousel-active {
		button {
			background: #fff;
		}
	}

	// // 或者
	// ::v-deep .ivu-carousel-active {
	// 	button {
	// 		background: #ff0000;
	// 	}
	// }
}

.demo-carousel {
	height: 520px;
	background-color: lighten($color: green, $amount: 65);
	background-position: 50%;
	background-repeat: no-repeat;
	background-size: contain;
}
</style>
