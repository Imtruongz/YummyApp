import React, { useMemo, useRef, useState } from 'react';
import { Alert, ActivityIndicator, Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader } from '@/components';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const DEFAULT_ALLOWED_HOSTS = ['lfx.la'];

const MOCK_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LFX Mock</title>
    <style>
      body { font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 16px; }
      h2 { margin: 8px 0 16px; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      button { padding: 12px 16px; margin: 8px 8px 0 0; border: 0; border-radius: 8px; background: #0ea5e9; color: #fff; font-size: 16px; }
      button.secondary{ background: #64748b; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h2>LFX WebView Mock</h2>
    <div class="card">
      <p>This page simulates messages that the real LFX page would send to the bank app.</p>
      <p>It will call <code>window.ReactNativeWebView.postMessage</code> / <code>window.postMessage</code> with the payload described in the spec.</p>
    </div>
    <div class="card">
      <h3>Actions</h3>
      <button onclick="sendDeposit()">Send deposit</button>
      <button class="secondary" onclick="sendClose()">Send close</button>
    </div>
    <script>
      function sendDeposit(){
        const payload = { function: 'deposit', tomember: 'LFX', toaccount: '564894654654', ccy: 'USD', amount: 1000 };
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        } else {
          window.postMessage(payload, 'https://lfx.la');
        }
      }
      function sendClose(){
        const payload = { function: 'close' };
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        } else {
          window.postMessage(payload, 'https://lfx.la');
        }
      }
    </script>
  </body>
</html>`;

const INJECT_BRIDGE = `
  (function(){
    // Bridge window.postMessage -> ReactNativeWebView.postMessage, to be compatible with spec
    try {
      var RNW = window.ReactNativeWebView;
      if (RNW && RNW.postMessage) {
        var _orig = window.postMessage;
        window.postMessage = function(data, origin){
          try {
            RNW.postMessage(JSON.stringify({ __bridge: 'window.postMessage', data: data, origin: origin }));
          } catch (e) {
            RNW.postMessage(String(data));
          }
          if (typeof _orig === 'function') { try { _orig.apply(window, arguments); } catch(_){} }
        };
        window.addEventListener('message', function(event){
          try { RNW.postMessage(JSON.stringify({ __bridge: 'event.message', data: event.data, origin: event.origin })); } catch(e) {}
        });
      }
    } catch(e) {}
  })();
  true; // required for Android
`;

type DepositPayload = {
    function: 'deposit';
    tomember: string;
    toaccount: string;
    ccy: string;
    amount: number;
};

const LFXWebViewDemoScreen = () => {
    const webRef = useRef<WebView>(null);
    const route = useRoute<any>();
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [deposit, setDeposit] = useState<DepositPayload | null>(null);
    const params = route?.params as { initialUrl?: string; allowedHosts?: string[] } | undefined;
    const allowedHosts = useMemo(() => params?.allowedHosts ?? DEFAULT_ALLOWED_HOSTS, [params]);
    const source = useMemo(() => {
      if (params?.initialUrl) return { uri: params.initialUrl } as const;
      return { html: MOCK_HTML, baseUrl: 'https://lfx.la' } as const;
    }, [params]);

    const handleMessage = (e: WebViewMessageEvent) => {
        let data: any = e.nativeEvent.data;
        try { data = JSON.parse(e.nativeEvent.data); } catch (_) { }

        // If bridged format
        if (data && data.data && data.__bridge) {
            try { data = typeof data.data === 'string' ? JSON.parse(data.data) : data.data; } catch (_) { data = data.data; }
        }

        if (data && typeof data === 'object') {
            if (data.function === 'deposit') {
                setDeposit(data as DepositPayload);
                setModalVisible(true);
                return;
            }
            if (data.function === 'close') {
                Alert.alert('LFX', 'Close requested', [{ text: 'OK' }]);
                return;
            }
        }
    };

    const shouldStart = (navState: any) => {
        try {
            const url = navState.url || '';
            const scheme = url.split('://')[0];
            if (scheme === 'tel' || scheme === 'mailto' || scheme === 'intent' || scheme === 'itms-services') {
                Linking.openURL(url).catch(() => { });
                return false;
            }
            const host = (new URL(url)).host;
            if (!allowedHosts.includes(host)) {
                Linking.openURL(url).catch(() => { });
                return false;
            }
        } catch (_) { }
        return true;
    };

    const onConfirmDeposit = () => {
        setModalVisible(false);
        if (!deposit) return;
        Alert.alert('Deposit requested', `${deposit.amount} ${deposit.ccy} -> ${deposit.toaccount}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <HomeHeader mode="title" title="LFX WebView Demo" showNotification={false} showGoBack />
            <WebView
                ref={webRef}
                originWhitelist={["*"]}
                source={source}
                onMessage={handleMessage}
                onLoadEnd={() => setLoading(false)}
                injectedJavaScript={INJECT_BRIDGE}
                javaScriptEnabled
                domStorageEnabled
                sharedCookiesEnabled
                thirdPartyCookiesEnabled
                onShouldStartLoadWithRequest={shouldStart}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                )}
            />

            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Confirm deposit</Text>
                        {deposit && (
                            <View style={{ marginTop: 12 }}>
                                <Text style={styles.row}>To member: {deposit.tomember}</Text>
                                <Text style={styles.row}>To account: {deposit.toaccount}</Text>
                                <Text style={styles.row}>Currency: {deposit.ccy}</Text>
                                <Text style={styles.row}>Amount: {deposit.amount}</Text>
                            </View>
                        )}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onConfirmDeposit}>
                                <Text style={styles.btnText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        marginTop: 8,
        color: '#374151'
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalCard: {
        width: '86%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    row: {
        fontSize: 14,
        color: '#111827',
        marginTop: 6
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 18
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginLeft: 10
    },
    btnPrimary: {
        backgroundColor: '#0ea5e9'
    },
    btnSecondary: {
        backgroundColor: '#6b7280'
    },
    btnText: {
        color: '#fff',
        fontWeight: '600'
    },
});

export default LFXWebViewDemoScreen;
