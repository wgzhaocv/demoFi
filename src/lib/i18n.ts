import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      listMode: "ListMode",
      blockMode: "BlockMode",
      "Customer Service List": "Customer Service List",
      Application: "Application",
      "Document Application": "Document Application",
      "Document Check": "Document Check",
      "Account Opening Application": "Account Opening",
      "Application Confirmed": "Application Confirmed",
      "Application Complete": "Application Complete",
      customerName: "Customer",
      customerID: "Account",
      mailAddress: "Mail Address",
      telephone: "Telephone",
      address: "Address",
      status: "Status",
      "Customer is added to Service": "Customer is added to Service ",
      "Customer is added to status": "Customer is added to status ",
      customersReview: "customersReview",
      "analytical value": " analytical value",
      "CS Evaluation": "CS Evaluation",
      "Csutomer Evaluation": "Csutomer Evaluation",
      "Data Analysis Results": "Data Analysis Results",
      reviwA: "Dep A",
      reviwB: "Dep B",
      reviwC: "Dep C",
      reviwD: "Dep D",
      reviwE: "Dep E",
      "Customer Service": "Customer Service",
      Customer: "Customer",
      ": ": ": ",
      conclusion: "Conclusion",
      confirm: "Confirm",
      dispItems: "Display Items",
      cancel: "Cancel",
      "Confirm Customer Changes": "Confirm Customer Changes",
      "Diff Reflected": "Diff Reflected",
      "Item Name": "Item Name",
      "Before Change": "Before Change",
      "After Change": "After Change",
      customerService: "customerService",
      "No Changes": "No Changes.",
      "Changed Customers": "Changed Customers",
      Close: "Close",
      "Select Display Items": "Select Display Items",
      zipcode: "Zipcode",
      birthdayYYYY: "Birthday Year",
      birthdayMM: "Birthday Month",
      birthdayDD: "Birthday Day",
    },
  },
  jp: {
    translation: {
      listMode: "リストモード",
      blockMode: "Blockモード",
      "Customer Service List": "カスタマーサービスリスト",
      Application: "申し込み",
      "Document Application": "書類申請",
      "Document Check": "書類チェック",
      "Account Opening Application": "口座開設申請",
      "Application Confirmed": "確認済み",
      "Application Complete": "申請完了",
      customerName: "顧客名",
      customerID: "アカウントID",
      mailAddress: "メールアドレス",
      status: "ステータス",
      telephone: "電話番号",
      address: "住所",
      "Customer is added to Service":
        "お客さん右記のカスタマーサービスに移動しました：",
      "Customer is added to status": "お客さん右記のステータスに移動しました：",
      customersReview: "顧客満足度",
      "analytical value": "分析値",
      "CS Evaluation": "CS評価",
      "Csutomer Evaluation": "顧客評価",
      "Data Analysis Results": "データ分析結果",
      reviwA: "部署あ",
      reviwB: "部署い",
      reviwC: "部署う",
      reviwD: "部署え",
      reviwE: "部署お",
      "Customer Service": "カスタマーサービス",
      Customer: "顧客",
      ": ": "：",
      conclusion: "結論",
      confirm: "完了",
      dispItems: "表示項目",
      cancel: "キャンセル",
      "Confirm Customer Changes": "顧客変更を確認する",
      "Diff Reflected": "差分反映済み",
      "Item Name": "項目名",
      "Before Change": "変更前",
      "After Change": "変更後",
      customerService: "カスタマーサービス",
      "No Changes": "変更なし",
      "Changed Customers": "変更された顧客",
      Close: "閉じる",
      "Select Display Items": "表示項目を選択する",
      zipcode: "郵便番号",
      birthdayYYYY: "誕生年",
      birthdayMM: "誕生月",
      birthdayDD: "誕生日",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "jp", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
