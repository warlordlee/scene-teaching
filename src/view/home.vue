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
                imgData: [],//上传的图片数据
                caseUpload: false,//配置文件上传标记
                picUpload: false,//图片文件上传标记
                flag: false,
            };
        },
        methods: {
            //读取excel配置数据
            handlePreview(file) {
                home.readExcel(file, this)
            },
            //读取上传的图片数据（多选上传，多次触发）
            handlePicPreview(file) {
                //第一张图片上传事件触发后，延迟设置上传图片标记为true
                if (!this.flag) {
                    this.flag = true;
                    setTimeout(() => {
                        this.picUpload = true
                    }, 1000)
                }
                home.readPic(file, this)
            },
            //切换案例
            switchCase(){
                this.caseUpload = false;
                this.picUpload = false;
                this.caseIndex++ ;//案例索引自增
                home.makeCase(this);//根据当前案例数据生成案例
                home.matchImg(this);//当前案例数据匹配图片
            }
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
