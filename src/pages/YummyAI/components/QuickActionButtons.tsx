import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import colors from '../../../utils/color';
import IconSvg from '../../../components/IconSvg';
import { ImagesSvg } from '../../../utils/ImageSvg';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

interface QuickActionButtonsProps {
  actions: QuickAction[];
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ actions }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.button}
          onPress={action.action}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{action.icon}</Text>
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    minWidth: 100,
  },
  iconContainer: {
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickActionButtons;
