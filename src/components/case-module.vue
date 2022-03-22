<template>
    <div class="full">
        <template v-for="(scene,index) in caseData">
            <!--仅当前场景可见-->
            <div class="full" :key="'scene'+index" v-show="index === sceneIndex">
                <!--背景图-->
                <img class="bg" :src="scene.background" alt="" @click="handleScene(vm)">
                <!--对话框-->
                <div class="dialog">
                    <!--场景对话-->
                    <div v-if="'对话'===scene.type" @click="handleScene(vm)">
                        <template v-for="(t,ord) in scene.text">
                            <p :key="'text'+ord" v-show="t.show" class="dialog-text">
                                <span class="name">{{scene.pep[ord]}}</span>
                                <span>{{':'+ t.value}}</span>
                            </p>
                        </template>
                    </div>
                    <!--提问场景-->
                    <div v-if="'问题'===scene.type">
                        <div class="dialog-text">
                            <div class='name'>{{scene.pep[0]}}</div>
                            <div class="dialog-question">
                                {{formatQuestion(scene.text[0].value).question}}
                            </div>
                            <div class="choices">
                                <div v-for="(item,index) in formatQuestion(scene.text[0].value).answer"
                                     :key="'answer'+index" @click="handleAnswer(scene,item,vm)" class="choice-item">
                                    {{item}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--连线题场景-->
                </div>
                <!--人物立绘-->
                <template v-for="(p,j) in scene.portrait">
                    <img :key="'pic'+j" v-show="p.show" :src="p.value" class="pep" alt=""
                         :class="[getPos(scene.portraitPos[j]), scene.size[j]]">
                </template>
            </div>
        </template>
        <!--答题提示框-->
        <el-dialog
                :visible.sync="dialogVisible"
                center
                width="30%">
            <span>{{correct?'恭喜你答对了！':'很遗憾答错了'}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goOn" v-if="correct">确 定</el-button>
                <el-button type="primary" @click="dialogVisible = false" v-else>继续回答</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {forMatQuestion, handleScene, handleAnswer, refresh} from '../utils/home'

    export default {
        name: "case-module",
        props: ['caseData'],//当前案例数据
        data() {
            return {
                index: 0,//场景内索引
                sceneIndex: 0,//场景索引
                stop: false,//翻页阻塞
                forMatQuestion: forMatQuestion,
                handleScene: handleScene,//场景翻页方法
                handleAnswer: handleAnswer,//答题事件
                vm: this,
                correct: false,//用户是否答对
                dialogVisible: false
            }
        },
        created() {
            console.log(this.caseData);
            refresh(this)
        },
        methods: {
            getPos(pos) {
                return 'left' === pos ? 'pep-left' : 'right' === pos ? 'pep-right' : ''
            },
            formatQuestion(str) {
                return eval('(' + str + ')')
            },
            goOn() {
                //答对后翻页
                this.dialogVisible = false;
                handleScene(this);
                this.correct = false
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
        width: 280px;
        bottom: 0;
        left: 44%;
    }

    .big {
        height: 100%;
    }

    .mid {
        height: 80%;
    }

    .small {
        height: 450px;
        width: 225px;
    }

    .pep-left {
        left: 30px;
    }

    .pep-right {
        left: auto;
        right: 30px;
    }
</style>
