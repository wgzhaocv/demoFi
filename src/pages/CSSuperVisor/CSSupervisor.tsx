import { I18nButton } from "@/components/i18nBtn";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { CSListView } from "./ListView";
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { animate, motion, useMotionValue } from "framer-motion";
import { DispItemDialog } from "./DispItemsDialog";
import { DiffDialog } from "./diffDialog";
import { CustomerReview } from "./CustomerReview";
import { DownloadButton } from "./DownloadButton";
import { useMode } from "@/components/providers/Mode";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-dropdown-menu";

const CSSuperVisor = () => {
  const { t } = useTranslation();
  const rotate = useMotionValue("0");

  const [key, setKey] = React.useState(0);
  const resetPage = () => {
    setKey((prev) => prev + 1);
    animate(rotate, "-360deg", { duration: 1 }).then(() => rotate.set("0"));
  };

  const mode = useMode((state) => state.mode);
  const changeMode = useMode((state) => state.changeMode);
  return (
    <div key={key}>
      <Tabs defaultValue="listMode" className="w-full">
        <div className="w-full flex justify-end gap-2 fixed right-40 top-5 z-40">
          <DispItemDialog />
          <DiffDialog />
          <DownloadButton />
          <div className="bg-white mx-1">
            <RadioGroup
              value={mode}
              className="gap-1"
              onValueChange={changeMode}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="listMode" id="listMode" />
                <Label className="text-sm">{t("listMode")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blockMode" id="blockMode" />
                <Label className="text-sm">{t("blockMode")}</Label>
              </div>
            </RadioGroup>
          </div>
          <I18nButton />
          <Button variant="outline" onClick={resetPage}>
            <motion.span style={{ rotate }}>
              <RotateCcwIcon className="w-5 h-5" />
            </motion.span>
          </Button>
        </div>

        <TabsContent value={"listMode"}>
          <CSListView />
          <CustomerReview />
        </TabsContent>
        {/* <TabsContent value="blockMode">
          <BlockView />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default CSSuperVisor;
