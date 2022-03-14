<template>
    <div class="main">
        <div class="menu-container">
            <!--配置菜单-->
            <setting-menu></setting-menu>
        </div>
        <div class="content-container">
            <!--案例模型-->
            <case-module :caseData="caseData" v-if="caseUpload && picUpload"></case-module>
        </div>
    </div>
</template>

<script>
    import settingMenu from '@/components/menu'
    import home from "@/utils/home";
    import caseModule from '@/components/case-module'

    export default {
        name: "home",
        components: {
            settingMenu,
            caseModule
        },
        data() {
            return {
                caseIndex: 0, //案例索引
                excelData: [],//配置文件数据
                caseData: [],//当前案例数据
                imgData: [],
                fileList: [],
                picList: [],
                caseUpload: false,
                picUpload: false,
                flag: false
            };
        },
        methods: {
            handlePreview(file) {
                home.readExcel(file, this)
            },
            handlePicPreview(file) {
                if (!this.flag) {
                    this.flag = true;
                    setTimeout(() => {
                        this.picUpload = true
                    }, 1000)
                }
                home.readPic(file, this)
            },
        },
    }
</script>

<style scoped lang="less">
    .main {
        background-color: rgba(9, 17, 28, 0.9);
    }

    .menu-container {
        position: absolute;
        left: 30px;
        top: 30px;
        padding: 20px;
        z-index: 100;
    }

    .content-container {
        width: 98%;
        height: 95%;
        margin: 1% auto;
        border: 2px solid rgba(54, 141, 215, 0.7);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(84, 200, 229, 0.7);
    }
</style>
