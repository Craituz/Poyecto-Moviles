import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PedidosScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const [activeTab, setActiveTab] = useState("Todos");

  const tabs = ["Todos", "Pendiente", "En preparación", "Finalizado"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab 
                    ? { backgroundColor: '#E1BEE7' } // Light purple for active
                    : { backgroundColor: '#f0f0f0' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text 
                style={[
                    styles.tabText, 
                    activeTab === tab ? { color: '#4A148C', fontWeight: 'bold' } : { color: '#666' }
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons 
                name="clipboard-text-outline" 
                size={60} 
                color="#ccc" 
            />
             <MaterialCommunityIcons 
                name="check" 
                size={30} 
                color="#ccc" 
                style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'white', borderRadius: 15 }}
            />
        </View>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
            Aún no has realizado pedidos
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 4,
    borderColor: '#e0e0e0',
    borderRadius: 15,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
