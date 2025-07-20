import { Rows, Text, Alert } from "@canva/app-ui-kit";
import { useEffect, useRef, useState } from "react";
import type {
  ContentDraft,
  ImageRef,
  ImageElementAtPoint,
} from "@canva/design";
import { addElementAtPoint, selection } from "@canva/design";
import { useMutation } from "@tanstack/react-query";
import styles from "styles/components.css";
import type { ImageMimeType } from "@canva/asset";
import { getTemporaryUrl, upload } from "@canva/asset";
import {
  ImageComparison,
  MirrorFlipControls,
  LivePreview,
  ActionButtons,
  ImageUpload,
} from "./components";

// Helper function to flip image canvas
async function flipImageCanvas(
  imageUrl: string,
  flipHorizontal: boolean,
  flipVertical: boolean,
  opacity = 100
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.save();

        // Set global alpha for opacity effect
        ctx.globalAlpha = opacity / 100;

        // Apply transformations
        if (flipHorizontal && flipVertical) {
          ctx.scale(-1, -1);
          ctx.translate(-canvas.width, -canvas.height);
        } else if (flipHorizontal) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        } else if (flipVertical) {
          ctx.scale(1, -1);
          ctx.translate(0, -canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        ctx.restore();

        resolve(canvas.toDataURL("image/png"));
      }
    };
    img.src = imageUrl;
  });
}

async function fileToDataUrl(file: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

async function readCanvaNativeImageURL(url: string): Promise<File> {
  const res = await fetch(url);
  const formatMatch = url.match(/format:([A-Z]+)/);
  const ext = formatMatch ? formatMatch[1].toLowerCase() : "png";
  return new File([await res.blob()], `selected-image.${ext}`, {
    type: `image/${ext}`,
  });
}

export const App = () => {
  const [[file], setFiles] = useState<File[]>([]);
  const [imageSourceType, setImageSourceType] = useState<
    "upload" | "content" | "unknown"
  >("unknown");
  const [contentDraft, setContentDraft] = useState<ContentDraft<{
    ref: ImageRef;
  }> | null>(null);
  const [originImageURL, setOriginImageURL] = useState("");
  const [hasSelect, setHasSelect] = useState(false);

  // Mirror flip states
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [flippedImageUrl, setFlippedImageUrl] = useState("");
  const [reflectionOpacity, setReflectionOpacity] = useState(50);
  const [isFlipping, setIsFlipping] = useState(false);

  const stateRef = useRef({ imageSourceType });

  stateRef.current = {
    imageSourceType,
  };

  useEffect(() => {
    return selection.registerOnChange({
      scope: "image",
      async onChange(event) {
        const draft = await event.read();
        const ref = draft.contents[0]?.ref;
        setHasSelect(!!ref);
        const { imageSourceType } = stateRef.current;
        if (imageSourceType === "upload") {
          return;
        }

        setContentDraft(draft);
        if (ref) {
          setImageSourceType("content");
          const { url } = await getTemporaryUrl({
            type: "image",
            ref,
          });

          const file = await readCanvaNativeImageURL(url);
          setFiles([file]);
        } else if (imageSourceType === "content") {
          resetData();
        }
      },
    });
  }, []);

  useEffect(() => {
    if (!file || !FileReader) {
      return;
    }

    fileToDataUrl(file).then(setOriginImageURL);
  }, [file]);

  // Effect to handle image flipping with minimal debounce for real-time opacity changes
  useEffect(() => {
    if (!originImageURL || (!flipHorizontal && !flipVertical)) {
      setFlippedImageUrl("");
      setIsFlipping(false);
      return;
    }

    setIsFlipping(true);
    const timeoutId = setTimeout(() => {
      flipImageCanvas(
        originImageURL,
        flipHorizontal,
        flipVertical,
        reflectionOpacity
      )
        .then(setFlippedImageUrl)
        .finally(() => setIsFlipping(false));
    }, 16); // Reduced debounce to ~60fps for real-time feel

    return () => clearTimeout(timeoutId);
  }, [originImageURL, flipHorizontal, flipVertical, reflectionOpacity]);

  const {
    mutate: acceptImage,
    reset: resetAcceptImage,
    data: acceptResult,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
  } = useMutation({
    mutationKey: [],
    mutationFn: async ({
      imageUrl,
      file,
      hasSelect,
    }: {
      imageUrl: string;
      file: File;
      hasSelect: boolean;
    }) => {
      if (
        contentDraft?.contents.length &&
        imageSourceType === "content" &&
        hasSelect
      ) {
        const asset = await upload({
          type: "image",
          url: imageUrl,
          thumbnailUrl: imageUrl,
          mimeType: "image/png" as ImageMimeType,
          parentRef: contentDraft.contents[0].ref,
          aiDisclosure: "app_generated",
        });

        contentDraft.contents[0].ref = asset.ref;
        await contentDraft.save();
        return "replaced";
      } else {
        await addElementAtPoint({
          type: "image",
          dataUrl: imageUrl,
        } as ImageElementAtPoint);
        return "added";
      }
    },
  });

  const resetData = () => {
    setFiles([]);
    setOriginImageURL("");
    setImageSourceType("unknown");
    resetAcceptImage();
    setFlipHorizontal(false);
    setFlipVertical(false);
    setFlippedImageUrl("");
    setReflectionOpacity(50);
    setIsFlipping(false);
  };

  return (
    <div className={styles.scrollContainer}>
      {flippedImageUrl ? (
        <Rows spacing="2u">
          <>
            {!!acceptResult && (
              <Alert tone="positive" onDismiss={resetAcceptImage}>
                <Text variant="bold">
                  {acceptResult === "added"
                    ? "Image added to design"
                    : "Image replaced"}
                </Text>
              </Alert>
            )}

            <ImageComparison
              leftImage={originImageURL}
              rightImage={flippedImageUrl}
              leftLabel="Original"
              rightLabel="Flipped"
              title="Mirror Flip Preview"
            />

            <MirrorFlipControls
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              reflectionOpacity={reflectionOpacity}
              onFlipHorizontalChange={setFlipHorizontal}
              onFlipVerticalChange={setFlipVertical}
              onOpacityChange={setReflectionOpacity}
            />

            <ActionButtons
              imageUrl={flippedImageUrl}
              file={file}
              hasSelect={hasSelect}
              imageSourceType={imageSourceType}
              isFlipped={true}
              onAcceptImage={acceptImage}
              onGoBack={resetData}
            />
          </>
        </Rows>
      ) : (
        <Rows spacing="2u">
          <>
            <ImageUpload
              originImageURL={originImageURL}
              file={file}
              imageSourceType={imageSourceType}
              onFilesChange={(files) => {
                setImageSourceType("upload");
                setFiles(files);
              }}
              onReset={resetData}
            />

            {!!file && (
              <MirrorFlipControls
                flipHorizontal={flipHorizontal}
                flipVertical={flipVertical}
                reflectionOpacity={reflectionOpacity}
                onFlipHorizontalChange={setFlipHorizontal}
                onFlipVerticalChange={setFlipVertical}
                onOpacityChange={setReflectionOpacity}
              />
            )}

            {!!file && (flipHorizontal || flipVertical) && (
              <LivePreview
                isFlipping={isFlipping}
                originImageURL={originImageURL}
                flippedImageUrl={flippedImageUrl}
              />
            )}
          </>
        </Rows>
      )}
    </div>
  );
};
