import { View, ViewProps } from 'react-native';
export default function ThemedView(props: ViewProps) {
  const { style, ...rest } = props;
  return <View className="bg-bg" style={style} {...rest} />;
}
