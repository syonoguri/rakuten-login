// 分析結果を保持・更新するクラス
class KeywordAnalysisState {
    constructor(){
        this.tableCaption = "検索キーワード"
        this.analysisResult = [];
        this.filteredResult = [];
        this.savedTableCaption = "";
        this.savedResult = [];
        this.savedFilteredResult = [];
        this.errorMessage = ""
    }

    // エラーメッセージを格納する
    makeErrorMessage(errorMessage){ 
        this.errorMessage = errorMessage;
        keywordAnalysisViewer.showErrorMessage();
    };

    // 入力されたキーワードを格納する(テーブルのタイトル）
    makeTableCaption(caption){ 
        this.tableCaption = caption;
    };

    // 分析結果を配列に格納する
    // サーバから帰ってきた分析結果をanalysisResultにpushする
    // 表示用のfilteredResultにanalysisResultをディープコピーし、
    // filteredResultを用いる表示用のメソッドを呼び出す
    makeAnalysisResult(result){ 
        this.analysisResult = [];
        for(var i in result){
            this.analysisResult.push({score:result[i],keyword:i});
        }
        this.filteredResult = JSON.parse(JSON.stringify(this.analysisResult));
        keywordAnalysisViewer.showResult(this.filteredResult);
    };

    // 分析結果を複製する
    // →２つ目のテーブルに表示するためのモノ
    save(){ 
        this.savedResult = this.analysisResult;
        this.savedTableCaption = this.tableCaption;
        this.analysisResult = [];
        this.savedFilteredResult = JSON.parse(JSON.stringify(this.filteredResult));
        this.filteredResult = JSON.parse(JSON.stringify(this.analysisResult));
        this.tableCaption = "検索キーワード";
        keywordAnalysisViewer.showResult(this.filteredResult);
        keywordAnalysisViewer.showSavedResult(this.savedFilteredResult);
    };

    // 結果を格納した配列の順番を逆にする
    // →表の昇降順を逆にしてブラウザに表示する
    revereseFilteredResult(){
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.analysisResult);
        // this.fil1.reverse();
        this.filteredResult.reverse();
        console.log(JSON.parse(JSON.stringify(this.filteredResult)));
        console.log(this.analysisResult);

        keywordAnalysisViewer.showResult(this.filteredResult);
    };

    revereseSavedFilteredResult(){
        this.savedFilteredResult.reverse();
        keywordAnalysisViewer.showSavedResult(this.savedFilteredResult);
    };

    // 特定のワードに部分一致するキーワードを抽出しブラウザに表示する
    makeFilteredResult(filteringKeyword){
        this.filteredResult = [];
        console.log("keyword");
        let expObj = new RegExp(filteringKeyword);
        for(let i of this.analysisResult){
            if(expObj.test(i["keyword"])){
                console.log(i["keyword"]);
                console.log(this.filteredResult);
                this.filteredResult.push(i);
            }
        }
        keywordAnalysisViewer.showResult(this.filteredResult);
    };

    makeSavedFilteredResult(filteringKeyword){
        this.savedFilteredResult = [];
        let expObj = new RegExp(filteringKeyword);
        for(let i of this.savedResult){
            if(expObj.test(i["keyword"])){
                this.savedFilteredResult.push(i);
            }
        }
        keywordAnalysisViewer.showSavedResult(this.savedFilteredResult);
    };

    // フィルターと順番入れ替えの効果を初期化する
    clearFilters(){
        this.makeFilteredResult("");
    }
}
