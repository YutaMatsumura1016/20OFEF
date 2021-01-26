let vueApp = new Vue({
    el: '#app',
    data: {
        isMenuOpen: false,
        isHttpReq: false,
        csvCols: [],
        csvData: [],
        allCsvData: [],
        selectedCol1: null,
        selectedCol2: null,
        selectedCol3: null,
        searchKeyword1: null,
        searchKeyword2: null,
        searchKeyword3: null,
        csvPathList: [{csvPath: 'OFEF歴認2020.csv'}]
    },

    methods: {

        //csvファイルの読み込み
        OpenDialog: function (csvEv) {
            let file = csvEv.target.files[0];
            let reader = new FileReader();
            let vueThis = this;
            reader.onload = function (inputCsv) {
                const res = inputCsv.target.result;
                vueThis.ConvertCsv(res);
            }
            reader.readAsText(file, "Shift_JIS");
        },

        //csvをHTTPで読む
        RequestCsvPath: function (csvPath) {
            const vueThis = this;
            new Promise((resolve, reject) => {
                var httpReq = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成、サーバと非同期通信するためのAPI
                httpReq.open("get", csvPath, true); // アクセスするファイルを指定
                httpReq.overrideMimeType('text/plain; charset=Shift_JIS');
                httpReq.onload = () => {
                    resolve(vueThis.ConvertCsv(httpReq.responseText));
                };
                httpReq.onerror = () => {
                    reject(new Error(httpReq.statusText));
                };
                httpReq.send(null); // HTTPリクエストの発行
            });
        },
        
        ConvertCsv: function (csvData) {
            const vueThis = this;
            Papa.parse(csvData, {
                complete: function (results) {
                    vueThis.csvCols = results.data[0];
                    vueThis.csvData = results.data.slice(1);
                    vueThis.allCsvData = results.data.slice(1);
                }
            });
        },


        //検索ボックスの中身を精査
        kensaku: function () {

            //Box1にのみ値がある場合
            if(!this.searchKeyword2){
                this.SearchWord2();

            //Box1と2に値がある場合
            }else if(!this.searchKeyword3){
                this.SearchWord3();

            //全てのBoxに値がある場合
            }else{
                this.SearchWord();
            }
        },


        //検索
        SearchWord2: function () {

            var vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex1 = vueThis.csvCols.indexOf(vueThis.selectedCol1);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex1]){
                    return false;
                }
                if(item[colIndex1].includes(vueThis.searchKeyword1)) {
                    return true;
                }  
            });//csvData定義終わり

            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                window.open(linkData[row -1][2], '_blank');
            });



            // .kekkaTable{
            //     width: 100%;
            //     margin: 0px;
            //     color: #000000;
            //     background-color: #ffffffb9;
            //     text-align: center;
            //     border: 1px;
            //     border-collapse: collapse;
            //     font-family: 'Noto Sans JP', sans-serif;
            //     font-weight: 300;
            //     table-layout: auto;
            // }



             //検索結果を表示する
            $(function() {
                    $('.kensakusita').css("display", "block");
                });
            $(function() {
                $('#hitsu').css("display", "block");
            });   

        },//SearchWord2終わり


        SearchWord3: function () {
            const vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex1 = vueThis.csvCols.indexOf(vueThis.selectedCol1);
            const colIndex2 = vueThis.csvCols.indexOf(vueThis.selectedCol2);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex1] ||!item[colIndex2]){
                    return false;
                }
                if(item[colIndex1].includes(vueThis.searchKeyword1) && item[colIndex2].includes(vueThis.searchKeyword2)) {
                    return true;
                }
            });

            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                 window.open(linkData[row -1][2], '_blank');
            });

            //検索結果を表示する
             $(function() {
                $('#kensakusita').css("display", "block");
            });
        $(function() {
            $('#hitsu').css("display", "block");
        });
            
        },
        
        SearchWord: function () {
            const vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex1 = vueThis.csvCols.indexOf(vueThis.selectedCol1);
            const colIndex2 = vueThis.csvCols.indexOf(vueThis.selectedCol2);
            const colIndex3 = vueThis.csvCols.indexOf(vueThis.selectedCol3);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex1] ||!item[colIndex2] || !item[colIndex3]){
                    return false;
                }
                if(item[colIndex1].includes(vueThis.searchKeyword1) && item[colIndex2].includes(vueThis.searchKeyword2) && item[colIndex3].includes(vueThis.searchKeyword3)) {
                    return true;
                }
            });

            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                window.open(linkData[row -1][2], '_blank');
            });

             //検索結果を表示する
             $(function() {
                $('#kensakusita').css("display", "block");
            });
            $(function() {
                $('#hitsu').css("display", "block");
            });

        },


        // Enterキーで検索
        SearchBoxEnterkey: function (event) { 
            if (event.keyCode !== 13) { return }
            this.kensaku();
        }
    },



    mounted: function () {
        if (location.href.indexOf('file') != -1) {
            this.isHttpReq = false;
            setTimeout(function () {
                alert('ファイルが見つかりません');
            }.bind(this), 100);
            return
        } else {
            this.isHttpReq = true;
        }
        if (this.csvPathList) {
            this.RequestCsvPath(this.csvPathList[0].csvPath);
        }
    }



})//全体終わり


// 'kensaku.js'って名前にしたけどめんどくさいからフッターも入れる
$(function(){
    //フッターを最下部に固定
    var $footer = $('#site-footer');
    if(window.innerHeight > $footer.offset().top + $footer.outerHeight() ) {
        $footer.attr({'style': 'position:fixed; top:' + (window.innerHeight - $footer.outerHeight()) + 'px;' });
    }
})