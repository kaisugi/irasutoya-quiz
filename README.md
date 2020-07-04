# irasutoya-quiz

枝で隠れた「いらすとや」の画像のタイトルを当てるゲームです。  
理学部情報科学科 選択必修科目「ユーザーインターフェイス」の課題として作りました。

**url: https://irasutoya-quiz.netlify.app/**

<img src="https://user-images.githubusercontent.com/36184621/86512533-118e2700-be3e-11ea-8fe1-b3c2bdf84eb9.gif" width="400px">


## ゲームの説明

このゲームの UI は「いらすとや」の画像、枝、タイトルの候補の選択肢、スコアボードから構成されています。  
枝はクリックで選択することができます。また、枝を選択すると「選択した枝を削除」ボタンが表示され、それをクリックすると枝を削除することができます。  
枝を削除すればするほど、元の画像が見やすくなるため、画像のタイトルを当てやすくなります。一方で、枝を削除すればするほど獲得できるスコアが低くなるような設定にしています。

## 使用技術

React: https://ja.reactjs.org/  
TypeScript: https://www.typescriptlang.org/  
ZEIT UI: https://react.zeit-ui.co/  
Netlify: https://www.netlify.com/
