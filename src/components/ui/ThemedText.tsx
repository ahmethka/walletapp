import { Text, TextProps } from 'react-native';
export default function ThemedText(props: TextProps & { muted?: boolean; bold?: boolean }) {
  const { style, muted, bold, ...rest } = props;
  const base = "text-text";
  const weight = bold ? " font-semibold" : "";
  const tone = muted ? " text-muted" : "";
  return <Text className={base + weight + tone} style={style} {...rest} />;
}
