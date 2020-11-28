import config from "./_config";
import { error } from "./_log";

export default function modalApiOpen(dataValue: string) {
  if (dataValue) {
    if (config.modals.has(dataValue)) {
      config.modals.get(dataValue).open();
    } else {
      error("ds-modal: no such modal exists", true);
    }
  }
}