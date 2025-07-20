import { Rows, Text, Checkbox, FormField, Slider } from "@canva/app-ui-kit";

interface MirrorFlipControlsProps {
  flipHorizontal: boolean;
  flipVertical: boolean;
  reflectionOpacity: number;
  onFlipHorizontalChange: (checked: boolean) => void;
  onFlipVerticalChange: (checked: boolean) => void;
  onOpacityChange: (value: number) => void;
}

export const MirrorFlipControls = ({
  flipHorizontal,
  flipVertical,
  reflectionOpacity,
  onFlipHorizontalChange,
  onFlipVerticalChange,
  onOpacityChange,
}: MirrorFlipControlsProps) => {
  return (
    <FormField
      label="Mirror Flip Options"
      control={() => (
        <Rows spacing="1u">
          <Rows spacing="0.5u">
            <Text size="small" tone="secondary">
              Transform your image:
            </Text>
            <Checkbox
              checked={flipHorizontal}
              onChange={(_, checked) => onFlipHorizontalChange(checked)}
              label="Flip Horizontally (Mirror)"
            />
            <Checkbox
              checked={flipVertical}
              onChange={(_, checked) => onFlipVerticalChange(checked)}
              label="Flip Vertically"
            />
          </Rows>
          {(flipHorizontal || flipVertical) && (
            <FormField
              label={`Image Opacity: ${reflectionOpacity}%`}
              control={() => (
                <Slider
                  min={10}
                  max={100}
                  step={5}
                  value={reflectionOpacity}
                  onChange={onOpacityChange}
                />
              )}
            />
          )}
        </Rows>
      )}
    />
  );
};
