import { Checkbox, CheckboxProps } from "expo-checkbox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ViewStyle } from "react-native";

interface RHFCheckboxProps<F extends FieldValues> extends CheckboxProps {
  name: Path<F>;
  control: Control<F>;
  label: string;
  color?: string;
  style?: ViewStyle;
}

const RHFCheckbox = <F extends FieldValues>({
  name,
  control,
  label,
  color,
  style,
  ...props
}: RHFCheckboxProps<F>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox
          value={field.value}
          onValueChange={field.onChange}
          {...props}
          style={style}
        />
      )}
    />
  );
};

export default RHFCheckbox;
