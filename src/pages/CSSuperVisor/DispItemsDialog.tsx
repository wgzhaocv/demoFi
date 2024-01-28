import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useTranslation } from "react-i18next";

export const DispItemDialog = () => {
  const [openDispItems, setOpenDispItems] = React.useState(false);
  const { t } = useTranslation();

  const handleConfirmDispItems = () => {};

  return (
    <Dialog open={openDispItems} onOpenChange={setOpenDispItems}>
      <DialogTrigger asChild>
        <Button className="">{t("dispItems")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        test
        <DialogFooter>
          <Button
            variant={"default"}
            onClick={() => setOpenDispItems(false)}
            className="flex items-center justify-center"
          >
            {t("Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
