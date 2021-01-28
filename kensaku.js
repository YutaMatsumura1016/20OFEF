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
        csvPathList: [{csvPath: 'OFEF歴認2020_2.csv'}]
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
            if(this.searchKeyword1 && !this.searchKeyword2 && !this.searchKeyword3){
                this.SearchWord2();

            //Box1と2に値がある場合
            }else if(this.searchKeyword1 && this.searchKeyword2 && !this.searchKeyword3){
                this.SearchWord3();

            //動かなかった
            //Box1と3に値がある場合
            }else if(this.searchKeyword1 && !this.searchKeyword2 && this.searchKeyword3){
                this.SearchWord4();

            //Box2と3に値がある場合
            }else if(!this.searchKeyword1 && this.searchKeyword2 && this.searchKeyword3){
                this.SearchWord5();

            //Box2のみに値がある場合
            }else if(!this.searchKeyword1 && this.searchKeyword2 && !this.searchKeyword3){
                this.SearchWord6();
            
            //Box3のみに値がある場合
            }else if(!this.searchKeyword1 && !this.searchKeyword2 && this.searchKeyword3){
                this.SearchWord7();

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

             //検索結果を表示する
             $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });  

            //ファイル名と稿数を前に
            // $(function() {
            //     jQuery.each($("kekkaTable tr"), function() { 
            //         $(this).children(":eq(0)").after($(this).children(":eq(8)"));
            //         $(this).children(":eq(1)").after($(this).children(":eq(6)"));
            //     });
            // });

            // 動かなかった
            // $(function() {
            //     $('#kekkaTable').tablesorter();
            //     console.log('sorter');
            // });
            console.log('serchword2');
        },//SearchWord2終わり


        SearchWord3: function () {
            const vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex1 = vueThis.csvCols.indexOf(vueThis.selectedCol1);
            const colIndex2 = vueThis.csvCols.indexOf(vueThis.selectedCol2);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex1] || !item[colIndex2]){
                    return false;
                }
                if(item[colIndex1].includes(vueThis.searchKeyword1) && item[colIndex2].includes(vueThis.searchKeyword2)) {
                    return true;
                }
            });

            //検索結果を表示する
            $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });

            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            }); 
            console.log('serchword3');
        },//SearchWord3終わり


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

            //検索結果を表示する
            $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
        
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });
            console.log('serchword');
        },//SearchWord終わり


        SearchWord4: function () {
            var vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex1 = vueThis.csvCols.indexOf(vueThis.selectedCol1);
            const colIndex3 = vueThis.csvCols.indexOf(vueThis.selectedCol3);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex1] || !item[colIndex3]){
                    return false;
                }
                if(item[colIndex1].includes(vueThis.searchKeyword1) && item[colIndex3].includes(vueThis.searchKeyword3)) {
                    return true;
                }  
            });//csvData定義終わり

             //検索結果を表示する
             $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });   
            console.log('serchword4');          
        },//SearchWord4終わり


        SearchWord5: function () {
            var vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex2 = vueThis.csvCols.indexOf(vueThis.selectedCol2);
            const colIndex3 = vueThis.csvCols.indexOf(vueThis.selectedCol3);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex2] || !item[colIndex3]){
                    return false;
                }
                if(item[colIndex2].includes(vueThis.searchKeyword3) && item[colIndex3].includes(vueThis.searchKeyword3)) {
                    return true;
                }  
            });//csvData定義終わり

             //検索結果を表示する
             $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });   
            console.log('serchword5');          
        },//SearchWord5終わり

        SearchWord6: function () {

            var vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex2 = vueThis.csvCols.indexOf(vueThis.selectedCol2);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex2]){
                    return false;
                }
                if(item[colIndex2].includes(vueThis.searchKeyword2)) {
                    return true;
                }  
            });//csvData定義終わり

             //検索結果を表示する
             $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });  

            console.log('serchword6');
        },//SearchWord6終わり

        SearchWord7: function () {

            var vueThis = this;

            //colIndex = 選択されたインデックス(selectedCol)
            const colIndex3 = vueThis.csvCols.indexOf(vueThis.selectedCol3);

            this.csvData = this.allCsvData.filter(function (item, index) {
                if(!item[colIndex3]){
                    return false;
                }
                if(item[colIndex3].includes(vueThis.searchKeyword3)) {
                    return true;
                }  
            });//csvData定義終わり

             //検索結果を表示する
             $(function() {
                $('.kensakusita').css("display", "block");
            });

            //もともと出ていた文字を消す
            $(function() {
                $('.kakoSiryou').css("display", "none");
            });
            
            //クリックしたらリンクを開く
            linkData = this.csvData;
            $('#kekkaTable tr').click(function(){
                row = $("tr").index(this);
                if(row == 0){
                    null;
                }else{
                window.open(linkData[row -1][9], '_blank');
                }
            });  

            console.log('serchword7');
        },//SearchWord7終わり



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

});//全体終わり


// 'kensaku.js'って名前にしたけど分けるのめんどくさいからフッターも入れる
$(function(){
    //フッターを最下部に固定
    var $footer = $('#site-footer');
    if(window.innerHeight > $footer.offset().top + $footer.outerHeight() ) {
        $footer.attr({'style': 'position:fixed; top:' + (window.innerHeight - $footer.outerHeight()) + 'px;' });
    }
});


//ついでにトップに戻るも入れる
$(function() {
    $("#modoruTop").click(function() {
      $('body, html').animate({scrollTop: 0}, 200, 'linear');
    });
});