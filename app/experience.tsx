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
import { Experience } from "../types/cv.types";
import { formatDateValue } from "../utils/date";
import {
  endDateValidator,
  maxLength,
  requiredField,
} from "../utils/form-validation";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleAdd = (formData: Omit<Experience, "id">, id: string) => {
    addExperience({ id, ...formData });

    // Limpiar formulario
    reset({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <Controller
          control={control}
          name="company"
          rules={{
            validate: {
              required: requiredField("la empresa"),
              maxLength: maxLength(120),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.company?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          rules={{
            validate: {
              required: requiredField("el cargo"),
              maxLength: maxLength(120),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.position?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="startDate"
          rules={{ validate: requiredField("la fecha de inicio") }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Inicio *"
              placeholder="Selecciona mes y año"
              value={value}
              onChangeValue={(date) => {
                onChange(date);
                void trigger("endDate");
              }}
              format="monthYear"
              error={errors.startDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{
            validate: (endDate) =>
              endDateValidator(getValues("startDate"))(endDate),
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Fin"
              placeholder="Selecciona mes y año"
              value={value}
              onChangeValue={onChange}
              format="monthYear"
              clearable
              error={errors.endDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{ validate: { maxLength: maxLength(1000) } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit((formData) => {
            // The ID is generated when the user submits, not during rendering.
            // eslint-disable-next-line react-hooks/purity
            handleAdd(formData, Date.now().toString());
          })}
        />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {formatDateValue(exp.startDate, "monthYear")}
                    {" - "}
                    {exp.endDate
                      ? formatDateValue(exp.endDate, "monthYear")
                      : "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
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
