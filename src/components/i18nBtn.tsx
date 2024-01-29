import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguagesIcon } from "lucide-react";

type Lang = {
  lang: string;
  abbr: string;
};
const langs = [
  { lang: "jp", abbr: "日本語" },
  { lang: "en", abbr: "English" },
];

export function I18nButton() {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState<Lang>(langs[0]);
  const changeLanguage = React.useCallback((lang: Lang) => {
    i18n.changeLanguage(lang.lang);
    setLang(lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <LanguagesIcon className="h-5 w-5" />
          {lang.abbr}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {langs.map((la) => (
          <DropdownMenuItem key={la.lang} onClick={() => changeLanguage(la)}>
            {la.abbr}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
