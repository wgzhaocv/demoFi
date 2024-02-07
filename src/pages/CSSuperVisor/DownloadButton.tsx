import { useCheckedCustomers } from "@/components/providers/checkedCustomers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { csStatusMap } from "@/lib/status";
import React from "react";
import { useTranslation } from "react-i18next";

const TitleItems = [
  "customerID",
  "customerName",
  "mailAddress",
  "telephone",
  "address",
  "mynumber",
  "zipcode",
  "status",
];

const mustItems = ["customerID", "customerName"];

export const DownloadButton = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [checkedIndex, setCheckedIndex] = React.useState<number[]>(
    TitleItems.map((_, index) => index)
  );

  const checkedCustomers = useCheckedCustomers((state) => state.customers);

  const createAndDownloadCsv = React.useCallback(() => {
    const selectedItems = checkedIndex.sort().map((index) => TitleItems[index]);
    const fileHeader = selectedItems.map((item) => t(item)).join(",") + "\n";
    const fileContent = checkedCustomers
      .map((customer) =>
        selectedItems
          .map((item) =>
            item === "status"
              ? t(csStatusMap[customer[item]])
              : customer[item as keyof typeof customer]
          )
          .join(",")
      )
      .join("\n");

    const csv = fileHeader + fileContent;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // 時間を取得
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const datetime =
      "" +
      year +
      "-" +
      month.toString().padStart(2, "0") +
      "-" +
      day.toString().padStart(2, "0") +
      "_" +
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    link.download = datetime + "customers.csv";
    link.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }, [checkedCustomers, t, checkedIndex]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {t("Download To Csv")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Select Csv Title Items")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 min-w-[200px]">
          {TitleItems.map((item, index) => {
            return (
              <div key={item} className="flex items-center gap-2">
                <Checkbox
                  disabled={mustItems.includes(item)}
                  checked={
                    mustItems.includes(item)
                      ? true
                      : checkedIndex.includes(index)
                  }
                  onCheckedChange={(checked) => {
                    if (mustItems.includes(item)) return;
                    if (checked) {
                      setCheckedIndex((state) =>
                        Array.from(new Set([...state, index]))
                      );
                    } else {
                      setCheckedIndex((state) =>
                        state.filter((i) => i !== index)
                      );
                    }
                  }}
                />
                <label> {t(item)}</label>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button onClick={createAndDownloadCsv}>{t("Download")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
