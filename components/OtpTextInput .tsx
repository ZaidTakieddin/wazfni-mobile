import { OtpInput } from 'react-native-otp-entry';
import { View, I18nManager } from 'react-native';

const CustomOtpTextInput = ({
  otp = '',
  handleOtp,
}: {
  otp: string;
  handleOtp: (otp: string) => void;
}) => {
  return (
    <View>
      <OtpInput
        numberOfDigits={6}
        focusColor="#a47764"
        autoFocus={false}
        hideStick={true}
        placeholder="_______"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFocus={() => 
        onBlur={() => 
        /* onTextChange={(text) => 
        onFilled={handleOtp}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
          style: {
            color: '#a47764',
          },
        }}
        theme={{
          focusStickStyle: {
            backgroundColor: '#a47764',
          },
          filledPinCodeContainerStyle: {
            backgroundColor: '#633e3d',
          },
          placeholderTextStyle: {
            color: '#633e3d',
          },
          containerStyle: { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' },
        }}
      />
    </View>
  );
};

export default CustomOtpTextInput;
