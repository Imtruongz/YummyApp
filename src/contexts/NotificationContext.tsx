import React, { createContext, useState, useContext, ReactNode } from 'react';
import NotificationModal, { NotificationModalProps } from '../components/common/NotificationModal';

interface NotificationContextProps {
  showNotification: (options: Omit<NotificationModalProps, 'visible' | 'onClose'>) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<Omit<NotificationModalProps, 'visible' | 'onClose'>>({
    title: '',
    message: '',
    type: 'info',
  });

  const showNotification = (opts: Omit<NotificationModalProps, 'visible' | 'onClose'>) => {
    setOptions(opts);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <NotificationModal
        visible={visible}
        onClose={hideNotification}
        {...options}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};