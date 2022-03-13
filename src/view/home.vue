<template>
    <div class="main">
        <div class="menu-container">
            <setting-menu></setting-menu>
        </div>
        <div class="content-container"></div>
    </div>
</template>

<script>
    import settingMenu from '../components/menu'
    export default {
        name: "home",
        components: {
            settingMenu
        },
        data() {
            return {
                index: 0,
            }
        },
        methods: {
        }
    }
</script>

<style scoped lang="less">
    .main{
       background-color: rgba(9,17,28,0.9);
    }
    .menu-container{
        position: absolute;
        left: 30px;
        top: 30px;
        padding: 20px;
        z-index: 100;
    }
    .content-container{
        width: 98%;
        height: 95%;
        margin: 1% auto;
        border: 2px solid rgba(54,141,215,0.7);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(84, 200, 229, 0.7);
    }
</style>
