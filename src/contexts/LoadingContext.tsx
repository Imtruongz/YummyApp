import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import { LOADING } from '@/assets';
import { colors } from '@/utils';

interface LoadingContextProps {
  LoadingShow: () => void;
  LoadingHide: () => void;
  isVisible: boolean;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const LoadingShow = useCallback(() => {
    setIsVisible(true);
  }, []);

  const LoadingHide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ LoadingShow, LoadingHide, isVisible }}>
      {children}
      <LoadingModal visible={isVisible} />
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Global Loading Modal Component
interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Lottie
            source={LOADING}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
