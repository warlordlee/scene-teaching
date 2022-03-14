<template>
    <div class="main">
        <el-row class="mg-bot">
            <el-col>
                <el-upload
                        class="upload-demo"
                        action=""
                        :on-change="handlePreview"
                        multiple
                        :limit="3"
                        :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-row class="mg-bot">
            <el-col>
                <el-upload
                        action=""
                        :on-error="handlePicsChange"
                        :multiple="true">
                    <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-row class="mg-bot">
            <template v-for="(pic,index) in picList">
                <el-col :key="'pic'+index" :span="4">
                    <img :src="handlePicPreview(pic)" alt="" class="img-style">
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-col>
                <img :src="imageUrl" class="img-style">
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import * as XLSX from 'xlsx';
    export default {
        name: "home",
        components: {},
        mounted() {
        },
        data() {
            return {
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
    .mg-bot{
        margin-bottom: 15px;
    }
    .img-style{
        width: 200px;
        height: 200px;
    }
</style>
