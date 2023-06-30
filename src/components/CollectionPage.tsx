/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Show, createEffect, createSignal, For } from "solid-js";
import type {
  CardCollectionDTO,
  CardMetadataWithVotes,
  ScoreCardDTO,
} from "../../utils/apiTypes";
import ScoreCard from "./ScoreCard";
import { FullScreenModal } from "./Atoms/FullScreenModal";
import { BiRegularLogIn, BiRegularXCircle } from "solid-icons/bi";
import { FiEdit3 } from "solid-icons/fi";

export interface CollectionPageProps {
  collectionID: string | undefined;
  defaultCollectionCards: {
    metadata: {
      bookmarks: CardMetadataWithVotes[];
      collection: CardCollectionDTO;
    };
    status: number;
  };
}
export const CollectionPage = (props: CollectionPageProps) => {
  const apiHost: string = import.meta.env.PUBLIC_API_HOST;
  const ScoreDTOCards: ScoreCardDTO[] = [];
  if (props.defaultCollectionCards.metadata.bookmarks?.length > 0)
    props.defaultCollectionCards.metadata.bookmarks.forEach((card) => {
      ScoreDTOCards.push({ metadata: card, score: 2 });
    });

  const [showNeedLoginModal, setShowNeedLoginModal] = createSignal(false);
  const [convertedCard, setConvertedCard] =
    createSignal<ScoreCardDTO[]>(ScoreDTOCards);
  const [collectionInfo, setCollectionInfo] = createSignal<CardCollectionDTO>(
    props.defaultCollectionCards.metadata.collection,
  );
  const [cardCollections, setCardCollections] = createSignal<
    CardCollectionDTO[]
  >([]);
  const [error, setError] = createSignal("");
  const [fetching, setFetching] = createSignal(true);
  const [fetchingCollections, setFetchingCollections] = createSignal(false);
  const [editing, setEditing] = createSignal(false);
  if (props.defaultCollectionCards.status == 403) {
    setError("You are not authorized to view this collection.");
  }

  const fetchCardCollections = () => {
    void fetch(`${apiHost}/card_collection`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setCardCollections(data);
        });
      }
    });
  };

  createEffect(() => {
    setFetching(true);
    void fetch(`${apiHost}/card_collection/${props.collectionID}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          //take the data and convert it to ScoreCardDTO
          const ScoreDTOCards: ScoreCardDTO[] = [];
          data.bookmarks.forEach((card: CardMetadataWithVotes) => {
            ScoreDTOCards.push({ metadata: card, score: 2 });
          });
          setCollectionInfo(data.collection);
          setConvertedCard(ScoreDTOCards);
          setError("");
          setFetching(false);
        });
      }
      if (response.status == 403) {
        setFetching(false);
      }
      if (response.status == 401) {
        setShowNeedLoginModal(true);
      }
    });
    fetchCardCollections();
  });

  const updateCollection = () => {
    setFetchingCollections(true);
    const body = {
      collection_id: collectionInfo().id,
      name: collectionInfo().name,
      description: collectionInfo().description,
      is_public: collectionInfo().is_public,
    };
    void fetch(`${apiHost}/card_collection`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      setFetchingCollections(false);
      if (response.ok) {
        setEditing(false);
      }
      if (response.status == 403) {
        setFetching(false);
      }
      if (response.status == 401) {
        setShowNeedLoginModal(true);
      }
    });
  };

  return (
    <>
      <div class=" flex w-full flex-col items-center space-y-2">
        <Show when={error().length == 0 && !fetching()}>
          <div class="flex max-w-6xl items-center gap-x-2">
            <Show when={!editing()}>
              <div class="mx-2 flex items-center gap-x-2">
                <h1 class="mb-4 mt-8 text-center text-lg font-bold min-[320px]:text-lg sm:text-3xl">
                  Collection:
                </h1>
                <h1 class="mb-4 mt-8 line-clamp-1 break-all text-center text-lg min-[320px]:text-xl sm:text-3xl">
                  {collectionInfo().name}
                </h1>
              </div>
            </Show>
            <Show
              when={cardCollections().some(
                (collection) => collection.id == collectionInfo()?.id,
              )}
            >
              <Show when={!editing()}>
                <button
                  class="!pointer-events-auto relative mr-2 mt-2 line-clamp-1 max-h-10 min-w-fit items-end justify-end  rounded-md bg-magenta p-2 text-center"
                  onClick={() => setEditing(!editing())}
                >
                  Edit details
                </button>
              </Show>
              <Show when={editing()}>
                <button
                  classList={{
                    "!pointer-events-auto relative max-h-10 mt-2 mr-2 items-end justify-end rounded-md p-2 text-center bg-magenta":
                      true,
                    "animate-pulse": fetchingCollections(),
                  }}
                  onClick={() => updateCollection()}
                >
                  Save details
                </button>
              </Show>
            </Show>
          </div>
          <Show when={collectionInfo().description.length > 0 && !editing()}>
            <div class="mx-auto mb-4 flex max-w-[300px] justify-items-center gap-x-2 md:max-w-fit">
              <div class="text-center text-lg font-semibold">Description:</div>
              <div class="line-clamp-1 flex w-full justify-start text-center text-lg">
                {collectionInfo().description}
              </div>
            </div>
          </Show>
          <Show when={editing()}>
            <div class="vertical-align-left mt-8 grid	auto-rows-max grid-cols-[1fr,3fr] gap-y-2">
              <h1 class="text-md min-[320px]:text-md sm:text-md mt-10 text-left font-bold">
                Name:
              </h1>
              <input
                type="text"
                class="mt-10 max-h-fit w-full rounded-md bg-neutral-100 px-2 py-1 dark:bg-neutral-700"
                value={collectionInfo().name}
                onInput={(e) => {
                  setCollectionInfo({
                    ...collectionInfo(),
                    name: e.target.value,
                  });
                }}
              />
              <div class="text-md mr-2 font-semibold">Description:</div>
              <textarea
                class="w-full justify-start rounded-md bg-neutral-100 px-2 py-1 dark:bg-neutral-700"
                value={collectionInfo().description}
                onInput={(e) => {
                  setCollectionInfo({
                    ...collectionInfo(),
                    description: e.target.value,
                  });
                }}
              />
              <span class="text-md font-semibold">Private?: </span>
              <input
                type="checkbox"
                checked={!collectionInfo().is_public}
                onChange={(e) => {
                  setCollectionInfo({
                    ...collectionInfo(),
                    is_public: !e.target.checked,
                  });
                }}
                class="mt-1 h-4 w-4 items-center justify-start rounded-sm	border-gray-300 bg-neutral-500 align-middle accent-turquoise focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-600"
              />
            </div>
          </Show>
        </Show>
        <div class="flex w-full max-w-6xl flex-col space-y-4 border-t border-neutral-500 px-4 sm:px-8 md:px-20">
          <Show when={error().length == 0 && !fetching()}>
            <For each={convertedCard()}>
              {(card) => (
                <div class="mt-4">
                  <ScoreCard
                    card={card}
                    collection={true}
                    setShowModal={setShowNeedLoginModal}
                    cardCollections={cardCollections()}
                    fetchCardCollections={fetchCardCollections}
                  />
                </div>
              )}
            </For>
          </Show>
          <Show when={error().length > 0 && !fetching()}>
            <div class="flex w-full flex-col items-center rounded-md p-2">
              <div class="text-xl font-bold text-red-500">{error()}</div>
            </div>
          </Show>
          <Show when={convertedCard().length == 0}>
            <div class="flex w-full flex-col items-center rounded-md p-2">
              <div class="text-xl font-bold text-red-500">
                No cards in this collection
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Show when={showNeedLoginModal()}>
        <FullScreenModal
          isOpen={showNeedLoginModal}
          setIsOpen={setShowNeedLoginModal}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <BiRegularXCircle class="mx-auto h-8 w-8 !text-red-500" />
            <div class="mb-4 text-center text-xl font-bold">
              Cannot view this collection or add it to a collection without an
              account
            </div>
            <div class="mx-auto flex w-fit flex-col space-y-3">
              <a
                class="flex space-x-2 rounded-md bg-magenta-500 p-2 text-white"
                href="/auth/register"
              >
                Register
                <BiRegularLogIn class="h-6 w-6" />
              </a>
            </div>
          </div>
        </FullScreenModal>
      </Show>
    </>
  );
};
