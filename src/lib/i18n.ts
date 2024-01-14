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
