import * as XLSX from "xlsx";


/**
 * describe: 重置数据
 * params: @vm 组件对象
 * date: 2022/3/22 0022
 * author: lhw
 */
function reset(vm) {
    vm.caseIndex = 0;
    vm.excelData = [];
    vm.imgData = [];
    vm.caseUpload = false;
    vm.picUpload = false;
    vm.flag = false;
}

/**
 * describe: 制作当前案例动画
 * params: @vm 组件对象
 * date: 2022/3/14 0014
 * author: lhw
 */
function makeCase(vm) {
    vm.caseData = [];//清空当前案例数据
    if (!vm.excelData[vm.caseIndex]) {
        alert("没有更多案例了");
        reset(vm);
        return
    }
    let data = vm.excelData[vm.caseIndex];
    let currentData = [...data.sheet];//拷贝案例数据
    currentData = currentData.slice(10);//去掉第一行表头 9为模板表头列数量
    let temp = {
        background: '',//场景背景
        pep: [],//场景对话人物名称
        text: [],//场景对话
        portrait: [],//场景人物立绘
        size: [],//人物立绘大小
        portraitPos: [],//场景人物立绘位置
        type: '',//场景类型 （对话，问题，连线题，图片展示）

    };
    currentData.forEach(item => {
        //通过场景分隔符&识别场景数
        if (-1 !== item.indexOf("&")) {
            vm.caseData.push(temp);//该场景制作完毕,存入组件当前案例数据对象
            //重置临时对象
            temp = {
                background: '',
                pep: [],
                text: [],
                size: [],
                portrait: [],
                portraitPos: [],
                type: ''

            };
            return
        }
        //列名映射 key为excel表列名称
        let nameMap = {
            A: 'pep',//场景对话人物名称
            B: 'text',//场景对话
            T: 'portrait',//场景人物立绘
            U: 'portraitPos',//场景人物立绘位置
            X: 'background',//场景背景
            V: 'size',//人物立绘大小
            Y: 'type',//场景类型
        };
        //识别表列对应的数据 赋值到临时对象
        Object.keys(nameMap).forEach(key => {
            let reg = new RegExp("[" + key + "][0-9]+\\=", "g")
            if (item.match(reg)) {
                try {
                    let str = item.split('=')[1];//分割字符串
                    // eslint-disable-next-line no-useless-escape
                    if (-1 !== str.indexOf("\'")) {
                        str = str.slice(1)//去除可能存在的单引号
                    }
                    if (key === 'X' || key === 'Y') {
                        //场景背景和类型单独处理
                        temp[nameMap[key]] = str;
                        return
                    }
                    if ('B' === key || 'T' === key) {
                        //人物立绘和对话单独处理
                        temp[nameMap[key]].push({
                            value: str,
                            show: false
                        });
                        return;
                    }
                    //其他属性堆栈入数组
                    temp[nameMap[key]].push(str);
                } catch (e) {
                    console.error(e)
                }
            }
        });
    });
    vm.caseUpload = true;
    console.log(vm.caseData)
}

/**
 * describe: 读取excel数据
 * params: @file exlce文件对象 @vm 组件对象
 * date: 2022/3/11 0014
 * author: lhw
 */
function readExcel(file, vm) {
    //验证文件类型
    const types = file.name.split(".")[1];
    const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        item => item === types
    );
    if (!fileType) {
        alert("文件格式错误！请重新选择");
        return;
    }
    // eslint-disable-next-line no-unused-vars
    new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            this.wb = XLSX.read(data, {
                type: "binary"
            });
            const result = [];
            this.wb.SheetNames.forEach(sheetName => {
                result.push({
                    sheetName: sheetName,
                    sheet: XLSX.utils.sheet_to_formulae(this.wb.Sheets[sheetName])
                });
            });
            resolve(result);
        };
        reader.readAsBinaryString(file.raw);
    }).then(tab => {
        if (tab && tab.length > 0) {
            vm.excelData = tab;//保存excel数据
            if (tab.length !== 0) {
                makeCase(vm);//生成当前案例
            }
        }
    })
}


/**
 * describe: 读取并匹配图片
 * params: @file 图片文件对象 @vm 组件对象
 * date: 2022/3/14 0014
 * author: lhw
 */
function readPic(file, vm) {
    let picName = file.name.split('.')[0];//图片名称
    new Promise(function (resolve) {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file.raw);//获得图片URL
    }).then(data => {
        //图片数据保存
        vm.imgData.push({
            picName: picName,
            url: data
        });
        //图片匹配配置文件数据
        vm.caseData.forEach(c => {
            //匹配背景图
            if (c.background === picName) {
                c['background'] = data;
            }
            //匹配人物立绘
            c['portrait'].forEach((p, index) => {
                if (p.value === picName) {
                    c['portrait'][index]['value'] = data
                }
            })
        })
    });
}

/**
 * describe: 图片匹配配置文件数据
 * params: @vm 组件对象
 * date: 2022/3/22 0022
 * author: lhw
 */
function matchImg(vm) {
    vm.caseData.forEach(c => {
        vm.imgData.forEach(img => {
            //匹配背景图
            if (c.background === img.picName) {
                c['background'] = img.url;
            }
            //匹配人物立绘
            c['portrait'].forEach((p, index) => {
                if (p.value === img.picName) {
                    c['portrait'][index]['value'] = img.url
                }
            })
        })
    });
    setTimeout(()=>{
        vm.picUpload = true;
    },500)
}

/**
 * describe:
 * params: @scene 场景数据对象
 * date: 2022/3/22 0022
 * author: lhw
 */
export function forMatQuestion(scene, vm) {
    let json = eval('(' + scene.text[0].value + ')')//转换JSON格式
    console.log(json)
    let name = `<div class='name'>${scene.pep[0]}</div>`;//提问人
    let question = `<div class="dialog-question">${json.question}</div>`;//问题
    let option = `<div class="choices">`;//选项
    try {
        json.answer.forEach(item => {
            option += `<div class="choice-item" @click.stop="${() => {
                vm.handleAnswer(vm)
            }}">${item}</div>`
        })
    } catch (e) {
        console.error(e)
    }
    option += `<div>`;
    return name + question + option
}


/**
 * describe:
 * params: @vm 组件对象
 * date: 2022/3/22 0022
 * author: lhw
 */
export function handleScene(vm) {
    if (vm.stop) {
        return
    }
    if (vm.sceneIndex <= vm.caseData.length -1) {
        if (vm.index < vm.caseData[vm.sceneIndex].text.length - 1) {
            //切换场景内对话 和立绘
            vm.index++;
        } else {
            //场景索引自增，场景内索引归零 切换场景
            vm.index = 0;
            vm.sceneIndex++;
            if(vm.sceneIndex === vm.caseData.length){
                vm.sceneIndex = 0;
                vm.index = 0;
                vm.$parent.switchCase();
                return;
            }
        }
        refresh(vm)
    }
}

/**
 * describe: 页面翻页刷新
 * params: @vm 组件对象
 * date: 2022/3/22 0022
 * author: lhw
 */
export function refresh(vm) {
    vm.caseData[vm.sceneIndex].text.forEach((t, index) => {
        t.show = index === vm.index
    });
    vm.caseData[vm.sceneIndex].portrait.forEach((p, index) => {
        p.show = index === vm.index
    });
}

/**
 * describe: 用户答题事件
 * params: @scene 场景数据对象 @sel 选择的答案 @vm组件对象
 * date: 2022/3/22 0022
 * author: lhw
 */
export function handleAnswer(scene, sel, vm) {
   let json = eval('(' + scene.text[0].value + ')');
    vm.correct = sel === json.rightAnswer;
    vm.dialogVisible = true
}

export default {
    readExcel,
    readPic,
    matchImg,
    makeCase,
    forMatQuestion
}
