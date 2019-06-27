
<template>
    <div id="app" style="width:100%;">
        <!--缓存页面-->
        <router-view v-if="!$route.meta.keep" />
        <keep-alive>
            <router-view v-if="$route.meta.keep" />
        </keep-alive>
    </div>
</template>

<script>
    export default {
        created() {
            let a = "1";
            
        },
        components: {
        }
    };
</script>

<style lang="less" scoped>
	#app{
		
	}
</style>