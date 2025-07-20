import { Rows, Button, ReloadIcon } from "@canva/app-ui-kit";

interface ActionButtonsProps {
  imageUrl: string;
  file: File;
  hasSelect: boolean;
  imageSourceType: "upload" | "content" | "unknown";
  isFlipped?: boolean;
  onAcceptImage: (params: {
    imageUrl: string;
    file: File;
    hasSelect: boolean;
  }) => void;
  onDownload?: () => void;
  onGoBack: () => void;
}

export const ActionButtons = ({
  imageUrl,
  file,
  hasSelect,
  imageSourceType,
  isFlipped = false,
  onAcceptImage,
  onDownload,
  onGoBack,
}: ActionButtonsProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `${isFlipped ? "flipped-" : ""}${file.name}`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <Rows spacing="1u">
      <Button
        variant="primary"
        onClick={() => onAcceptImage({ imageUrl, file, hasSelect })}
      >
        {imageSourceType === "upload" || !hasSelect
          ? `Add${isFlipped ? " flipped" : ""} to design`
          : `Replace${isFlipped ? " with flipped" : ""}`}
      </Button>

      {isFlipped && (
        <Button variant="secondary" onClick={onDownload || handleDownload}>
          Download flipped image
        </Button>
      )}

      <Button variant="secondary" onClick={onGoBack} icon={ReloadIcon}>
        Go back
      </Button>
    </Rows>
  );
};
