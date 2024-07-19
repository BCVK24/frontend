import { Icon20DownloadOutline, Icon28DownloadOutline } from "@vkontakte/icons";
import {
  ActionSheet,
  ActionSheetItem,
  AdaptiveIconRenderer,
} from "@vkontakte/vkui";
import { Result } from "../models/schemas";
import { SERVER_URL } from "../env";

/**
 * @description Opens popout with all results
 */
export const openResults = (
  results: Array<Result>,
  setPopout: (
    value: React.SetStateAction<React.JSX.Element | null | undefined>,
  ) => void,
  resultsTargetRef: React.MutableRefObject<null>,
) => {
  setPopout(
    <ActionSheet
      onClose={() => setPopout(null)}
      toggleRef={resultsTargetRef}
      placement="top-end"
    >
      {results.map((res) => (
        <a style={{textDecoration: 'none'}} href={`${SERVER_URL}/${res.url}`}>
          <ActionSheetItem
            before={
              <AdaptiveIconRenderer
                IconCompact={Icon20DownloadOutline}
                IconRegular={Icon28DownloadOutline}
              />
            }
            key={res.id}
            onClick={() => console.log(`${SERVER_URL}/${res.url}`)}
          >
            {new Date(res.created_at).toLocaleString("ru-RU")}
          </ActionSheetItem>
        </a>
      ))}
    </ActionSheet>,
  );
};
