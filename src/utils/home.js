import * as XLSX from "xlsx";

/**
 * describe: 制作当前案例动画
 * params: @data 当前案例数据 @vm 组件对象
 * date: 2022/3/14 0014
 * author: lhw
 */
function makeCase(data, vm) {
    vm.caseData = [];//清空当前案例数据
    let currentData = [...data.sheet];//拷贝案例数据
    currentData = currentData.slice(10);//去掉第一行表头 10为模板固定值
    let temp = {
        background: '',//场景背景
        pep: [],//场景对话人物名称
        text: [],//场景对话
        portrait: [],//场景人物立绘
        portraitPos: [],//场景人物立绘位置

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
                portrait: [],
                portraitPos: [],

            };
            return
        }
        //列名映射 key为excel表列名称
        let nameMap = {
            A: 'pep',//场景对话人物名称
            B: 'text',//场景对话
            T: 'portrait',//场景人物立绘
            U: 'portraitPos',//场景人物立绘位置
            W: 'background',//场景背景
        };
        //识别表列对应的数据 赋值到临时对象
        Object.keys(nameMap).forEach(key => {
            if (-1 !== item.indexOf(key)) {
                try {
                    let str = item.split('=')[1];//分割字符串
                    // eslint-disable-next-line no-useless-escape
                    if (-1 !== str.indexOf("\'")) {
                        str = str.slice(1)//去除可能存在的单引号
                    }
                    if (key === 'W') {
                        //场景背景单独处理
                        temp.background = str;
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
                    temp[nameMap[key]].push(str);
                } catch (e) {
                    console.error(e)
                }
            }
        });
        vm.caseUpload = true;
    });
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
                vm.caseData = {};
                makeCase(tab[vm.caseIndex], vm);//生成当前案例
            }
        }
    })
}


/**
 * describe: 读取图片
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

export default {
    readExcel,
    readPic
}
