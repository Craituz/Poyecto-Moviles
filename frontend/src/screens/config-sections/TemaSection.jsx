import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Switch, List, Divider, Chip } from "react-native-paper";
import { useAppContext } from "../../context/AppContext";

export default function TemaSection({ colors }) {
  const { isDarkTheme, toggleTheme, fontSize, updateFontSize, contrast, updateContrast } = useAppContext();

  const fontSizeOptions = [
    { label: "Pequeño", value: "small", size: 12 },
    { label: "Medio", value: "medium", size: 14 },
    { label: "Grande", value: "large", size: 16 },
  ];

  const contrastOptions = [
    { label: "Normal", value: "normal" },
    { label: "Alto", value: "high" },
  ];

  return (
    <ScrollView style={{ marginBottom: 20 }}>
      <Card style={[styles.section, { backgroundColor: colors.surface }]}>
        <Card.Title
          title="Tema"
          titleStyle={{ color: colors.text, fontSize: 20 }}
        />
        <Card.Content>
          {/* Modo Claro/Oscuro */}
          <View style={styles.optionGroup}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>Modo de Tema</Text>
            <List.Item
              title="Tema Oscuro"
              titleStyle={{ color: colors.text }}
              description={isDarkTheme ? "Activado" : "Desactivado"}
              descriptionStyle={{ color: colors.secondary }}
              right={() => (
                <Switch
                  value={isDarkTheme}
                  onValueChange={toggleTheme}
                  color={colors.primary}
                />
              )}
            />
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Tamaño de Letra */}
          <View style={styles.optionGroup}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>Tamaño de Letra</Text>
            <Text style={[styles.description, { color: colors.secondary }]}>
              Elige el tamaño de fuente que prefieras
            </Text>
            
            <View style={styles.chipContainer}>
              {fontSizeOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={fontSize === option.value}
                  onPress={() => updateFontSize(option.value)}
                  style={[
                    styles.chip,
                    fontSize === option.value && { backgroundColor: colors.primary },
                  ]}
                  textStyle={{
                    color: fontSize === option.value ? "#fff" : colors.text,
                    fontSize: option.size,
                  }}
                >
                  {option.label}
                </Chip>
              ))}
            </View>

            {/* Preview */}
            <View
              style={[styles.previewBox, { backgroundColor: colors.background, borderColor: colors.outline }]}
            >
              <Text style={{ fontSize: fontSizeOptions.find(o => o.value === fontSize)?.size || 14, color: colors.text }}>
                Vista previa del texto
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Contraste */}
          <View style={styles.optionGroup}>
            <Text style={[styles.groupLabel, { color: colors.text }]}>Contraste</Text>
            <Text style={[styles.description, { color: colors.secondary }]}>
              Aumenta el contraste para mejor legibilidad
            </Text>

            <View style={styles.chipContainer}>
              {contrastOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={contrast === option.value}
                  onPress={() => updateContrast(option.value)}
                  style={[
                    styles.chip,
                    contrast === option.value && { backgroundColor: colors.primary },
                  ]}
                  textStyle={{
                    color: contrast === option.value ? "#fff" : colors.text,
                  }}
                >
                  {option.label}
                </Chip>
              ))}
            </View>

            <View
              style={[
                styles.previewBox,
                {
                  backgroundColor: colors.background,
                  borderColor: contrast === "high" ? colors.primary : colors.outline,
                  borderWidth: contrast === "high" ? 2 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: contrast === "high" ? "bold" : "normal",
                }}
              >
                {contrast === "high" ? "Contraste Alto Activado" : "Contraste Normal"}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  optionGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    fontStyle: "italic",
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  chip: {
    borderRadius: 20,
  },
  previewBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
});
