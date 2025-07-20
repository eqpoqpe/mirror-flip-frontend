import { FormField, Box, Text, Columns, Column, Rows } from "@canva/app-ui-kit";
import styles from "styles/components.css";

interface LivePreviewProps {
  isFlipping: boolean;
  originImageURL: string;
  flippedImageUrl: string;
}

export const LivePreview = ({
  isFlipping,
  originImageURL,
  flippedImageUrl,
}: LivePreviewProps) => {
  return (
    <FormField
      label={isFlipping ? "Generating flip preview..." : "Live Preview"}
      control={() => (
        <div className={styles.mirrorPreview}>
          {isFlipping ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding="4u"
            >
              <Text size="small" tone="tertiary">
                Processing...
              </Text>
            </Box>
          ) : flippedImageUrl ? (
            <Columns spacing="1u">
              <Column>
                <Rows spacing="0.5u">
                  <Text size="small" tone="tertiary" alignment="center">
                    Original
                  </Text>
                  {/* eslint-disable-next-line react/forbid-elements */}
                  <img
                    src={originImageURL}
                    className={styles.compareImage}
                    alt="Original"
                  />
                </Rows>
              </Column>
              <Column>
                <Rows spacing="0.5u">
                  <Text size="small" tone="tertiary" alignment="center">
                    Flipped
                  </Text>
                  {/* eslint-disable-next-line react/forbid-elements */}
                  <img
                    src={flippedImageUrl}
                    className={styles.compareImage}
                    alt="Flipped"
                  />
                </Rows>
              </Column>
            </Columns>
          ) : null}
        </div>
      )}
    />
  );
};
