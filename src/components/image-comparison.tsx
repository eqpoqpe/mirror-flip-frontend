import { Rows, Text, Columns, Column } from "@canva/app-ui-kit";
import styles from "styles/components.css";

interface ImageComparisonProps {
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
  title: string;
}

export const ImageComparison = ({
  leftImage,
  rightImage,
  leftLabel,
  rightLabel,
  title,
}: ImageComparisonProps) => {
  return (
    <Rows spacing="1u">
      <Text variant="bold" size="medium">
        {title}
      </Text>

      <div className={styles.imageCompareContainer}>
        <Columns spacing="1u">
          <Column>
            <Rows spacing="1u">
              <Text size="small" tone="tertiary" alignment="center">
                {leftLabel}
              </Text>
              {/* eslint-disable-next-line react/forbid-elements */}
              <img
                src={leftImage}
                className={styles.compareImage}
                alt={leftLabel}
              />
            </Rows>
          </Column>
          <Column>
            <Rows spacing="1u">
              <Text size="small" tone="tertiary" alignment="center">
                {rightLabel}
              </Text>
              {/* eslint-disable-next-line react/forbid-elements */}
              <img
                src={rightImage}
                className={styles.compareImage}
                alt={rightLabel}
              />
            </Rows>
          </Column>
        </Columns>
      </div>
    </Rows>
  );
};
