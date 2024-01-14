import { I18nButton } from "@/components/i18nBtn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { CSListView } from "./ListView";
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { animate, motion, useMotionValue } from "framer-motion";

const CSSuperVisor = () => {
  const { t } = useTranslation();
  const rotate = useMotionValue("0");

  const [key, setKey] = React.useState(0);
  const resetPage = () => {
    setKey((prev) => prev + 1);
    animate(rotate, "-360deg", { duration: 1 }).then(() => rotate.set("0"));
  };
  return (
    <div key={key} className="">
      <Tabs defaultValue="listMode" className="w-full">
        <div className="flex justify-end gap-2">
          <TabsList>
            <TabsTrigger value="listMode">{t("listMode")}</TabsTrigger>
            <TabsTrigger value="blockMode">{t("blockMode")}</TabsTrigger>
          </TabsList>
          <I18nButton />
          <Button variant="outline" onClick={resetPage}>
            <motion.span style={{ rotate }}>
              <RotateCcwIcon className="w-5 h-5" />
            </motion.span>
          </Button>
        </div>

        <TabsContent value={"listMode"}>
          <CSListView />
        </TabsContent>
        <TabsContent value="blockMode">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default CSSuperVisor;
