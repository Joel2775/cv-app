import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";

type SkillType = "soft" | "hard";

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, updateSkills } = useCVContext();
  const [softSkill, setSoftSkill] = useState("");
  const [hardSkill, setHardSkill] = useState("");
  const [softSkillError, setSoftSkillError] = useState("");
  const [hardSkillError, setHardSkillError] = useState("");

  const addSkill = (type: SkillType) => {
    const value = (type === "soft" ? softSkill : hardSkill).trim();
    const currentSkills =
      type === "soft" ? cvData.softSkills : cvData.hardSkills;
    const setError = type === "soft" ? setSoftSkillError : setHardSkillError;

    if (!value) {
      setError("Escribe una habilidad antes de agregarla.");
      return;
    }

    if (currentSkills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setError("Esa habilidad ya está en la lista.");
      return;
    }

    if (type === "soft") {
      updateSkills([...cvData.softSkills, value], cvData.hardSkills);
      setSoftSkill("");
    } else {
      updateSkills(cvData.softSkills, [...cvData.hardSkills, value]);
      setHardSkill("");
    }
    setError("");
  };

  const removeSkill = (type: SkillType, value: string) => {
    if (type === "soft") {
      updateSkills(
        cvData.softSkills.filter((skill) => skill !== value),
        cvData.hardSkills
      );
    } else {
      updateSkills(
        cvData.softSkills,
        cvData.hardSkills.filter((skill) => skill !== value)
      );
    }
  };

  const renderSkillSection = (
    title: string,
    type: SkillType,
    value: string,
    setValue: (value: string) => void,
    error: string,
    setError: (error: string) => void,
    skills: string[]
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.entryRow}>
        <View style={styles.inputContainer}>
          <InputField
            label="Agregar habilidad"
            placeholder={
              type === "soft"
                ? "Ej: Comunicación, liderazgo"
                : "Ej: Excel, React, análisis de datos"
            }
            value={value}
            onChangeText={(text) => {
              setValue(text);
              if (error) setError("");
            }}
            onSubmitEditing={() => addSkill(type)}
            returnKeyType="done"
            maxLength={50}
            error={error}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Agregar habilidad ${type === "soft" ? "blanda" : "técnica"}`}
          onPress={() => addSkill(type)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Agregar</Text>
        </Pressable>
      </View>

      {skills.length > 0 ? (
        <View style={styles.skillList}>
          {skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Quitar ${skill}`}
                hitSlop={8}
                onPress={() => removeSkill(type, skill)}
                style={styles.removeSkillButton}
              >
                <Text style={styles.removeSkillText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Todavía no agregaste habilidades.</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Habilidades</Text>
      <Text style={styles.description}>
        Agrega habilidades blandas e informáticas para completar tu perfil.
      </Text>

      {renderSkillSection(
        "Habilidades blandas",
        "soft",
        softSkill,
        setSoftSkill,
        softSkillError,
        setSoftSkillError,
        cvData.softSkills
      )}
      {renderSkillSection(
        "Habilidades duras / técnicas",
        "hard",
        hardSkill,
        setHardSkill,
        hardSkillError,
        setHardSkillError,
        cvData.hardSkills
      )}

      <NavigationButton
        title="Volver"
        onPress={() => router.back()}
        variant="secondary"
        style={styles.backButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    color: "#2c3e50",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#7f8c8d",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    color: "#2c3e50",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },
  entryRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  skillChip: {
    alignItems: "center",
    backgroundColor: "#eaf4fb",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  skillText: {
    color: "#2c3e50",
    fontSize: 14,
  },
  removeSkillButton: {
    alignItems: "center",
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  removeSkillText: {
    color: "#e74c3c",
    fontSize: 20,
    lineHeight: 22,
  },
  emptyText: {
    color: "#95a5a6",
    fontSize: 14,
  },
  backButton: {
    marginTop: 8,
  },
});
