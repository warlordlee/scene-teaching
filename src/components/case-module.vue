<template>
    <div class="full">
        <template v-for="(scene,index) in caseData">
            <!--仅当前场景可见-->
            <div class="full" :key="'scene'+index" v-show="index === sceneIndex">
                <!--背景图-->
                <img class="bg" :src="scene.background" alt="" @click="handleScene">
                <!--对话框-->
                <div class="dialog" @click="handleScene">
                    <template v-for="(t,ord) in scene.text">
                        <p :key="'text'+ord" v-show="t.show">
                            {{scene.pep[ord] + ':'+ t.value}}
                        </p>
                    </template>
                </div>
                <!--人物立绘-->
                <template v-for="(p,j) in scene.portrait">
                    <img :key="'pic'+j" v-show="p.show" :src="p.value" class="pep" alt=""
                         :class="getPos(scene.portraitPos[j])">
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "case-module",
        props: ['caseData'],//当前案例数据
        data() {
            return {
                index: 0,//场景内索引
                sceneIndex: 0,//场景索引
            }
        },
        created() {
            console.log(this.caseData);
            this.refresh()
        },
        methods: {
            getPos(pos) {
                return 'left' === pos ? 'pep-left' : 'right' === pos ? 'pep-right' : ''
            },
            refresh(){
                this.caseData[this.sceneIndex].text.forEach((t, index) => {
                    t.show = index === this.index
                });
                this.caseData[this.sceneIndex].portrait.forEach((p, index) => {
                    p.show = index === this.index
                });
            },
            handleScene() {
                if (this.sceneIndex < this.caseData.length - 1) {
                    if (this.index < this.caseData[this.sceneIndex].text.length - 1) {
                        //切换场景内对话 和立绘
                        this.index++;
                        this.refresh()
                    } else {
                        //场景索引自增，场景内索引归零 切换场景
                        this.index = 0;
                        this.sceneIndex++;
                        this.refresh()
                    }
                } else {
                    alert('切换案例')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .full {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .bg {
        position: absolute;
        width: 99%;
        height: 99%;
        left: 0.5%;
        top: 0.5%;
        z-index: 0;
    }

    .dialog {
        position: absolute;
        background-color: rgba(166, 166, 166, 0.8);
        bottom: 10px;
        left: 15px;
        right: 15px;
        height: 150px;
        border-radius: 3px;
        text-align: left;
        text-indent: 25px;
    }

    .pep {
        position: absolute;
        z-index: 200;
        width: 180px;
        height: 415px;
        bottom: 25px;
    }

    .pep-left {
        left: 30px;
    }

    .pep-right {
        right: 30px;
    }
</style>
