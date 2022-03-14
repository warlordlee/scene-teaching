<template>
    <div class="nav-bar">
        <i class="iconfont iconzhilingpeizhi"></i>
        <ul class="menu">
            <li>
                <el-upload
                        class="upload-demo"
                        action=""
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="importExcel">
                    <a title="导入配置">
                        <i class="iconfont iconwenben"></i>
                    </a>
                </el-upload>
            </li>
            <li>
                <el-upload
                        action=""
                        :on-change="importPic"
                        :auto-upload="false"
                        :show-file-list="false"
                        :multiple="true">
                    <a href="javascript:void(0)" title="导入图片">
                        <i class="iconfont icontupian"></i>
                    </a>
                </el-upload>

            </li>
            <li>
                <a href="javascript:void(0)" title="导入音频">
                    <i class="iconfont iconyinle"></i>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)"></a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "menu",
        methods:{
            importExcel(file){
                this.$parent.handlePreview(file)
            },
            importPic(file){
                this.$parent.handlePicPreview(file)
            }
        }
    }
</script>

<style scoped lang="less">
    .nav-bar {
        width: 50px;
        height: 50px;
        line-height: 50px;
        position: relative;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        color: #0F9097;
        transition: 0.24s 0.2s;
        transform: translate3d(0, 0, 0);

        .iconzhilingpeizhi {
            font-size: 34px;
        }
    }

    .nav-bar .menu {
        list-style: none;
        padding: 0;
        margin: 0;
        position: absolute;
        top: -10px;
        left: -10px;
        border: 20px solid transparent;
        cursor: default;
        border-radius: 50%;
        transform: scale(0);
        transition: transform 1.4s 0.07s;
        z-index: -1;
    }

    .nav-bar:hover .menu {
        transition: transform 0.4s 0.08s, z-index 0s 0.5s;
        transform: scale(1);
        z-index: 1;
    }

    .nav-bar .menu li {
        position: absolute;
        top: -50px;
        left: -50px;
        transform-origin: 88px 88px;
        transition: all 0.5s 0.1s;
    }

    .nav-bar:hover .menu li {
        transition: all 0.6s;
    }

    .nav-bar .menu li a {
        width: 45px;
        height: 45px;
        line-height: 45px;
        border-radius: 50%;
        background: #0F9097;
        position: absolute;
        transition: 0.6s;
        color: #e5e5e5;

        .iconfont {
            font-size: 22px;
        }
    }

    .nav-bar:hover .menu li:nth-child(1) {
        transition-delay: 0.02s;
        transform: rotate(105deg);
    }

    .nav-bar:hover .menu li:nth-child(1) a {
        transition-delay: 0.04s;
        transform: rotate(-105deg);
    }

    .nav-bar:hover .menu li:nth-child(2) {
        transition-delay: 0.04s;
        transform: rotate(145deg);
    }

    .nav-bar:hover .menu li:nth-child(2) a {
        transition-delay: 0.08s;
        transform: rotate(-145deg);
    }

    .nav-bar:hover .menu li:nth-child(3) {
        transition-delay: 0.06s;
        transform: rotate(185deg);
    }

    .nav-bar:hover .menu li:nth-child(3) a {
        transition-delay: 0.12s;
        transform: rotate(-185deg);
    }

    .nav-bar:hover .menu li:nth-child(4) {
        transition-delay: 0.08s;
        transform: rotate(225deg);
    }

    .nav-bar:hover .menu li:nth-child(4) a {
        transition-delay: 0.16s;
    }

</style>
