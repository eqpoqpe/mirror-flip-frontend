import { FormField, FileInput, FileInputItem } from "@canva/app-ui-kit";
import styles from "styles/components.css";

interface ImageUploadProps {
  originImageURL: string;
  file?: File;
  imageSourceType: "upload" | "content" | "unknown";
  onFilesChange: (files: File[]) => void;
  onReset: () => void;
}

export const ImageUpload = ({
  originImageURL,
  file,
  imageSourceType,
  onFilesChange,
  onReset,
}: ImageUploadProps) => {
  return (
    <FormField
      description={
        originImageURL
          ? ""
          : "Upload an image or select one in your design to enlarge"
      }
      label="Original image"
      control={(props) =>
        originImageURL ? (
          <>
            {/* eslint-disable-next-line react/forbid-elements */}
            <img src={originImageURL} className={styles.originImage} />

            {imageSourceType === "upload" && file && (
              <FileInputItem onDeleteClick={onReset} label={file.name} />
            )}
          </>
        ) : (
          <FileInput
            {...props}
            accept={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
            stretchButton
            onDropAcceptedFiles={onFilesChange}
          />
        )
      }
    />
  );
};
