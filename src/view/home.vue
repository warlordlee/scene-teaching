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
    import * as XLSX from 'xlsx';
    export default {
        name: "home",
        components: {
            settingMenu
        },
        data() {
            return {
                index: 0,
                fileList: [],
                picList:[],
                xlscList:[],
                imageUrl: '',
                dialogVisible: false
            };
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            //读取excel文件内容
            readExcel(file){
                // eslint-disable-next-line no-unused-vars
                return new Promise(function(resolve, reject) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
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
                });
            },
            //读取图片
            readPic(file){
                return new Promise(function(resolve) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(file.raw);
                });
            },
            handlePreview(file) {
                //验证文件类型
                const types = file.name.split(".")[1];
                const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
                    item => item === types
                );
                if (!fileType) {
                    alert("文件格式错误！请重新选择");
                    return;
                }
                this.readExcel(file).then(tab => {
                    console.log(tab)
                    if (tab && tab.length > 0) {
                        this.tab = tab;
                        if (this.tab.length !== 0) {
                            this.xlscList = [];
                            this.tab[0].sheet.forEach(item => {
                                if (item.indexOf("C") !== -1) {
                                    let inputInfo = item.split("'");
                                    if (inputInfo.length === 2) {
                                        this.xlscList.push(inputInfo[1]);
                                    }
                                }
                            });
                        }
                    }
                });
            },
            handlePicPreview(file){
                let vm = this;
                this.readPic(file).then(data=>{
                    vm.imageUrl = data
                    return data
                })
            },
            handlePicsChange(err,file){
                this.picList.push(file)
            },
        },
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
