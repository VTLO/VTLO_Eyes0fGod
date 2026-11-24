import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

type Props = { html: string };

export const ChamberView = ({ html }: Props) => (
  <WebView
    key={html.length}
    originWhitelist={['*']}
    source={{ html }}
    style={styles.view}
    javaScriptEnabled
    domStorageEnabled
    allowsInlineMediaPlayback
    mediaPlaybackRequiresUserAction={false}
    overScrollMode="never"
    setSupportMultipleWindows={false}
  />
);

const styles = StyleSheet.create({ view: { flex: 1, backgroundColor: '#000000' } });
