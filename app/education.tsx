// app/education.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { DatePickerField } from "../components/DatePickerField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import {
  graduationYearValidator,
  maxLength,
  requiredField,
} from "../utils/form-validation";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Education, "id">>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleAdd = (formData: Omit<Education, "id">, id: string) => {
    addEducation({ id, ...formData });

    // Limpiar formulario
    reset({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <Controller
          control={control}
          name="institution"
          rules={{
            validate: {
              required: requiredField("la institución"),
              maxLength: maxLength(120),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.institution?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="degree"
          rules={{
            validate: {
              required: requiredField("el título o grado"),
              maxLength: maxLength(120),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.degree?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="field"
          rules={{ validate: { maxLength: maxLength(120) } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.field?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="graduationYear"
          rules={{ validate: graduationYearValidator }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Año de Graduación"
              placeholder="Selecciona el año"
              value={value}
              onChangeValue={onChange}
              format="year"
              error={errors.graduationYear?.message}
            />
          )}
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit((formData) => {
            // The ID is generated when the user submits, not during rendering.
            // eslint-disable-next-line react-hooks/purity
            handleAdd(formData, Date.now().toString());
          })}
        />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>
                    {edu.graduationYear}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
