import { Icon20DownloadOutline, Icon28DownloadOutline } from "@vkontakte/icons";
import {
  ActionSheet,
  ActionSheetItem,
  AdaptiveIconRenderer,
} from "@vkontakte/vkui";
import { Result } from "../models/schemas";
import { ResultService } from "../services";

/**
 * @description Opens popout with all results
 */
export const openResults = (
  results: Array<Result>,
  setPopout: (
    value: React.SetStateAction<React.JSX.Element | undefined>,
  ) => void,
  resultsTargetRef: React.MutableRefObject<null>,
) => {
  setPopout(
    <ActionSheet
      onClose={() => setPopout(undefined)}
      toggleRef={resultsTargetRef}
      placement="top-end"
    >
      {results.map((res) => (
        <ActionSheetItem
          before={
            <AdaptiveIconRenderer
              IconCompact={Icon20DownloadOutline}
              IconRegular={Icon28DownloadOutline}
            />
          }
          key={res.id}
          onClick={() => ResultService.download(res.id)}
        >
          {new Date(res.created_at).toLocaleString("ru-RU")}
        </ActionSheetItem>
      ))}
    </ActionSheet>,
  );
};
